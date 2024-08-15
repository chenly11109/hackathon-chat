import { Upload } from 'lucide-react';
import Dropzone, { DropzoneState } from 'shadcn-dropzone';


export function BriefParser({
    onFileUpload
}: {
    onFileUpload: (file: File) => void
}) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white">
            <div className="flex flex-col justify-center items-center pb-36">
                <img src="/tezign.png" alt="" className="w-40 translate-y-10" />
                <h2 className="font-semibold text-5xl z-10">Where Creative Begins</h2>

                <p className="mb-10 mt-6 text-sm text-gray-500">上传客户项目需求文件，启动你的项目设计助手</p>



            </div>
        </div>
    )
}
