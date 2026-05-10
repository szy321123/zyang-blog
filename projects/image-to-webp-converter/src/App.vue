<template>
  <div class="app">
    <header class="header">
      <div class="container header-content">
        <div class="logo">
          <div class="logo-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="logo-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
              <path d="M8.5 8.5L12 12l-3.5 3.5M15.5 8.5L12 12l3.5 3.5" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1>图片格式转 WebP</h1>
            <p class="logo-subtitle">高效 · 安全 · 免费</p>
          </div>
        </div>
        <div class="header-actions">
          <a
            href="https://github.com/anzhi-yu/anzhiyu-theme-hexo"
            target="_blank"
            class="theme-link"
            title="基于 AnZhiYu 主题样式"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="github-icon">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <div class="hero-section">
          <h2 class="hero-title">
            将图片转换为
            <span class="text-gradient">WebP 格式</span>
          </h2>
          <p class="hero-description">
            批量转换工具，支持多种格式，纯前端处理，保护您的隐私安全
          </p>
        </div>

        <FileUploader :on-files-selected="handleFilesSelected" />

        <div v-if="images.length > 0" class="workspace fade-in-up">
          <SettingsPanel
            v-model:quality="settings.quality"
            v-model:target-width="settings.targetWidth"
            v-model:target-height="settings.targetHeight"
            v-model:maintain-aspect-ratio="settings.maintainAspectRatio"
            @reset="handleResetSettings"
          />

          <div class="panels-grid">
            <div class="left-panel">
              <ImageList
                :images="images"
                @remove="handleRemoveImage"
                @preview="handlePreviewImage"
              />
            </div>
            <div class="right-panel">
              <StatisticsPanel :stats="stats" />
              <DownloadPanel
                :images="images"
                :stats="stats"
                @download="handleDownload"
                @download-all="handleDownloadAll"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <PreviewModal
      v-if="previewImage"
      :image="previewImage"
      @close="handleClosePreview"
    />

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>功能特性</h3>
            <p>支持 JPG、PNG、GIF、BMP、TIFF、SVG、HEIC、RAW 等格式，批量转换为 WebP。</p>
          </div>
          <div class="footer-divider"></div>
          <div class="footer-section">
            <h3>技术优势</h3>
            <p>纯前端本地处理 · 不上传服务器 · 注重隐私安全 · 适配手机与桌面端。</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 汤圆是只乳白 · ZYang 的图片工具箱</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { ImageData, ConversionSettings, ConversionStats } from '@/types'
import { BatchManager } from '@/core/batchManager'
import FileUploader from '@/components/FileUploader.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import ImageList from '@/components/ImageList.vue'
import StatisticsPanel from '@/components/StatisticsPanel.vue'
import DownloadPanel from '@/components/DownloadPanel.vue'
import PreviewModal from '@/components/PreviewModal.vue'

const images = ref<ImageData[]>([])
const batchManager = reactive(new BatchManager(3))

const settings = reactive<ConversionSettings>({
  quality: 80,
  targetWidth: null,
  targetHeight: null,
  maintainAspectRatio: true
})

const stats = computed<ConversionStats>(() => {
  const completedImages = images.value.filter(img => img.status === 'completed')
  const failedImages = images.value.filter(img => img.status === 'failed')
  
  const totalOriginalSize = completedImages.reduce((sum, img) => sum + img.originalSize, 0)
  const totalConvertedSize = completedImages.reduce((sum, img) => sum + (img.convertedSize || 0), 0)
  const totalSaved = totalOriginalSize - totalConvertedSize
  
  const averageCompressionRate = completedImages.length > 0
    ? completedImages.reduce((sum, img) => sum + (img.compressionRate || 0), 0) / completedImages.length
    : 0

  return {
    totalFiles: images.value.length,
    completedFiles: completedImages.length,
    failedFiles: failedImages.length,
    totalOriginalSize,
    totalConvertedSize,
    averageCompressionRate,
    totalSaved
  }
})

const previewImage = ref<ImageData | null>(null)

const handleFilesSelected = async (files: File[]) => {
  const newImages: ImageData[] = await Promise.all(
    files.map(async (file) => {
      const previewUrl = URL.createObjectURL(file)
      const { width, height } = await getImageDimensions(file)
      
      return {
        id: generateId(),
        file,
        name: file.name,
        originalSize: file.size,
        format: file.type || 'unknown',
        width,
        height,
        previewUrl,
        status: 'pending'
      }
    })
  )

  images.value = [...images.value, ...newImages]
  
  startConversion(newImages)
}

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
    }
    img.src = URL.createObjectURL(file)
  })
}

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

const startConversion = (imageDataList: ImageData[]) => {
  imageDataList.forEach((imageData) => {
    batchManager.addTask(
      imageData,
      settings,
      (progress) => {
        const index = images.value.findIndex(img => img.id === imageData.id)
        if (index !== -1) {
          images.value[index].status = 'converting'
        }
      },
      (result) => {
        const index = images.value.findIndex(img => img.id === imageData.id)
        if (index !== -1) {
          images.value[index].status = 'completed'
          images.value[index].convertedBlob = result.blob
          images.value[index].convertedSize = result.convertedSize
          images.value[index].compressionRate = result.compressionRate
        }
      },
      (error) => {
        const index = images.value.findIndex(img => img.id === imageData.id)
        if (index !== -1) {
          images.value[index].status = 'failed'
          images.value[index].errorMessage = error.message
        }
      }
    )
  })
}

const handleRemoveImage = (imageId: string) => {
  batchManager.cancelTask(imageId)
  const index = images.value.findIndex(img => img.id === imageId)
  if (index !== -1) {
    if (images.value[index].previewUrl) {
      URL.revokeObjectURL(images.value[index].previewUrl)
    }
    images.value.splice(index, 1)
  }
}

const handlePreviewImage = (image: ImageData) => {
  previewImage.value = image
}

const handleClosePreview = () => {
  previewImage.value = null
}

const handleResetSettings = () => {
  settings.quality = 80
  settings.targetWidth = null
  settings.targetHeight = null
  settings.maintainAspectRatio = true
}

const handleDownload = (image: ImageData) => {
  if (!image.convertedBlob) return
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(image.convertedBlob)
  link.download = image.name.replace(/\.[^.]+$/, '') + '.webp'
  link.click()
  URL.revokeObjectURL(link.href)
}

const handleDownloadAll = async () => {
  const { JSZip } = await import('jszip')
  const zip = new JSZip()
  
  const completedImages = images.value.filter(img => img.status === 'completed' && img.convertedBlob)
  
  completedImages.forEach((image) => {
    if (image.convertedBlob) {
      const filename = image.name.replace(/\.[^.]+$/, '') + '.webp'
      zip.file(filename, image.convertedBlob)
    }
  })
  
  const content = await zip.generateAsync({ type: 'blob' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(content)
  link.download = 'converted-images.zip'
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 1.25rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-xs);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-gradient);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md), var(--shadow-glow);
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: #ffffff;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.logo-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.logo-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.theme-link {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  transition: all var(--transition-base);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
}

.theme-link:hover {
  color: var(--primary-color);
  background: var(--bg-hover);
}

.github-icon {
  width: 24px;
  height: 24px;
}

.main {
  flex: 1;
  padding: 3rem 0 4rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
}

.hero-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.workspace {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.panels-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .panels-grid {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: 2.5rem 0 1.5rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-divider {
    display: none;
  }
}

.footer-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-section p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.footer-divider {
  width: 1px;
  background: var(--border-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.footer-bottom p {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}
</style>
