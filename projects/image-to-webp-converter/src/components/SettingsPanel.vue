<template>
  <div class="settings-panel card card-elevated">
    <div class="settings-header">
      <h2>
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke-width="2"/>
        </svg>
        转换设置
      </h2>
      <button class="btn btn-secondary btn-sm" @click="handleReset">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        重置
      </button>
    </div>

    <div class="settings-content">
      <div class="setting-item">
        <div class="setting-label">
          <label>
            <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>
            </svg>
            质量
          </label>
          <span class="setting-value">{{ quality }}%</span>
        </div>
        <div class="slider-wrapper">
          <input
            type="range"
            :value="quality"
            min="1"
            max="100"
            class="range-slider"
            @input="handleQualityChange"
          />
          <div class="slider-markers">
            <span class="marker low">低</span>
            <span class="marker medium">中</span>
            <span class="marker high">高</span>
          </div>
        </div>
        <div class="quality-preview">
          <div class="quality-bar">
            <div 
              class="quality-fill" 
              :style="{ width: quality + '%' }"
              :class="getQualityClass(quality)"
            ></div>
          </div>
          <span class="quality-label" :class="getQualityClass(quality)">
            {{ getQualityLabel(quality) }}
          </span>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <label>
            <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
              <path d="M3 9h18M9 21V9" stroke-width="2" stroke-linecap="round"/>
            </svg>
            目标尺寸
          </label>
          <span v-if="maintainAspectRatio" class="setting-note">
            <svg class="note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20,6 9,17 4,12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            保持宽高比
          </span>
        </div>
        <div class="dimension-inputs">
          <div class="input-group">
            <label>宽度</label>
            <div class="input-wrapper">
              <input
                type="number"
                :value="targetWidth || ''"
                placeholder="自动"
                min="1"
                class="input"
                @input="handleWidthChange"
              />
              <span class="input-suffix">px</span>
            </div>
          </div>
          <div class="input-divider">
            <span>×</span>
          </div>
          <div class="input-group">
            <label>高度</label>
            <div class="input-wrapper">
              <input
                type="number"
                :value="targetHeight || ''"
                placeholder="自动"
                min="1"
                class="input"
                @input="handleHeightChange"
              />
              <span class="input-suffix">px</span>
            </div>
          </div>
        </div>
      </div>

      <div class="setting-item">
        <div class="toggle-control">
          <label class="toggle-label">
            <div class="toggle-text">
              <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                <path d="M12 7v5l3 3" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>保持宽高比</span>
            </div>
            <div class="toggle">
              <input
                type="checkbox"
                :checked="maintainAspectRatio"
                @change="handleAspectRatioChange"
              />
              <span class="toggle-slider"></span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  quality: number
  targetWidth: number | null
  targetHeight: number | null
  maintainAspectRatio: boolean
}

interface Emits {
  (e: 'update:quality', value: number): void
  (e: 'update:targetWidth', value: number | null): void
  (e: 'update:targetHeight', value: number | null): void
  (e: 'update:maintainAspectRatio', value: boolean): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleQualityChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:quality', Number(target.value))
}

const handleWidthChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  emit('update:targetWidth', value ? Number(value) : null)
}

const handleHeightChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  emit('update:targetHeight', value ? Number(value) : null)
}

const handleAspectRatioChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:maintainAspectRatio', target.checked)
}

const handleReset = () => {
  emit('reset')
}

const getQualityClass = (quality: number): string => {
  if (quality < 40) return 'low'
  if (quality < 70) return 'medium'
  if (quality < 90) return 'high'
  return 'ultra'
}

const getQualityLabel = (quality: number): string => {
  if (quality < 40) return '低质量 · 文件最小'
  if (quality < 70) return '中等质量 · 平衡选择'
  if (quality < 90) return '高质量 · 推荐'
  return '超高质量 · 文件较大'
}
</script>

<style scoped>
.settings-panel {
  padding: 1.5rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.settings-header h2 {
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  gap: 0.5rem;
}

.setting-label label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: var(--primary-color);
}

.setting-value {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1rem;
}

.setting-note {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--success-color);
  font-weight: 500;
}

.note-icon {
  width: 14px;
  height: 14px;
}

.slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.range-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-gradient);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  border: 2px solid #ffffff;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-gradient);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  border: 2px solid #ffffff;
}

.slider-markers {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
  padding: 0 0.25rem;
}

.quality-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.quality-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.quality-fill {
  height: 100%;
  border-radius: 3px;
  transition: width var(--transition-slow), background var(--transition-slow);
}

.quality-fill.low {
  background: linear-gradient(90deg, #ef4444 0%, #f59e0b 100%);
}

.quality-fill.medium {
  background: linear-gradient(90deg, #f59e0b 0%, #10b981 100%);
}

.quality-fill.high {
  background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
}

.quality-fill.ultra {
  background: var(--primary-gradient);
}

.quality-label {
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
}

.quality-label.low {
  color: #ef4444;
}

.quality-label.medium {
  color: #f59e0b;
}

.quality-label.high,
.quality-label.ultra {
  color: var(--primary-color);
}

.dimension-inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  outline: none;
  transition: all var(--transition-base);
}

.input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.input-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
  pointer-events: none;
}

.input-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-tertiary);
}

.toggle-control {
  margin-top: 0.5rem;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
}

.toggle-icon {
  width: 18px;
  height: 18px;
  color: var(--primary-color);
}

.toggle {
  position: relative;
  width: 48px;
  height: 26px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-secondary);
  transition: all var(--transition-base);
  border-radius: 26px;
  border: 2px solid var(--border-color);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  transition: all var(--transition-base);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.toggle input:checked + .toggle-slider {
  background: var(--primary-gradient);
  border-color: transparent;
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(22px);
  background: #ffffff;
  box-shadow: var(--shadow-md);
}
</style>
