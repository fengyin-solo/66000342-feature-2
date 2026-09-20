import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, buildGraph } from '../mock/data'
import { COMBINABLE_FAMILIES, fetchCognateSets } from '../mock/api'
import type { CognateSet } from '../types'
export { LANGUAGE_FAMILIES, COGNATE_SETS }

export type Presence = 'present' | 'absent' | 'any'
export type Coverage = 'full' | 'partial' | 'any'

const IE_LANGUAGES = ['英语', '法语', '德语', '西班牙语', '俄语', '拉丁语']

/** 去掉大小写/音标变音符/空格差异，用于首字母与包含匹配 */
function normalize(s: string): string {
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** 词形首字母（汉语/藏文/缅文/阿拉伯/希伯来取首字，拉丁/西里尔取首字母） */
export function wordInitial(word: string): string {
  const n = normalize(word)
  return n ? n[0] : ''
}

function hasWord(cs: CognateSet, lang: string): boolean {
  const w = cs.languages[lang]
  return !!w && w.trim() !== '' && w.trim() !== '-'
}

function coverageOf(cs: CognateSet, langs: string[]): Coverage {
  const present = langs.filter(l => hasWord(cs, l)).length
  return present === langs.length && langs.length > 0 ? 'full' : 'partial'
}

interface MatchOverrides {
  targetLanguage?: string | null
  presence?: Presence
  initial?: string
  coverage?: Coverage
}

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const selectedNode = ref<any>(null)

  // 查询条件
  const searchQuery = ref('')
  const selectedFamily = ref('all')

  // 语系内组合定位条件（仅 selectedFamily 为汉藏/亚非/乌拉尔时生效）
  const targetLanguage = ref<string>('')
  const presence = ref<Presence>('present')
  const initial = ref('')
  const coverage = ref<Coverage>('any')

  // 异步加载状态
  const familyData = ref<Record<string, CognateSet[]>>({})
  const loading = ref(false)
  const error = ref('')

  // 详情与列表状态保留
  const detailRoot = ref<string | null>(null)
  const tableScrollTop = ref(0)
  const lastSelectedRoot = ref<string | null>(null)

  const familyMeta = computed(() => LANGUAGE_FAMILIES.find(f => f.id === selectedFamily.value))
  const isCombinable = computed(() => (COMBINABLE_FAMILIES as readonly string[]).includes(selectedFamily.value))

  // 当前语系的语言列；「全部语系」查询保持原有 6 列不变
  const activeLanguages = computed<string[]>(() => {
    if (selectedFamily.value === 'all') return IE_LANGUAGES
    return familyMeta.value?.languages ?? IE_LANGUAGES
  })

  // 当前语系的基础数据：全部语系 / 印欧语系直接用本地全量，组合语系用异步加载结果
  const scopeSets = computed<CognateSet[]>(() => {
    if (!isCombinable.value) {
      if (selectedFamily.value === 'all') return COGNATE_SETS
      return COGNATE_SETS.filter(cs => cs.family === selectedFamily.value)
    }
    return familyData.value[selectedFamily.value] ?? []
  })

  function matchSet(cs: CognateSet, overrides: MatchOverrides = {}): boolean {
    const target = overrides.targetLanguage !== undefined ? overrides.targetLanguage : targetLanguage.value
    const pres = overrides.presence ?? presence.value
    const ini = overrides.initial !== undefined ? overrides.initial : initial.value
    const cov = overrides.coverage ?? coverage.value

    // 原有搜索：词根 / 含义（以及词形，保持与旧查询一致）
    const q = normalize(searchQuery.value)
    const matchSearch = !q ||
      cs.root.toLowerCase().includes(q) ||
      cs.meaning.toLowerCase().includes(q) ||
      Object.values(cs.languages).some(w => normalize(w).includes(q))

    if (!matchSearch) return false

    // 目标语言是否出现
    const present = target ? hasWord(cs, target) : true
    if (target && pres === 'present' && !present) return false
    if (target && pres === 'absent' && present) return false

    // 词形首字母（基于目标语言的词形；“未出现”模式下首字母条件不适用）
    if (target && ini && pres !== 'absent' && (!present || wordInitial(cs.languages[target]) !== ini)) return false

    // 词形覆盖完整度
    if (cov !== 'any' && coverageOf(cs, activeLanguages.value) !== cov) return false

    return true
  }

  const filteredCognates = computed(() => scopeSets.value.filter(cs => matchSet(cs)))

  const totalCount = computed(() => scopeSets.value.length)
  const resultCount = computed(() => filteredCognates.value.length)

  /** 只放开某一个条件、其余条件保持生效时的计数，用于下拉分面 */
  function countWith(overrides: MatchOverrides): number {
    return scopeSets.value.reduce((n, cs) => n + (matchSet(cs, overrides) ? 1 : 0), 0)
  }

  const languageFacets = computed(() =>
    activeLanguages.value.map(lang => ({
      lang,
      presentCount: countWith({ targetLanguage: lang, presence: 'present', initial: '' }),
      absentCount: countWith({ targetLanguage: lang, presence: 'absent', initial: '' }),
    }))
  )

  const presenceFacets = computed(() => ({
    present: countWith({ presence: 'present' }),
    absent: countWith({ presence: 'absent' }),
    any: countWith({ presence: 'any' }),
  }))

  const initialFacets = computed(() => {
    const target = targetLanguage.value
    if (!target) return []
    const counts: Record<string, number> = {}
    for (const cs of scopeSets.value) {
      if (!hasWord(cs, target)) continue
      const ini = wordInitial(cs.languages[target])
      counts[ini] = (counts[ini] ?? 0) + (matchSet(cs, { initial: ini }) ? 1 : 0)
    }
    return Object.entries(counts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value))
  })

  const coverageFacets = computed(() => ({
    full: countWith({ coverage: 'full' }),
    partial: countWith({ coverage: 'partial' }),
    any: countWith({ coverage: 'any' }),
  }))

  const hasActiveFilters = computed(() =>
    !!searchQuery.value || isCombinable.value &&
      (!!targetLanguage.value || presence.value !== 'any' || !!initial.value || coverage.value !== 'any')
  )

  // 仅清除语系内组合条件（语系与搜索框不动）
  function resetFamilyFilters() {
    targetLanguage.value = ''
    presence.value = 'any'
    initial.value = ''
    coverage.value = 'any'
  }

  // 空结果入口：清除全部条件，回到该语系的完整列表
  function clearAllFilters() {
    searchQuery.value = ''
    if (isCombinable.value) resetFamilyFilters()
  }

  async function ensureFamily(family: string) {
    if (family === 'all' || family === 'ie') {
      loading.value = false
      error.value = ''
      return
    }
    if (familyData.value[family]) {
      loading.value = false
      error.value = ''
      return
    }
    loading.value = true
    error.value = ''
    try {
      const data = await fetchCognateSets(family)
      familyData.value = { ...familyData.value, [family]: data }
      error.value = ''
    } catch (e: any) {
      error.value = e?.message || '加载失败'
    } finally {
      loading.value = false
    }
  }

  // 失败重试：不触碰任何已选条件
  function retryFamily() {
    return ensureFamily(selectedFamily.value)
  }

  // 切换语系：重置语系内组合条件、关闭详情，并加载该语系数据
  watch(selectedFamily, (family, old) => {
    if (family !== old) {
      resetFamilyFilters()
      detailRoot.value = null
      ensureFamily(family)
    }
  })

  // 选择/清空目标语言：显式联动重置（不用 watcher —— 与切语系的重置同批发生时
  // watcher 只比较刷新前后最终值，会漏掉中间变化）
  function selectTargetLanguage(lang: string) {
    if (lang === targetLanguage.value) return
    targetLanguage.value = lang
    initial.value = ''
    presence.value = lang ? 'present' : 'any'
  }

  function openDetail(root: string) {
    lastSelectedRoot.value = root
    detailRoot.value = root
  }

  // 返回列表：语系/条件/滚动位置/原选中词条均已在 state 中保留
  function closeDetail() {
    detailRoot.value = null
  }

  const detailSet = computed(() =>
    detailRoot.value ? scopeSets.value.find(cs => cs.root === detailRoot.value) ?? null : null
  )

  return {
    // state
    graph, selectedNode,
    searchQuery, selectedFamily,
    targetLanguage, presence, initial, coverage,
    loading, error,
    detailRoot, tableScrollTop, lastSelectedRoot,
    // computed
    familyMeta, isCombinable, activeLanguages,
    filteredCognates, scopeSets,
    totalCount, resultCount,
    languageFacets, presenceFacets, initialFacets, coverageFacets,
    hasActiveFilters, detailSet,
    // actions
    resetFamilyFilters, clearAllFilters, ensureFamily, retryFamily,
    selectTargetLanguage,
    openDetail, closeDetail,
  }
})
