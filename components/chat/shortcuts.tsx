import { Button } from "../ui/button";

export function Shortcuts({
    sendMessage
}: {
    sendMessage: (content: string) => void
}) {
    const values = [
        "输出标准Brief",
        "推荐创意方",
        "制作Timeline",
        "执行SOP",
        "制作报价单",
        "输出项目日志",
    ]
    return (
        <div className='w-full space-y-2 max-w-screen-md '>
            <div className='w-full flex flex-row items-center gap-4'>
                <div className='border-dashed border-t grow'></div>
                <span className='text-sm font-semibold text-gray-700'>在以上内容继续</span>
                <div className='border-dashed border-t grow'></div>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
                {
                    values.map((item, index) => (
                        <Button key={index} variant="ghost" size={"sm"} className="text-gray-500" onClick={() => sendMessage(item)}>{index + 1} {item}</Button>
                    ))
                }
            </div>
        </div>
    )
}
