<template>
  <div class="statistics-panel card card-elevated">
    <div class="stats-header">
      <h2>
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        转换统计
      </h2>
    </div>

    <div class="stats-grid">
      <div class="stat-item stat-primary">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
            <path d="M3 9h18M9 21V9" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalFiles }}</div>
          <div class="stat-label">总文件数</div>
        </div>
      </div>

      <div class="stat-item stat-success">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-width="2" stroke-linecap="round"/>
            <polyline points="22,4 12,14.01 9,11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedFiles }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>

      <div class="stat-item stat-warning">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <polyline points="12,6 12,12 16,14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatFileSize(stats.totalOriginalSize) }}</div>
          <div class="stat-label">原始大小</div>
        </div>
      </div>

      <div class="stat-item stat-info">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatFileSize(stats.totalConvertedSize) }}</div>
          <div class="stat-label">转换后大小</div>
        </div>
      </div>

      <div class="stat-item stat-success stat-large">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="17,18 23,18 23,12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value text-gradient">{{ Math.round(stats.averageCompressionRate) }}%</div>
          <div class="stat-label">平均压缩率</div>
        </div>
      </div>

      <div class="stat-item stat-success stat-large">
        <div class="stat-icon-wrapper">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value text-success">{{ formatFileSize(stats.totalSaved) }}</div>
          <div class="stat-label">节省空间</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConversionStats } from '@/types'
import { formatFileSize } from '@/utils/image'

interface Props {
  stats: ConversionStats
}

defineProps<Props>()
</script>

<style scoped>
.statistics-panel {
  padding: 1.5rem;
}

.stats-header {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stats-header h2 {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-item.stat-large {
  grid-column: span 1;
}

.stat-item.stat-primary {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.stat-item.stat-success {
  border-color: var(--success-color);
  background: var(--success-bg);
}

.stat-item.stat-warning {
  border-color: var(--warning-color);
  background: var(--warning-bg);
}

.stat-item.stat-info {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.stat-icon {
  width: 24px;
  height: 24px;
}

.stat-primary .stat-icon-wrapper {
  color: var(--primary-color);
}

.stat-success .stat-icon-wrapper {
  color: var(--success-color);
}

.stat-warning .stat-icon-wrapper {
  color: var(--warning-color);
}

.stat-info .stat-icon-wrapper {
  color: var(--primary-color);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  line-height: 1;
}

.stat-item.stat-large .stat-value {
  font-size: 1.75rem;
}

.text-gradient {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-success {
  color: var(--success-color);
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
