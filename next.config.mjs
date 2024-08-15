/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/parse/:path*',
        destination: 'https://49d17bf8e1dd5ebf-8000.cn-northwest-2.paigpu.com/:path*'
      },
    ]
  }
};

export default nextConfig;



// export async function parseVideo(file: File) {
//   const { data } = await axios.post(`/api/parse_media/video`, { file }, { headers: MultipartHeaders })
//   return data.text
// }

// export async function parseAudio(file: File) {
//   const { data } = await axios.post(`/api/parse_media/audio`, { file }, { headers: MultipartHeaders })
//   return data.text
// }

// export async function parseWebsite(url: string) {
//   const { data } = await axios.post(`/api/parse_website`, { url })
//   return data.text
// }