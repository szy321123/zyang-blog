export interface ImageData {
  id: string
  file: File
  name: string
  originalSize: number
  format: string
  width: number
  height: number
  previewUrl: string
  status: 'pending' | 'converting' | 'completed' | 'failed'
  convertedBlob?: Blob
  convertedSize?: number
  compressionRate?: number
  errorMessage?: string
}

export interface ConversionSettings {
  quality: number
  targetWidth: number | null
  targetHeight: number | null
  maintainAspectRatio: boolean
}

export interface ConversionResult {
  originalSize: number
  convertedSize: number
  compressionRate: number
  blob: Blob
  width: number
  height: number
  duration: number
}

export interface ConversionStats {
  totalFiles: number
  completedFiles: number
  failedFiles: number
  totalOriginalSize: number
  totalConvertedSize: number
  averageCompressionRate: number
  totalSaved: number
}

export enum ConversionError {
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  MEMORY_EXCEEDED = 'MEMORY_EXCEEDED',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED'
}

export type SupportedFormat = 
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/bmp'
  | 'image/tiff'
  | 'image/svg+xml'
  | 'image/heic'
  | 'image/heif'
  | 'image/x-raw'

export const SUPPORTED_FORMATS: SupportedFormat[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/x-raw'
]

export const FORMAT_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/bmp': ['bmp'],
  'image/tiff': ['tiff', 'tif'],
  'image/svg+xml': ['svg'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
  'image/x-raw': ['raw', 'cr2', 'nef', 'arw', 'dng']
}
