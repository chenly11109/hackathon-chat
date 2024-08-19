import Image from 'next/image';
import { ChatInput } from './chat/chat-input';

function RecommendedQuestion({ question, askFirstQuestion }: { askFirstQuestion: (content: string) => Promise<void>, question: string }) {
    return <div
        className='border
        mt-2 w-auto text-center
        border-1 rounded text-gray-600 px-2 py-1 cursor-pointer hover:text-black bg-white duration-300 transition-all'
        onClick={() => {
            askFirstQuestion(question)
        }}
    >
        {question}
    </div>
}



export function BriefParser({
    askFirstQuestion
}: {
    askFirstQuestion: (content: string) => Promise<void>
}) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white">
            <div className="flex flex-col justify-center items-center pb-36">
                <Image
                    width={160}
                    height={160}
                    src="/tezign.png" alt="tezign" className="w-40 translate-y-10" />
                <h2 className="font-semibold text-5xl z-10">Where AIGC Begins</h2>
                <p className="mb-10 mt-6 text-sm text-gray-500">你的智能售前小助手上线啦 ～</p>


                <div className='gap-2 justify-center'>
                    <RecommendedQuestion askFirstQuestion={askFirstQuestion} question={'Tezign商品合成图功能的壁垒是什么？'} />
                    <RecommendedQuestion askFirstQuestion={askFirstQuestion} question={'请帮我介绍一下赫莲娜的商品图模型训练这个案例， 为什么要训练赫莲娜的模型？'} />
                    <RecommendedQuestion askFirstQuestion={askFirstQuestion} question={'请帮我介绍一下玛氏的包装设计模型训练这个案例， 为什么要训练玛氏德芙巧克力的模型？'} />
                </div>

            </div>
        </div>
    )
}
