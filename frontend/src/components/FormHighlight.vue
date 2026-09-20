<template>
  <template v-if="text">
    <span v-for="(ch, i) in chars" :key="i"
      :class="{
        'bg-yellow-500/40 text-yellow-100 rounded-sm': queryRange && i >= queryRange[0] && i < queryRange[1],
        'font-bold underline decoration-cyan-400 decoration-2 underline-offset-2': initialIndex === i && hitInitial,
      }">{{ ch }}</span>
  </template>
  <span v-else class="text-slate-600">—</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { initialOf } from '../mock/data'

/**
 * 词形渲染：
 * - 搜索词命中的子串：黄底高亮
 * - 词形首字母命中：加粗 + 下划线
 */
const props = defineProps<{
  text: string
  query?: string
  hitInitial?: boolean
}>()

const chars = computed(() => [...(props.text || '')])

const queryRange = computed<[number, number] | null>(() => {
  const q = props.query?.trim().toLowerCase() || ''
  if (!q || !props.text) return null
  const idx = props.text.toLowerCase().indexOf(q)
  return idx === -1 ? null : [idx, idx + q.length]
})

// 首字母位置：跳过词首喉塞音/引号/空白等前导符号
const initialIndex = computed(() => {
  if (!props.text || !props.hitInitial) return -1
  const m = props.text.match(/^[ʾʿ'`\s]*/)
  const idx = m ? m[0].length : 0
  return idx < props.text.length && initialOf(props.text) ? idx : -1
})
</script>
