import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { SendHorizonal, Upload as IconUpload, X } from 'lucide-react'
import React from "react"
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { twMerge } from 'tailwind-merge'
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { IChatInput, IFile, FileRender } from '.'

export type Role = "user" | "assistant"

export interface IMessage {
    role: Role
    content: string
}

export function ChatInput({
    sendMessage,
    sendMessageWithFile,
    uploadFile
}: IChatInput) {

    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = React.useState('')
    const [file, setFile] = React.useState<IFile & { status: string } | null>(null)

    return (
        <div className='fixed bottom-0 w-[calc(100vw-18rem)]'>
            <form
                ref={formRef}
                onSubmit={async (e: any) => {
                    e.preventDefault()
                    if (!inputRef.current) return

                    const value = inputRef.current.value.trim()
                    setInput('')
                    setFile(null)
                    if (!value) return

                    if (!file) {
                        sendMessage(value)
                    }
                    if (file) {
                        sendMessageWithFile({
                            content: value,
                            file
                        })
                    }

                }}
            >
                <div className={twMerge("relative max-h-60 w-full rounded-2xl mx-auto w-screen", "md:w-auto md:mx-10")}>

                    {file &&
                        <div className='relative group -translate-y-2 z-10 w-[255px]'>
                            <X className='absolute bg-white w-5 h-5 z-10 -right-2 -top-2 border border-1 text-neutral-500 border-neutral-500 hidden group-hover:block cursor-pointer rounded-[20px]'
                                onClick={() => {
                                    setFile(null)
                                }}
                            />
                            <FileRender
                                message={{
                                    status: file.status,
                                    type: 'file',
                                    role: 'user',
                                    content: file.content,
                                    meta: file.meta

                                }}
                            />
                        </div>
                    }
                    <Textarea
                        ref={inputRef}
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                        placeholder="发送消息"
                        className="h-full shadow-md text-sm w-full resize-none bg-white px-4 py-[1.3rem] focus-within:outline-none p-4 rounded-2xl"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        name="message"
                        rows={3}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />


                    <Dropzone
                        dropZoneClassName="border-0"
                        accept={{
                            'application/pdf': ['.pdf'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                            'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
                            'image/png': ['.png'],
                            'image/jpeg': ['.jpg', '.jpeg'],
                            'image/gif': ['.gif'],
                            'video/mp4': ['.mp4'],
                            'video/x-matroska': ['.mkv'],
                            'video/avi': ['.avi'],
                            'video/quicktime': ['.mov'],
                            'audio/mp3': ['.mp3'],
                            'audio/wav': ['.wav'],
                            'audio/aac': ['.aac'],
                            'application/msword': ['.doc'],
                            'application/vnd.oasis.opendocument.text': ['.odt'],
                            'image/tiff': ['.tiff'],
                            'image/bmp': ['.bmp'],
                            'image/heic': ['.heic'],
                        }}
                        onDrop={async (acceptedFiles: File[]) => {
                            const file = acceptedFiles[0]
                            setFile({
                                status: 'pending',
                                content: '',
                                meta: {
                                    file_name: file.name,
                                    file_size: file.size,
                                    file_content: ''
                                }
                            })
                            const parsedFile = await uploadFile(file)
                            if (parsedFile) { setFile({ ...parsedFile, status: 'finished' }) } else {
                                setFile(null)
                            }
                        }}
                    >
                        {(dropzone: DropzoneState) => (
                            <div className="absolute right-12 bottom-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" disabled={!!file} className='w-8 h-8' aria-label="send">
                                            <IconUpload className='w-5 h-5' />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>上传文件</TooltipContent>
                                </Tooltip>

                            </div>
                        )}
                    </Dropzone>

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
                <div className={twMerge('h-8 flex justify-center text-center w-full text-xs text-gray-500 hidden', 'md:block')}>内容由Tezign内部AI大模型生成，最终解释权归Tezign所有</div>
            </form>
        </div>
    )
}
