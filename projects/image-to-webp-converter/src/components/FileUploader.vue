<template>
  <div
    class="upload-area"
    :class="{ 'is-dragging': isDragging }"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @click="handleClick"
  >
    <div class="upload-content">
      <div class="upload-icon-wrapper">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div class="upload-icon-glow"></div>
      </div>
      <div class="upload-text">
        <p class="primary-text">
          <span class="text-gradient">拖拽图片</span> 到此处或点击选择文件
        </p>
        <p class="secondary-text">支持 JPG、PNG、GIF、BMP、TIFF、SVG、HEIC、RAW 格式</p>
      </div>
      <div class="upload-hint">
        <span class="hint-badge">批量转换</span>
        <span class="hint-badge">纯前端处理</span>
        <span class="hint-badge">安全隐私</span>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="file-input"
        @change="handleFileChange"
      />
    </div>
    <div v-if="error" class="error-message fade-in">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="2"/>
        <path d="M12 8v4m0 4h.01" stroke-width="2" stroke-linecap="round"/>
      </svg>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { isSupportedFormat } from '@/utils/image'

interface Props {
  onFilesSelected: (files: File[]) => void
}

const props = defineProps<Props>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string | null>(null)

const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  error.value = null
  
  const files = Array.from(event.dataTransfer?.files || [])
  handleFiles(files)
}

const handleClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  handleFiles(files)
  target.value = ''
}

const handleFiles = (files: File[]) => {
  const validFiles: File[] = []
  const unsupportedFiles: string[] = []

  files.forEach((file) => {
    if (isSupportedFormat(file)) {
      validFiles.push(file)
    } else {
      unsupportedFiles.push(file.name)
    }
  })

  if (unsupportedFiles.length > 0) {
    error.value = `以下文件格式不支持：${unsupportedFiles.join(', ')}`
  } else {
    error.value = null
  }

  if (validFiles.length > 0) {
    props.onFilesSelected(validFiles)
  }
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 3.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-slow);
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-light);
  opacity: 0;
  transition: opacity var(--transition-slow);
}

.upload-area:hover::before,
.upload-area.is-dragging::before {
  opacity: 1;
}

.upload-area:hover,
.upload-area.is-dragging {
  border-color: var(--primary-color);
  background: var(--bg-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}

.upload-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.upload-icon-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  transition: all var(--transition-base);
  position: relative;
  z-index: 2;
}

.upload-area:hover .upload-icon,
.upload-area.is-dragging .upload-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.upload-icon-glow {
  position: absolute;
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.upload-area:hover .upload-icon-glow,
.upload-area.is-dragging .upload-icon-glow {
  opacity: 0.3;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.primary-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.text-gradient {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.secondary-text {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.upload-hint {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hint-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: var(--bg-hover);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
}

.upload-area:hover .hint-badge {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.file-input {
  display: none;
}

.error-message {
  position: relative;
  z-index: 1;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--error-bg);
  color: var(--error-color);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--error-color);
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message {
  animation: shake 0.3s ease-in-out;
}
</style>
