import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, fetchCognates, initialOf, buildGraph } from '../mock/data'
import type { CognateSet } from '../types'
export { LANGUAGE_FAMILIES, COGNATE_SETS }

export type PresenceMode = 'any' | 'present' | 'absent'
export type CoverageMode = 'any' | 'full' | 'partial'

export function cognateId(cs: CognateSet): string {
  return cs.family + ':' + cs.root
}

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const selectedNode = ref<any>(null)

  // —— 数据加载（失败/重试均不改动下面的筛选条件）——
  const cognates = ref<CognateSet[]>([])
  const loading = ref(false)
  const error = ref('')

  async function loadCognates() {
    loading.value = true
    error.value = ''
    try {
      cognates.value = await fetchCognates()
    } catch (e: any) {
      error.value = e?.message || '数据加载失败'
    } finally {
      loading.value = false
    }
  }

  // —— 查询条件 ——
  const searchQuery = ref('')
  const selectedFamily = ref('all')
  const targetLanguage = ref('')                 // 目标语言（语系内）
  const presenceMode = ref<PresenceMode>('any')  // 目标语言是否出现
  const wordInitial = ref('')                    // 词形首字母
  const coverageMode = ref<CoverageMode>('any')  // 词形覆盖完整度

  const currentFamily = computed(() => LANGUAGE_FAMILIES.find(f => f.id === selectedFamily.value) || null)
  const familyLanguages = computed(() => currentFamily.value?.languages || [])
  const isFamilyMode = computed(() => selectedFamily.value !== 'all')

  function resetSubFilters() {
    targetLanguage.value = ''
    presenceMode.value = 'any'
    wordInitial.value = ''
    coverageMode.value = 'any'
  }

  function setFamily(id: string) {
    if (id === selectedFamily.value) return
    selectedFamily.value = id
    resetSubFilters()
    closeDetail()
  }

  function clearSubFilters() { resetSubFilters() }
  function clearAllFilters() {
    searchQuery.value = ''
    resetSubFilters()
  }

  // 某语系下实际出现过的词形首字母（供下拉选项）
  const initialOptions = computed(() => {
    if (!currentFamily.value) return []
    const set = new Set<string>()
    cognates.value
      .filter(cs => cs.family === currentFamily.value!.id)
      .forEach(cs => Object.values(cs.languages).forEach(w => {
        const i = initialOf(w)
        if (i) set.add(i)
      }))
    return [...set].sort()
  })

  function isFullCoverage(cs: CognateSet, langs: string[]): boolean {
    return langs.every(l => !!cs.languages[l])
  }

  function matchCoverage(cs: CognateSet): boolean {
    if (coverageMode.value === 'any') return true
    const full = isFullCoverage(cs, familyLanguages.value)
    return coverageMode.value === 'full' ? full : !full
  }

  function matchInitial(cs: CognateSet): boolean {
    if (!wordInitial.value) return true
    const words = targetLanguage.value
      ? (cs.languages[targetLanguage.value] ? [cs.languages[targetLanguage.value]] : [])
      : Object.values(cs.languages)
    return words.some(w => initialOf(w) === wordInitial.value)
  }

  function matchPresence(cs: CognateSet): boolean {
    if (!targetLanguage.value || presenceMode.value === 'any') return true
    const has = !!cs.languages[targetLanguage.value]
    return presenceMode.value === 'present' ? has : !has
  }

  const filteredCognates = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!isFamilyMode.value) {
      // 全部语系：保持原有查询逻辑（词根/含义/词形 + 不按语系收敛）
      return cognates.value.filter(cs => {
        const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q)
          || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
        return matchSearch
      })
    }
    return cognates.value.filter(cs => {
      if (cs.family !== selectedFamily.value) return false
      const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q)
        || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
      return matchSearch && matchPresence(cs) && matchInitial(cs) && matchCoverage(cs)
    })
  })

  const familyCognateCount = computed(() =>
    currentFamily.value ? cognates.value.filter(cs => cs.family === currentFamily.value!.id).length : 0
  )

  // 生效中的条件数（搜索词 + 三个语系内条件）
  const activeFilterCount = computed(() =>
    (searchQuery.value.trim() ? 1 : 0)
    + (targetLanguage.value ? 1 : 0)
    + (wordInitial.value ? 1 : 0)
    + (coverageMode.value !== 'any' ? 1 : 0)
  )

  // —— 详情与返回状态（语系/条件/滚动位置/选中词条均保留）——
  const detailOpen = ref(false)
  const selectedCognateId = ref('')
  const savedScrollTop = ref(0)

  const selectedCognate = computed(() =>
    cognates.value.find(cs => cognateId(cs) === selectedCognateId.value) || null
  )

  function openDetail(cs: CognateSet, scrollTop: number) {
    selectedCognateId.value = cognateId(cs)
    savedScrollTop.value = scrollTop
    detailOpen.value = true
  }

  function closeDetail() {
    if (!detailOpen.value) return
    detailOpen.value = false
  }

  return {
    graph, selectedNode,
    cognates, loading, error, loadCognates,
    searchQuery, selectedFamily, targetLanguage, presenceMode, wordInitial, coverageMode,
    currentFamily, familyLanguages, isFamilyMode, initialOptions,
    filteredCognates, familyCognateCount, activeFilterCount,
    isFullCoverage, setFamily, resetSubFilters, clearSubFilters, clearAllFilters,
    detailOpen, selectedCognateId, selectedCognate, savedScrollTop, openDetail, closeDetail,
  }
})
