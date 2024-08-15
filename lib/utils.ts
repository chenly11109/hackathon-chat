import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a base64-encoded string into a Blob object
 *
 * @param base64String - The base64-encoded string to be converted
 * @param contentType - The content type of the resulting Blob object, defaults to 'image/png'
 * @returns A Blob object representing the binary data from the base64 string
 */
export function base64ToBlob(base64String: string, contentType = 'image/png') {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
