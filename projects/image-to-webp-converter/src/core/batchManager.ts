import type { ImageData, ConversionSettings, ConversionResult } from '@/types'
import { convertImageToWebP } from './converter'

interface ConversionTask {
  id: string
  imageData: ImageData
  settings: ConversionSettings
  abortController: AbortController
}

export class BatchManager {
  private queue: ConversionTask[] = []
  private activeTasks: Map<string, ConversionTask> = new Map()
  private maxConcurrent: number = 3
  private isProcessing: boolean = false

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent
  }

  addTask(
    imageData: ImageData,
    settings: ConversionSettings,
    onProgress: (progress: number) => void,
    onComplete: (result: ConversionResult) => void,
    onError: (error: Error) => void
  ): string {
    const abortController = new AbortController()
    
    const task: ConversionTask = {
      id: imageData.id,
      imageData,
      settings,
      abortController
    }

    this.queue.push(task)
    this.processQueue(onProgress, onComplete, onError)

    return task.id
  }

  private async processQueue(
    onProgress: (progress: number) => void,
    onComplete: (result: ConversionResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (this.isProcessing) return
    this.isProcessing = true

    while (this.queue.length > 0 && this.activeTasks.size < this.maxConcurrent) {
      const task = this.queue.shift()
      if (!task || task.abortController.signal.aborted) continue

      this.activeTasks.set(task.id, task)

      this.executeTask(task, onProgress, onComplete, onError)
        .finally(() => {
          this.activeTasks.delete(task.id)
          if (this.queue.length > 0) {
            this.processQueue(onProgress, onComplete, onError)
          } else {
            this.isProcessing = false
          }
        })
    }

    if (this.queue.length === 0 && this.activeTasks.size === 0) {
      this.isProcessing = false
    }
  }

  private async executeTask(
    task: ConversionTask,
    onProgress: (progress: number) => void,
    onComplete: (result: ConversionResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (task.abortController.signal.aborted) return

    try {
      const result = await convertImageToWebP(
        task.imageData.file,
        task.settings,
        (progress) => {
          if (!task.abortController.signal.aborted) {
            onProgress(progress)
          }
        }
      )

      if (!task.abortController.signal.aborted) {
        onComplete(result)
      }
    } catch (error) {
      if (!task.abortController.signal.aborted) {
        onError(error instanceof Error ? error : new Error('转换失败'))
      }
    }
  }

  cancelTask(id: string): void {
    const task = this.activeTasks.get(id)
    if (task) {
      task.abortController.abort()
      this.activeTasks.delete(id)
    }

    const queueIndex = this.queue.findIndex((t) => t.id === id)
    if (queueIndex > -1) {
      this.queue.splice(queueIndex, 1)
    }
  }

  cancelAll(): void {
    this.activeTasks.forEach((task) => {
      task.abortController.abort()
    })
    this.activeTasks.clear()
    this.queue = []
    this.isProcessing = false
  }

  getActiveCount(): number {
    return this.activeTasks.size
  }

  getQueueLength(): number {
    return this.queue.length
  }

  isIdle(): boolean {
    return this.queue.length === 0 && this.activeTasks.size === 0
  }
}
