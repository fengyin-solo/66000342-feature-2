<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <button class="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200" @click="$emit('back')">
        ← 返回列表
      </button>
      <span class="text-xs text-slate-500">语系与筛选条件已保留 · 返回恢复滚动位置</span>
    </div>

    <div class="rounded-lg bg-slate-900 border border-slate-700 p-4">
      <div class="flex flex-wrap items-baseline gap-3 mb-1">
        <span class="text-2xl font-mono font-bold text-cyan-300">{{ cs.root }}</span>
        <span class="text-lg text-slate-200">{{ cs.meaning }}</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs mb-4">
        <span class="px-2 py-0.5 rounded-full text-white" :style="{ backgroundColor: family?.color || '#64748b' }">{{ family?.name || cs.family }}</span>
        <span class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">拟音阶段：{{ cs.period }}</span>
        <span class="px-2 py-0.5 rounded-full" :class="full ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'">
          词形覆盖 {{ filled }}/{{ langs.length }}{{ full ? ' · 完整覆盖' : ' · 存在缺失' }}
        </span>
      </div>

      <!-- 覆盖完整度条 -->
      <div class="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-800 mb-5">
        <template v-for="l in langs" :key="l">
          <div class="flex-1" :class="cs.languages[l] ? 'bg-emerald-500' : 'bg-slate-700'"></div>
        </template>
      </div>

      <h4 class="text-xs font-bold text-slate-500 mb-2">各语言词形</h4>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <div v-for="l in langs" :key="l"
          class="rounded border p-3 bg-slate-800/60"
          :class="presenceHit(l) ? (cs.languages[l] ? 'border-emerald-500/70 ring-1 ring-emerald-500/50' : 'border-rose-500/70 ring-1 ring-rose-500/50') : 'border-slate-700'">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs" :class="LANG_COLORS[l] || 'text-slate-400'">{{ l }}</span>
            <span v-if="store.targetLanguage === l" class="text-[10px] text-emerald-400">◎ 目标语言 · {{ presenceText }}</span>
            <span v-if="initialHit(l)" class="text-[10px] text-cyan-400">首字母 {{ store.wordInitial.toUpperCase() }} 命中</span>
          </div>
          <div class="text-lg font-mono" :class="cs.languages[l] ? (LANG_COLORS[l] || 'text-slate-200') : 'text-slate-600'">
            <FormHighlight v-if="cs.languages[l]" :text="cs.languages[l]" :query="store.searchQuery" :hit-initial="initialHit(l)" />
            <span v-else class="text-base">— 该语言未出现</span>
          </div>
        </div>
      </div>

      <div v-if="store.activeFilterCount" class="mt-4 text-xs text-slate-500">
        当前生效条件：
        <span v-if="store.searchQuery.trim()" class="text-cyan-400">搜索「{{ store.searchQuery }}」</span>
        <span v-if="store.targetLanguage" class="text-emerald-400">
          {{ store.targetLanguage }}{{ presenceText === '仅看缺失' ? '缺失' : presenceText === '仅看出现' ? '出现' : '' }}
        </span>
        <span v-if="store.wordInitial" class="text-violet-400">首字母 {{ store.wordInitial.toUpperCase() }}</span>
        <span v-if="store.coverageMode !== 'any'" class="text-amber-400">{{ store.coverageMode === 'full' ? '完整覆盖' : '存在缺失' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEtymologyStore, LANGUAGE_FAMILIES } from '../store/etymology'
import { initialOf } from '../mock/data'
import FormHighlight from './FormHighlight.vue'
import type { CognateSet } from '../types'

const props = defineProps<{ cs: CognateSet }>()
defineEmits<{ back: [] }>()
const store = useEtymologyStore()

const LANG_COLORS: Record<string, string> = {
  '英语': 'text-cyan-400', '法语': 'text-blue-400', '德语': 'text-green-400',
  '西班牙语': 'text-orange-400', '俄语': 'text-purple-400', '拉丁语': 'text-yellow-400',
  '汉语': 'text-red-300', '藏语': 'text-emerald-300', '缅甸语': 'text-amber-300',
  '阿拉伯语': 'text-amber-300', '希伯来语': 'text-sky-300',
  '芬兰语': 'text-violet-300', '匈牙利语': 'text-pink-300',
}

const family = computed(() => LANGUAGE_FAMILIES.find(f => f.id === props.cs.family))
const langs = computed(() => family.value?.languages || Object.keys(props.cs.languages))
const filled = computed(() => langs.value.filter(l => !!props.cs.languages[l]).length)
const full = computed(() => filled.value === langs.value.length)
const presenceText = computed(() =>
  store.presenceMode === 'present' ? '仅看出现' : store.presenceMode === 'absent' ? '仅看缺失' : ''
)

function presenceHit(lang: string) {
  if (!store.targetLanguage || store.targetLanguage !== lang || store.presenceMode === 'any') return false
  const present = !!props.cs.languages[lang]
  return store.presenceMode === 'present' ? present : !present
}
function initialHit(lang: string) {
  if (!store.wordInitial) return false
  if (store.targetLanguage && store.targetLanguage !== lang) return false
  const w = props.cs.languages[lang]
  return !!w && initialOf(w) === store.wordInitial
}
</script>
