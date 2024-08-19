import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { bytesToReadableString } from "@/lib/files"
import { Check, CircleStop, File as IconFile, LoaderCircle, ThumbsDown, ThumbsUp, X } from "lucide-react"
import React, { FC, memo } from "react"
import ReactMarkdown, { Options } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Button } from "../ui/button"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export type Role = "user" | "assistant"
export type MessageType = "text" | "file" | "markdown"

export interface IMessage {
    type: MessageType
    role: Role
    query?: string
    content: string
    meta?: any
    status?: string
    loadingText?: string[]
}


enum ThumbsUpType {
    bad = -1,
    good = 1,
    none = 0
}
interface IAnswer {
    requestBody: string;
    responseBody: string;
    thumbsUpType: ThumbsUpType
}


async function recordAnswer(props: IAnswer) {
    const res = await axios.post('https://vms-service.test.tezign.com/dam-aigc/hackathon-request-records/public/save-request-records', props,
        {
            headers: {
                'x-asm-prefer-tag': 'version-env-06'
            }
        }
    )
    return res
}

export const MemoizedReactMarkdown: FC<Options> = memo(
    ReactMarkdown,
    (prevProps, nextProps) =>
        prevProps.children === nextProps.children &&
        prevProps.className === nextProps.className
)

export function FileRender({ message }: { message: IMessage }) {
    return <Sheet>
        <SheetTrigger>
            <div className="w-64 space-x-2 flex flex-row border-gray-200 relative border text-gray-900 bg-white rounded-xl px-3 py-2">
                <IconFile className="w-10 h-10 text-gray-600" />
                <div className="flex flex-col gap-1 flex-1 text-left">
                    <span className="line-clamp-1 text-sm w-40 text-ellipsis overflow-hidden">{message.meta.file_name}</span>
                    <div className="flex flex-row justify-between text-xs w-full">
                        <span className="text-gray-500">{bytesToReadableString(message.meta.file_size)}</span>
                    </div>
                </div>
                {
                    message.status === 'finished' ? (
                        <Check className="w-4 h-4 absolute text-green-500 right-1 bottom-1" />
                    ) : message.status === 'error' ? (
                        <X className="w-4 h-4 text-red-500 absolute right-1 bottom-1" />
                    ) : (
                        <LoaderCircle className="w-4 h-4 text-blue-500 absolute right-1 bottom-1 animate-spin" />
                    )
                }
            </div>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
            <SheetHeader>
                <SheetTitle>文件详情</SheetTitle>
                <SheetDescription className="whitespace-pre-wrap">
                    {
                        message.meta.file_content
                    }
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>
}

export function ChatMessage({
    message,
    stopReceivingMessage
}: {
    message: IMessage,
    stopReceivingMessage?: () => void,
}) {

    const [good, setIsGood] = React.useState<boolean | undefined>(undefined)

    if (message.type === "file") {
        return (
            <FileRender message={message} />
        )
    }

    if (message.status === 'error') {
        return (
            <div className="border border-red-300 text-red-600 bg-white rounded-xl px-3 py-2 text-sm font-medium">{message.content}</div>
        )
    }

    if (message.type === "text") {
        return (
            <div className="border text-gray-900 bg-white rounded-xl px-3 py-2 text-sm">{message.content}</div>
        )
    }
    return (
        <div className="flex flex-col gap-2 relative">
            <div className={twMerge("bg-white rounded-xl px-3 py-2 min-h-10 md:min-w-16 relative border")}>
                {
                    message.status === 'pending' && <Image
                        width={60}
                        height={60}
                        alt="bars.svg"
                        src="/bars.svg" className="h-8 ml-1" />
                }

                {
                    message.status === 'pending' &&
                    message.loadingText?.length &&
                    <div className="mx-5 my-2">{
                        message.loadingText.map((item, index) => <div
                            className="text-sm text-neutral-500 w-[200px]"
                            key={index}>
                            {item + '...'}
                        </div>)}
                    </div>
                }
                <MemoizedReactMarkdown
                    className="prose prose-sm max-w-screen-md break-words prose-p:leading-relaxed prose-pre:p-0 prose-a:text-blue-500 prose-h1:mb-2 prose-h2:mt-0 prose-h2:mb-2 text-gray-900 "
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            return <p className="mb-2 last:mb-0 whitespace-pre-line">{children}</p>
                        },
                        a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />
                    }}
                >
                    {message.content}
                </MemoizedReactMarkdown>
                {
                    message.status === 'receiving' && <LoaderCircle className="w-4 h-4 text-blue-500 absolute right-1 bottom-1 animate-spin" />
                }
            </div>


            {message.status === 'finished' &&
                <div className="w-full flex justify-end gap-2 pr-4">
                    <ThumbsUp className={twMerge("cursor-pointer text-gray-400 hover:text-gray-800 duration-300 transition-all",
                        good === true && "fill-black text-black cursor-not-allowed",
                        good !== undefined && "cursor-not-allowed",
                        good === false && 'hover:text-gray-400'
                    )
                    }
                        onClick={async () => {
                            if (good === undefined) {
                                setIsGood(true)

                                console.log({
                                    requestBody: message.query || '',
                                    responseBody: message.content,
                                    thumbsUpType: ThumbsUpType.good
                                })
                                const res = await recordAnswer({
                                    requestBody: message.query || '',
                                    responseBody: message.content,
                                    thumbsUpType: ThumbsUpType.good
                                })
                                console.log(res)
                            }
                        }}
                    /><ThumbsDown className={twMerge("cursor-pointer text-gray-400 hover:text-gray-800 duration-300 transition-all",
                        good === false && "fill-black text-black cursor-not-allowed",
                        good !== undefined && "cursor-not-allowed",
                        good === true && 'hover:text-gray-400'
                    )}
                        onClick={async () => {
                            if (good === undefined) {
                                setIsGood(false)

                                console.log({
                                    requestBody: message.query || '',
                                    responseBody: message.content,
                                    thumbsUpType: ThumbsUpType.bad
                                })
                                const res = await recordAnswer({
                                    requestBody: message.query || '',
                                    responseBody: message.content,
                                    thumbsUpType: ThumbsUpType.good
                                })
                                console.log(res)
                            }
                        }}
                    />
                </div>}

            {
                message.status === 'receiving' && stopReceivingMessage && (
                    <div className="flex flex-row items-center" onClick={stopReceivingMessage}>
                        <Button size={'sm'} variant="outline" className="rounded-full">
                            <CircleStop className="w-4 h-4 mr-2" />
                            停止回复
                        </Button>
                    </div>
                )
            }

        </div>
    )
}

export interface IFile {
    content: string,
    meta: {
        file_name: string,
        file_size: number
        file_content: string
    }
}

export interface IChatInput {
    sendMessage: (content: string) => void,
    sendMessageWithFile: ({ content, file }: { content: string, file: IFile }) => void,
    uploadFile: (file: File) => Promise<IFile | undefined>
}
export type ChatProps = {
    messages: IMessage[],
    stopReceivingMessage: () => void,
}

const Chat = React.forwardRef<HTMLDivElement, ChatProps>(
    ({ messages, stopReceivingMessage, ...props }, ref) => {
        return (
            <div ref={ref} className="w-full h-full overflow-x-hidden overflow-y-auto pb-36" {...props} id={"hello"}>
                <div className="flex flex-col gap-4 p-8 w-full max-w-screen-md mx-auto">
                    {
                        messages.map((message, index) => {
                            if (message.role === "user") {
                                return (
                                    <div className={"flex flex-row gap-2 justify-end mr-10 md:w-full md:mr-0 relative"} key={index}>
                                        <ChatMessage message={message} />
                                        <Image
                                            alt="avatar"
                                            width={40}
                                            height={40}
                                            src="/avatar-user.png" className="rounded-full bg-white w-10 h-10 flex items-center justify-center absolute -top-0.5 -right-12" />
                                    </div>
                                )
                            }
                            return (
                                <div className={"flex flex-row gap-2 ml-10 md:w-full md:ml-0 relative"} key={index}>
                                    <Image src="/avatar-ai.jpeg"
                                        width={40}
                                        height={40}
                                        alt="avatar"
                                        className="rounded-full bg-gray-400 w-10 h-10 min-w-10 min-h-10 flex items-center justify-center absolute -top-0.5 -left-12" />
                                    <ChatMessage message={message} stopReceivingMessage={stopReceivingMessage} />
                                </div>
                            )
                        })
                    }

                </div>

            </div>
        )
    }
)
Chat.displayName = "Chat"

export { Chat }
