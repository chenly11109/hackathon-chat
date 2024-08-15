import axios from "axios";
import { base64ToBlob } from "./utils";

export interface DocumentImage {
    image: string
    image_name: string
}

const MultipartHeaders = {
    'Content-Type': 'multipart/form-data'
}

export async function parseImage(file: File, task: string = 'More Detailed Caption') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('task', task);
    const { data } = await axios.post(`/api/parse/parse_image/process_image`, formData, { headers: MultipartHeaders })
    return data.text.substring(29, data.text.length - 2).replace('\\n', '')
}

export async function parseBase64Image(base64Image: string, task: string = 'More Detailed Caption') {
    const formData = new FormData();
    formData.append('image', base64ToBlob(base64Image), 'image.png');
    formData.append('task', task);
    const { data } = await axios.post(`/api/parse/parse_image/process_image`, formData, { headers: MultipartHeaders })
    return data.text.substring(29, data.text.length - 2).replace('\\n', '')
}

export async function parseDocument(file: File) {
    const { data } = await axios.post('/api/parse/parse_document', { file }, { headers: MultipartHeaders })
    let result = data.text
    for (const image of data.images) {
        const imageDescription = await parseBase64Image(image.image)
        const matchResult = result.match(new RegExp(`!\\[${image.image_name}\\]\\(${image.image_name}\\)`, 'i'))
        if (matchResult) {
            result = result.replace(matchResult[0], imageDescription)
        }
    }
    return result
}

export async function parseVideo(file: File) {
    const { data } = await axios.post(`/api/parse/parse_media/video`, { file }, { headers: MultipartHeaders })
    return data.text
}

export async function parseAudio(file: File) {
    const { data } = await axios.post(`/api/parse/parse_media/audio`, { file }, { headers: MultipartHeaders })
    return data.text
}

export async function parseWebsite(url: string) {
    const { data } = await axios.post(`/api/parse/parse_website`, { url })
    return data.text
}

export const parseFile = async (file: File) => {
    if ([
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",
        "application/msword",
        "application/vnd.oasis.opendocument.text",
    ].includes(file.type)) {
        return await parseDocument(file)
    } else if ([
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/tiff",
        "image/bmp",
        "image/heic"
    ].includes(file.type)) {
        return await parseImage(file)
    } else if ([
        "video/mp4",
        "video/x-matroska",
        "video/avi",
        "video/quicktime",
    ].includes(file.type)) {
        return await parseVideo(file)
    } else if ([
        "audio/mp3",
        "audio/wav",
        "audio/aac",
    ].includes(file.type)) {
        return await parseAudio(file)
    } else {
        throw new Error("不支持的文件类型");
    }
}