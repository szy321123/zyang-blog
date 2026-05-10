<template>
  <div class="download-panel card card-elevated">
    <div class="download-header">
      <h2>
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        下载
      </h2>
      <button
        class="btn btn-primary btn-lg"
        :disabled="!hasCompleted"
        @click="$emit('downloadAll')"
      >
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        批量下载 ({{ completedCount }})
      </button>
    </div>

    <div class="download-list">
      <div
        v-for="image in completedImages"
        :key="image.id"
        class="download-item"
        :class="{ 'fade-in': true }"
      >
        <div class="download-info">
          <div class="item-thumbnail-wrapper">
            <img :src="image.previewUrl" :alt="image.name" class="item-thumbnail" />
            <div class="format-badge">WebP</div>
          </div>
          <div class="item-details">
            <div class="item-name" :title="image.name">{{ image.name }}</div>
            <div class="item-comparison">
              <span class="size-original">{{ formatFileSize(image.originalSize) }}</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="size-converted">{{ formatFileSize(image.convertedSize || 0) }}</span>
              <span v-if="image.compressionRate" class="compression-badge">
                节省 {{ Math.round(image.compressionRate) }}%
              </span>
            </div>
          </div>
        </div>
        <div class="item-actions">
          <button
            class="btn btn-primary"
            @click="$emit('download', image)"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            下载
          </button>
        </div>
      </div>

      <div v-if="!hasCompleted" class="empty-state">
        <div class="empty-icon-wrapper">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="empty-text">暂无已完成的转换</p>
        <p class="empty-hint">转换完成后，图片将显示在这里</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImageData, ConversionStats } from '@/types'
import { formatFileSize } from '@/utils/image'

interface Props {
  images: ImageData[]
  stats: ConversionStats
}

interface Emits {
  (e: 'download', image: ImageData): void
  (e: 'downloadAll'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const completedImages = computed(() => 
  props.images.filter(img => img.status === 'completed' && img.convertedBlob)
)

const hasCompleted = computed(() => completedImages.value.length > 0)
const completedCount = computed(() => completedImages.value.length)
</script>

<style scoped>
.download-panel {
  padding: 1.5rem;
}

.download-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.download-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.header-icon {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.download-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.download-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);
}

.download-item:hover {
  transform: translateX(4px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.download-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.item-thumbnail-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
}

.format-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--primary-gradient);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-comparison {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
}

.size-original {
  color: var(--text-secondary);
  font-weight: 500;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
}

.size-converted {
  color: var(--success-color);
  font-weight: 600;
}

.compression-badge {
  margin-left: auto;
  color: var(--success-color);
  font-weight: 700;
  background: var(--success-bg);
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  color: var(--text-secondary);
  gap: 0.75rem;
}

.empty-icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.empty-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

.empty-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}
</style>
