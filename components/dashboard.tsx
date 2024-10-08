import {
    LoaderCircle,
    Menu,
    MessageSquareDashed,
    SquarePen,
    Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogPortal,
    DialogTitle
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { parseFile } from "@/lib/omni-parse"
import { cn } from "@/lib/utils"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import axios from "axios"
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from "react"
import { useDebounceCallback, useLocalStorage } from "usehooks-ts"
import { proxy, subscribe, useSnapshot } from "valtio"
import { BriefParser } from "./brief-parser"
import { Chat, IMessage } from "./chat"
import { Input } from "./ui/input"
import { useToast } from "./ui/use-toast"
import { twMerge } from "tailwind-merge"
import { IFile } from "./chat"
import { ChatInput } from "./chat/chat-input"



const renderHTML = (content: string) => {
    return '*' + content
        .replace(/\(https?:\/\/[^\)]+\)/, "以下内容来源于：").replace(/[()]/g, "")
        .replace(/https?:\/\/[^\s]+/g, "")
        .replace(/<h1>/g, '')
        .replace(/<\/h1>/g, ',')
        .replace(/<h2>/g, '')
        .replace(/<\/h2>/g, ',')
        .replace(/<h3>/g, '')
        .replace(/<\/h3>/g, ',')
        .replace(/<h4>/g, '')
        .replace(/<\/h4>/g, ',')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, ',').substring(0, 100) + '...*\n'
}

export interface IFileMeta {
    file_name: string
    file_size: number
}

export interface ISession {
    sessionId: string
    name: string
    startConversation: boolean
    fileMeta?: IFileMeta
    difyConversationId?: string
}

const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
const AuthHeader = {
    'Authorization': `Bearer ${apiKey}`,
}

const defaultSession = {
    sessionId: "DEFAULT",
    name: "默认对话",
    startConversation: false,
}

const initState: {
    sessions: Record<string, ISession>
    currentSessionId: string
} = {
    sessions: { [defaultSession.sessionId]: defaultSession },
    currentSessionId: defaultSession.sessionId,
}

const initMessagesState: Record<string, IMessage[]> = {}

const state = proxy(initState)
const messagesState = proxy(initMessagesState)

const dialogState = proxy({
    open: false,
    sessionId: '',
})

export function Dashboard({
    userId,
}: {
    userId: string
}) {

    const { toast } = useToast()

    const [init, setInit] = useState(false)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const { sessions, currentSessionId } = useSnapshot(state)
    const messages = useSnapshot(messagesState)
    const dialog = useSnapshot(dialogState)
    const [value, setValue, removeValue] = useLocalStorage('USER_SESSION_STATE', "")

    const chatRef = useRef<HTMLDivElement>(null)
    const taskIdRef = useRef("")
    const nameInputRef = useRef<HTMLInputElement>(null)
    const signalRef = useRef(new AbortController())

    useEffect(() => {
        if (value !== "") {
            const { sessions, currentSessionId } = JSON.parse(value)
            state.sessions = sessions
            state.currentSessionId = currentSessionId
            loadMesages(currentSessionId)
        }
        setInit(true)
        const unsubscribe = subscribe(state, () => {
            console.log(JSON.stringify(state))
            setValue(JSON.stringify(state))
        })
        return unsubscribe
    }, [])

    const scrollToBottom = useDebounceCallback(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({ behavior: 'smooth', top: chatRef.current.scrollHeight })
        }
    }, 200)

    const addSession = () => {
        const newSession = {
            sessionId: nanoid(),
            name: "未命名对话",
            startConversation: false,
        }
        state.sessions[newSession.sessionId] = newSession
        state.currentSessionId = newSession.sessionId
    }

    const changeSession = (sessionId: string) => {
        if (state.currentSessionId === sessionId) return
        state.currentSessionId = sessionId
        loadMesages(sessionId)
    }

    const removeSession = (sessionId: string) => {
        const session = state.sessions[sessionId]
        delete state.sessions[sessionId]
        if (sessionId === state.currentSessionId) {
            state.currentSessionId = defaultSession.sessionId
            loadMesages(defaultSession.sessionId)
        }
        if (session.difyConversationId) {
            axios.delete(`https://dify.tezign.com/v1/conversations/${session.difyConversationId}`, {
                headers: {
                    ...AuthHeader,
                    'Content-Type': 'application/json',
                },
                data: {
                    user: userId,
                }
            })
        }
    }

    const onRenameSession = () => {
        if (!nameInputRef.current || !nameInputRef.current.value) return
        if (nameInputRef.current) state.sessions[dialogState.sessionId].name = nameInputRef.current.value
        dialogState.open = false
    }


    const askFirstQuestion = async (content: string) => {
        const message: IMessage = {
            role: 'user',
            type: 'text',
            content,
            status: 'finished'
        }
        const sessionId = state.currentSessionId
        messagesState[sessionId] = [message]
        try {
            state.sessions[sessionId] = {
                ...state.sessions[sessionId],
                startConversation: true,
            }
            _sendMessageToDify(sessionId, content)
        } catch (e) {
            console.log(e)
            messagesState[sessionId][0].status = 'error'
            toast({
                title: "查找数据库失败",
                description: "服务器可能无法访问，请稍后重试",
                variant: "destructive",
            })
        }
    }


    const onFileUpload = async (file: File) => {
        const message: IMessage = {
            type: "file",
            role: "user",
            meta: {
                file_name: file.name,
                file_size: file.size,
            },
            content: "",
            status: "parsing",
        }
        const sessionId = state.currentSessionId
        messagesState[sessionId] = [message]
        try {
            const text = await parseFile(file)
            messagesState[sessionId][0].meta.file_content = text
            messagesState[sessionId][0].status = 'finished'

            // setValue(JSON.stringify(state))
            state.sessions[sessionId] = {
                ...state.sessions[sessionId],
                startConversation: true,
                name: file.name.replace(/\.[^/.]+$/, ""),
                fileMeta: {
                    file_name: file.name,
                    file_size: file.size,
                }
            }
            // console.log(JSON.stringify(state))
            _sendMessageToDify(sessionId, text)
        } catch (e) {
            messagesState[sessionId][0].status = 'error'
            toast({
                title: "文件解析失败",
                description: "服务器可能无法访问，请稍后重试",
                variant: "destructive",
            })
        }
    }


    const uploadFile = async (file: File) => {
        try {
            const text = await parseFile(file)
            const parsedFile = {
                content: text,
                meta: {
                    file_name: file.name,
                    file_size: file.size,
                    file_content: text
                }
            }
            return parsedFile
        } catch (e) {
            toast({
                title: "文件解析失败",
                description: "服务器可能无法访问，请稍后重试",
                variant: "destructive",
            })
        }
    }

    const sendMessageWithFile = async ({ content, file }: {
        content: string, file: IFile
    }) => {
        if (!messagesState[state.currentSessionId]) {
            messagesState[state.currentSessionId] = []
        }

        messagesState[state.currentSessionId].push({
            role: 'user',
            type: 'file',
            ...file,
            status: "finished",

        })
        messagesState[state.currentSessionId].push({
            role: 'user',
            type: 'text',
            content
        })
        scrollToBottom()
        const sendText = `${content}\n以下是用户提供的文件:\n\`\`\`\n${file.content}\n\`\`\``
        _sendMessageToDify(state.currentSessionId, sendText)
    }

    const sendMessage = async (content: string) => {

        if (!messagesState[state.currentSessionId]) {
            messagesState[state.currentSessionId] = []
        }
        messagesState[state.currentSessionId].push({
            role: 'user',
            type: 'text',
            content,
        })
        scrollToBottom()
        _sendMessageToDify(state.currentSessionId, content)
    }

    const _sendMessageToDify = async (sessionId: string, message: string) => {
        if (message === "") return
        const messageIndex = messagesState[sessionId].length

        signalRef.current = new AbortController()
        fetchEventSource(`https://dify.tezign.com/v1/workflows/run`, {
            method: 'POST',
            headers: {
                ...AuthHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {
                    "user_query": message
                },
                response_mode: "streaming",
                conversation_id: state.sessions[sessionId].difyConversationId || '',
                user: userId,
            }),
            async onopen(resp) {
                if (resp.status === 500) {
                    messagesState[sessionId].push({
                        type: 'text',
                        role: "assistant",
                        content: '服务端异常，请联系「AIGC Studio」解决！',
                        status: "error",
                    })
                } else {
                    messagesState[sessionId].push({
                        type: 'markdown',
                        query: message,
                        role: "assistant",
                        content: '',
                        status: "pending",
                    })
                }
            },
            onmessage(ev) {
                if (!ev.data.trim().startsWith("{")) return
                const data = JSON.parse(ev.data)
                // console.log(data)
                if ("workflow_started" === data.event) {
                    taskIdRef.current = data.task_id
                    state.sessions[sessionId] = { ...state.sessions[sessionId], difyConversationId: data.conversation_id }
                }

                if ("node_started" === data.event) {
                    if (!messagesState[sessionId][messageIndex].loadingText) {
                        messagesState[sessionId][messageIndex].loadingText = []
                    }
                    messagesState[sessionId][messageIndex].loadingText.push(data.data.title)
                }
                if ("text_chunk" === data.event) {
                    messagesState[sessionId][messageIndex].content += data.data.text
                    if (messagesState[sessionId][messageIndex].status !== 'receiving') {
                        messagesState[sessionId][messageIndex].status = 'receiving'
                    }
                    scrollToBottom()
                }
                if ("workflow_finished" === data.event) {
                    if (data.data?.outputs.retrieval_results) {
                        messagesState[sessionId][messageIndex].content += '\n\n---\n'

                        messagesState[sessionId][messageIndex].content += '### 资料来源：\n'

                        data.data?.outputs.retrieval_results?.forEach((item: any, index: number) => {
                            messagesState[sessionId][messageIndex].content += `\n ${index + 1}. ${item?.title}\n${item?.content ? renderHTML(item?.content) : ''}`
                        })

                    }
                    messagesState[sessionId][messageIndex].status = 'finished'



                }
                if ("error" === data.event) {
                    messagesState[sessionId][messageIndex].status = 'error'
                    messagesState[sessionId][messageIndex].content = data.message
                }
            },
            onclose() {

            },
            onerror(error) {
                throw error
            },
            openWhenHidden: true,
            signal: signalRef.current.signal,
        }).catch((e) => {
            console.log(e)
        }).finally(() => {

        })
    }

    const stopReceivingMessage = async () => {
        if (signalRef.current) {
            signalRef.current.abort()
        }
        messagesState[state.currentSessionId][messagesState[state.currentSessionId].length - 1].status = 'normal'
        if (taskIdRef.current) {
            await axios.post(`https://dify.tezign.com/v1/workflows/run/${taskIdRef.current}/stop`, { user: userId }, { headers: AuthHeader })
        }
    }

    const loadMesages = async (sessionId: string) => {
        if (!state.sessions[sessionId].difyConversationId) return
        setIsLoadingMessages(true)
        const session = state.sessions[sessionId]
        axios.get(`https://dify.tezign.com/v1/messages?user=${userId}&conversation_id=${session.difyConversationId}`, {
            headers: AuthHeader
        }).then(resp => {
            messagesState[sessionId] = []
            resp.data.data.forEach((item: any, index: number) => {
                // if (index === 0) {
                //     messagesState[sessionId].push({
                //         type: "file",
                //         role: "user",
                //         meta: {
                //             file_name: session.fileMeta?.file_name,
                //             file_size: session.fileMeta?.file_size || 0,
                //             file_content: item.query
                //         },
                //         content: "",
                //         status: "finished",
                //     })
                // } else {
                messagesState[sessionId].push({
                    role: 'user',
                    type: 'text',
                    content: item.query,
                })
                // }
                if (item.status === 'error') {
                    messagesState[sessionId].push({
                        role: 'assistant',
                        type: 'markdown',
                        content: item.error,
                        status: 'error',
                    })
                } else {
                    messagesState[sessionId].push({
                        role: 'assistant',
                        type: 'markdown',
                        content: item.answer,
                        status: 'finished',
                    })
                }
            })
        }).finally(() => {
            setIsLoadingMessages(false)
        })
    }

    const onReset = () => {
        localStorage.removeItem('USER_SESSION_STATE')
        localStorage.removeItem('USER_ID')
        location.reload()
    }

    if (!init) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <LoaderCircle className="w-6 h-6 animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex flex-row">
            <div className={twMerge("w-72 h-full border-r flex-none hidden",
                "md:block"
            )}>
                <div className="p-4 border-b flex flex-row items-center justify-between">
                    <span className="font-semibold text-xl">AIGC 知识助手</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger aria-label="menu">
                            <Menu className="w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-500" onClick={onReset}>重置全部</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="h-[calc(100vh-61px)] overflow-y-scroll hide-scrollbar">
                    <div className="w-full px-4 pt-4 sticky top-0">
                        <Button variant="outline" className="w-full" onClick={addSession}>添加新对话</Button>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        {
                            Object.values(sessions).map(item => (
                                <div
                                    key={item.sessionId}
                                    className={cn("group flex flex-row cursor-pointer items-center justify-between gap-2 rounded-md p-3 text-sm hover:bg-gray-100", currentSessionId === item.sessionId ? 'bg-gray-100' : '')}
                                    onClick={() => changeSession(item.sessionId)}
                                >
                                    <div className="flex flex-row items-center gap-2">
                                        <MessageSquareDashed className="text-gray-500 w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {
                                        item.sessionId !== "DEFAULT" && (
                                            <div className="flex flex-row gap-2 items-center">
                                                <SquarePen className="hidden group-hover:inline-block w-5 h-5 text-gray-600" onClick={e => {
                                                    e.stopPropagation()
                                                    dialogState.sessionId = item.sessionId
                                                    // dialogState.sessionName = item.name
                                                    dialogState.open = true
                                                    setTimeout(() => {
                                                        if (nameInputRef.current) nameInputRef.current.value = item.name
                                                    }, 50)
                                                }} />
                                                <Trash2 className="hidden group-hover:inline-block w-5 h-5 text-red-600" onClick={e => {
                                                    e.stopPropagation()
                                                    removeSession(item.sessionId)
                                                }} />
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={"h-full grow bg-gray-100"}>
                {
                    isLoadingMessages ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <LoaderCircle className="w-6 h-6 animate-spin" />
                        </div>
                    ) : (messages[currentSessionId] || []).length > 0 ? (
                        <Chat
                            ref={chatRef}
                            messages={messages[currentSessionId] as IMessage[] || []}

                            stopReceivingMessage={stopReceivingMessage}
                        />
                    ) : <BriefParser askFirstQuestion={askFirstQuestion} />
                }

                <ChatInput
                    sendMessage={sendMessage}
                    sendMessageWithFile={sendMessageWithFile}
                    uploadFile={uploadFile}
                />
            </div>

            <Dialog open={dialog.open} onOpenChange={v => dialogState.open = v}>
                <DialogPortal forceMount={true}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>修改名称</DialogTitle>
                        </DialogHeader>
                        <Input
                            ref={nameInputRef}
                            className="w-full"
                        />
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => dialogState.open = false}>取消</Button>
                            <Button type="button" onClick={onRenameSession}>保存</Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    )
}
