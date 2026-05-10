<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>预览对比</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-content">
        <div class="preview-comparison">
          <div class="preview-item">
            <h3>原始图片</h3>
            <div class="preview-image">
              <img :src="image.previewUrl" :alt="image.name" />
            </div>
            <div class="preview-info">
              <div class="info-row">
                <span class="label">格式:</span>
                <span class="value">{{ getFormatName(image.format) }}</span>
              </div>
              <div class="info-row">
                <span class="label">尺寸:</span>
                <span class="value">{{ image.width }}×{{ image.height }}</span>
              </div>
              <div class="info-row">
                <span class="label">大小:</span>
                <span class="value">{{ formatFileSize(image.originalSize) }}</span>
              </div>
            </div>
          </div>

          <div class="preview-divider">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <div class="preview-item" v-if="image.status === 'completed' && image.convertedBlob">
            <h3>转换后 (WebP)</h3>
            <div class="preview-image">
              <img :src="convertedUrl" :alt="image.name" />
            </div>
            <div class="preview-info">
              <div class="info-row">
                <span class="label">格式:</span>
                <span class="value">WebP</span>
              </div>
              <div class="info-row">
                <span class="label">尺寸:</span>
                <span class="value">{{ image.width }}×{{ image.height }}</span>
              </div>
              <div class="info-row">
                <span class="label">大小:</span>
                <span class="value">{{ formatFileSize(image.convertedSize || 0) }}</span>
              </div>
              <div class="info-row highlight">
                <span class="label">压缩率:</span>
                <span class="value text-success">{{ Math.round(image.compressionRate || 0) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer" v-if="image.status === 'completed' && image.convertedBlob">
        <button class="btn btn-secondary" @click="$emit('close')">
          关闭
        </button>
        <button class="btn btn-primary" @click="handleDownload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          下载 WebP
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { ImageData } from '@/types'
import { formatFileSize } from '@/utils/image'

interface Props {
  image: ImageData
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

let convertedObjectUrl: string | null = null

const convertedUrl = computed(() => {
  if (props.image.convertedBlob) {
    convertedObjectUrl = URL.createObjectURL(props.image.convertedBlob)
    return convertedObjectUrl
  }
  return ''
})

const getFormatName = (format: string): string => {
  const formats: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/bmp': 'BMP',
    'image/tiff': 'TIFF',
    'image/svg+xml': 'SVG',
    'image/heic': 'HEIC',
    'image/heif': 'HEIF',
    'image/x-raw': 'RAW'
  }
  return formats[format] || format
}

const handleDownload = () => {
  if (!props.image.convertedBlob) return
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(props.image.convertedBlob)
  link.download = props.image.name.replace(/\.[^.]+$/, '') + '.webp'
  link.click()
  URL.revokeObjectURL(link.href)
}

onUnmounted(() => {
  if (convertedObjectUrl) {
    URL.revokeObjectURL(convertedObjectUrl)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
}

.close-btn svg {
  width: 24px;
  height: 24px;
}

.modal-content {
  padding: 1.5rem;
}

.preview-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .preview-comparison {
    grid-template-columns: 1fr;
  }
  
  .preview-divider {
    transform: rotate(90deg);
  }
}

.preview-item h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.preview-image {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 1rem;
}

.preview-image img {
  width: 100%;
  height: auto;
  display: block;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.info-row .label {
  color: var(--text-secondary);
}

.info-row .value {
  color: var(--text-primary);
  font-weight: 500;
}

.info-row.highlight {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.text-success {
  color: var(--success-color);
}

.preview-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.preview-divider svg {
  width: 24px;
  height: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
