<template>
  <div class="image-list card card-elevated">
    <div class="image-list-header">
      <h2>
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
          <polyline points="21,15 16,10 5,21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        图片列表
        <span class="image-count">{{ images.length }} 张</span>
      </h2>
    </div>

    <div class="images-grid">
      <div
        v-for="image in images"
        :key="image.id"
        class="image-item fade-in-up hover-lift"
        :class="`status-${image.status}`"
      >
        <div class="image-thumbnail">
          <img :src="image.previewUrl" :alt="image.name" />
          
          <div v-if="image.status === 'converting'" class="overlay converting">
            <div class="spinner-wrapper">
              <div class="spinner"></div>
            </div>
            <span class="status-text">转换中</span>
          </div>
          
          <div v-if="image.status === 'failed'" class="overlay failed">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 8v4m0 4h.01" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="status-text">失败</span>
          </div>
          
          <div v-if="image.status === 'completed'" class="completed-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20,6 9,17 4,12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="image-info">
          <div class="image-name" :title="image.name">
            <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
              <polyline points="21,15 16,10 5,21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ image.name }}
          </div>
          <div class="image-meta">
            <span class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                <path d="M3 9h18M9 21V9" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ formatFileSize(image.originalSize) }}
            </span>
            <span class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                <path d="M3 9h18M9 21V9" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ image.width }}×{{ image.height }}
            </span>
          </div>
          <div class="image-footer">
            <span class="status-badge" :class="`status-${image.status}`">
              <span class="status-dot"></span>
              {{ getStatusText(image.status) }}
            </span>
            <span v-if="image.compressionRate" class="compression-rate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="17,18 23,18 23,12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              压缩 {{ Math.round(image.compressionRate) }}%
            </span>
          </div>
        </div>

        <div class="image-actions">
          <button
            v-if="image.status === 'completed'"
            class="action-btn"
            @click="$emit('preview', image)"
            title="预览对比"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" stroke-width="2"/>
            </svg>
          </button>
          <button
            v-if="image.status === 'converting'"
            class="action-btn cancel"
            @click="$emit('cancel', image.id)"
            title="取消转换"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
            </svg>
          </button>
          <button
            class="action-btn delete"
            @click="$emit('remove', image.id)"
            title="移除"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageData } from '@/types'
import { formatFileSize } from '@/utils/image'

interface Props {
  images: ImageData[]
}

interface Emits {
  (e: 'remove', id: string): void
  (e: 'preview', image: ImageData): void
  (e: 'cancel', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const getStatusText = (status: ImageData['status']): string => {
  const statusMap = {
    pending: '待处理',
    converting: '转换中',
    completed: '已完成',
    failed: '失败'
  }
  return statusMap[status]
}
</script>

<style scoped>
.image-list {
  padding: 1.5rem;
}

.image-list-header {
  margin-bottom: 1.5rem;
}

.image-list-header h2 {
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

.image-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.image-item {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 2px solid transparent;
}

.image-item:hover {
  box-shadow: var(--shadow-lg);
}

.image-item.status-converting {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.image-item.status-completed {
  border-color: var(--success-color);
  background: var(--success-bg);
}

.image-item.status-failed {
  border-color: var(--error-color);
  background: var(--error-bg);
}

.image-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background: var(--bg-primary);
}

.image-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.image-item:hover .image-thumbnail img {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  backdrop-filter: blur(4px);
}

.overlay.converting {
  background: rgba(59, 130, 246, 0.8);
}

.overlay.failed {
  background: rgba(239, 68, 68, 0.9);
}

.spinner-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  width: 40px;
  height: 40px;
  color: #ffffff;
}

.status-text {
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
}

.completed-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  background: var(--success-color);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  animation: scaleIn 0.3s var(--transition-base);
}

.completed-badge svg {
  width: 16px;
  height: 16px;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-icon {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.image-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-icon {
  width: 14px;
  height: 14px;
  color: var(--text-tertiary);
}

.image-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-pending {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.status-converting {
  background: var(--primary-light);
  color: var(--primary-color);
}

.status-completed {
  background: var(--success-bg);
  color: var(--success-color);
}

.status-failed {
  background: var(--error-bg);
  color: var(--error-color);
}

.compression-rate {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--success-color);
  font-weight: 700;
}

.compression-rate svg {
  width: 14px;
  height: 14px;
}

.image-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-hover);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.action-btn:hover {
  background: var(--bg-primary);
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-btn.cancel:hover {
  border-color: var(--warning-color);
  color: var(--warning-color);
}

.action-btn.delete:hover {
  border-color: var(--error-color);
  color: var(--error-color);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}
</style>
