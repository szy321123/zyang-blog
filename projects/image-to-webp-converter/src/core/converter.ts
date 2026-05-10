import type { ConversionSettings, ConversionResult } from '@/types'
import { calculateDimensions } from '@/utils/image'

export async function convertImageToWebP(
  file: File,
  settings: ConversionSettings,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const startTime = performance.now()
  
  onProgress?.(10)
  
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch (error) {
    throw new Error(`无法加载图片：${error instanceof Error ? error.message : '未知错误'}`)
  }
  
  onProgress?.(30)
  
  const { width, height } = calculateDimensions(
    bitmap.width,
    bitmap.height,
    settings.targetWidth,
    settings.targetHeight,
    settings.maintainAspectRatio
  )
  
  onProgress?.(50)
  
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法获取 Canvas 上下文')
  }
  
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  
  onProgress?.(70)
  
  const quality = Math.max(0.01, Math.min(1, settings.quality / 100))
  
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('转换失败，生成的 blob 为空'))
        }
      },
      'image/webp',
      quality
    )
  })
  
  onProgress?.(90)
  
  bitmap.close()
  
  const endTime = performance.now()
  const duration = endTime - startTime
  
  const originalSize = file.size
  const convertedSize = blob.size
  const compressionRate = ((originalSize - convertedSize) / originalSize) * 100
  
  onProgress?.(100)
  
  return {
    originalSize,
    convertedSize,
    compressionRate,
    blob,
    width,
    height,
    duration
  }
}
