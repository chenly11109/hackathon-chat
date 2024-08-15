import Image from 'next/image';

function RecommendedQuestion({ question, askFirstQuestion }: { askFirstQuestion: (content: string) => Promise<void>, question: string }) {
    return <div
        className='border border-1 rounded text-gray-600 px-2 py-1 cursor-pointer hover:text-black bg-white duration-300 transition-all'
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
                <h2 className="font-semibold text-5xl z-10">Where Creative Begins</h2>
                <p className="mb-10 mt-6 text-sm text-gray-500">你的智能售前小助手上线啦 ～</p>


                <div className='flex gap-2 w-full justify-center'>
                    <RecommendedQuestion askFirstQuestion={askFirstQuestion} question={'商品合成图的应用场景是什么？'} />
                    <RecommendedQuestion askFirstQuestion={askFirstQuestion} question={'怎么进行包装设计的模型训练？'} />
                    <RecommendedQuestion askFirstQuestion={askFirstQuestion} question={'知识库解决了哪些用户痛点？'} />
                </div>

            </div>
        </div>
    )
}
