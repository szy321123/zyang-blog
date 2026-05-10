import { SUPPORTED_FORMATS, FORMAT_EXTENSIONS } from '@/types'

export function detectImageFormat(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (!extension) {
    return null
  }

  for (const [format, extensions] of Object.entries(FORMAT_EXTENSIONS)) {
    if (extensions.includes(extension)) {
      return format
    }
  }

  if (file.type && SUPPORTED_FORMATS.includes(file.type as any)) {
    return file.type
  }

  return null
}

export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number | null,
  targetHeight: number | null,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight }
  }

  if (maintainAspectRatio) {
    if (targetWidth && !targetHeight) {
      const ratio = targetWidth / originalWidth
      return {
        width: targetWidth,
        height: Math.round(originalHeight * ratio)
      }
    }

    if (!targetWidth && targetHeight) {
      const ratio = targetHeight / originalHeight
      return {
        width: Math.round(originalWidth * ratio),
        height: targetHeight
      }
    }

    if (targetWidth && targetHeight) {
      const ratioX = targetWidth / originalWidth
      const ratioY = targetHeight / originalHeight
      const ratio = Math.min(ratioX, ratioY)
      return {
        width: Math.round(originalWidth * ratio),
        height: Math.round(originalHeight * ratio)
      }
    }
  }

  return {
    width: targetWidth || originalWidth,
    height: targetHeight || originalHeight
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Number((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function isSupportedFormat(file: File): boolean {
  const format = detectImageFormat(file)
  return format !== null
}

export function getExtensionFromFormat(format: string): string {
  const formats = FORMAT_EXTENSIONS as Record<string, string[]>
  const entry = Object.entries(formats).find(([key]) => key === format)
  return entry ? entry[1][0] : 'webp'
}
