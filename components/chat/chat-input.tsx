import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { SendHorizonal, Upload as IconUpload } from 'lucide-react'
import React from "react"
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { twMerge } from 'tailwind-merge'

export type Role = "user" | "assistant"

export interface IMessage {
    role: Role
    content: string
}

export function ChatInput({
    sendMessage
}: {
    sendMessage: (message: string) => void
}) {

    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = React.useState('')
    const [file, setFile] = React.useState('')

    return (
        <div className='fixed bottom-0 w-[calc(100vw-18rem)]'>
            <form
                ref={formRef}
                onSubmit={async (e: any) => {
                    e.preventDefault()
                    if (!inputRef.current) return

                    const value = inputRef.current.value.trim()
                    setInput('')
                    if (!value) return
                    sendMessage(value)
                }}
            >
                <div className={twMerge("relative flex max-h-60 w-full rounded-2xl shadow-md bg-white mx-auto w-screen", "md:w-auto md:mx-10")}>
                    <Textarea
                        ref={inputRef}
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                        placeholder="发送消息"
                        className="h-full text-sm w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none p-4 rounded-2xl"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        name="message"
                        rows={3}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />

                    <div className="absolute right-12 bottom-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="submit" size="icon" disabled={!!file} className='w-8 h-8' aria-label="send">
                                    <IconUpload className='w-5 h-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>上传文件</TooltipContent>
                        </Tooltip>

                    </div>

                    <div className="absolute right-2 bottom-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="submit" size="icon" disabled={input === ''} className='w-8 h-8' aria-label="send">
                                    <SendHorizonal className='w-5 h-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>发送</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <div className={twMerge('h-8 flex justify-center items-center w-full bg-gray-100 text-xs text-gray-500 hidden', 'md:block')}>内容由 AI 大模型生成，请仔细甄别</div>
            </form>
        </div>
    )
}
