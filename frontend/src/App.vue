<template>
  <div class="min-h-screen bg-slate-900 text-slate-200">
    <header class="border-b border-slate-700 px-6 py-4">
      <h1 class="text-2xl font-bold text-cyan-400">语言词源图谱与多语系演化追踪</h1>
      <p class="text-sm text-slate-500 mt-1">D3.js力导向图 · 印欧语系演化 · 同源词对照 · 500+词根</p>
    </header>
    <div class="p-4 space-y-4">
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-400">词源力导向网络</h3>
            <div class="flex gap-3 text-xs">
              <span v-for="f in LANGUAGE_FAMILIES" :key="f.id" class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full" :style="{backgroundColor: f.color}"></span>{{ f.name }}
              </span>
            </div>
          </div>
          <svg ref="svgRef" class="w-full bg-slate-900 rounded" style="height:460px"></svg>
        </div>
        <div class="space-y-4">
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 class="text-sm font-bold text-slate-400 mb-3">语系概览</h3>
            <div class="space-y-2">
              <div v-for="f in LANGUAGE_FAMILIES" :key="f.id" class="flex items-start gap-2 text-sm">
                <span class="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" :style="{backgroundColor: f.color}"></span>
                <div><div class="font-bold">{{ f.name }}</div><div class="text-xs text-slate-500">{{ f.era }} · {{ f.languages.join('/') }}</div></div>
              </div>
            </div>
          </div>
          <div v-if="store.selectedNode" class="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 class="text-sm font-bold text-slate-400 mb-2">选中节点</h3>
            <div class="text-lg font-bold text-cyan-400">{{ store.selectedNode.word }}</div>
            <div class="text-sm text-slate-400">{{ store.selectedNode.language }} — {{ store.selectedNode.meaning }}</div>
          </div>
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 text-xs text-slate-400">
            <h3 class="text-sm font-bold text-slate-400 mb-2">Grimm定律</h3>
            <div class="space-y-1">
              <div class="bg-slate-900 rounded p-2"><span class="text-cyan-400">p→f: </span>pater → father</div>
              <div class="bg-slate-900 rounded p-2"><span class="text-green-400">t→θ: </span>tres → three</div>
              <div class="bg-slate-900 rounded p-2"><span class="text-orange-400">k→h: </span>cord → heart</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ 同源词对照表 ============ -->
      <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <!-- 详情视图 -->
        <div v-if="store.detailOpen && store.selectedCognate">
          <CognateDetail :cs="store.selectedCognate" @back="backFromDetail" />
        </div>

        <!-- 列表视图 -->
        <template v-else>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-400">同源词对照表</h3>
            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span>共 <span class="text-cyan-300 font-bold">{{ store.filteredCognates.length }}</span> 条<template v-if="store.isFamilyMode"> / {{ store.familyCognateCount }}</template><template v-if="store.activeFilterCount">（已筛选 {{ store.activeFilterCount }} 项）</template></span>
              <button class="px-2 py-1 rounded border border-slate-600 hover:border-cyan-500 hover:text-cyan-300 disabled:opacity-40"
                :disabled="store.loading" @click="store.loadCognates()" title="重新加载数据">↻ 重新加载</button>
            </div>
          </div>

          <!-- 基础条件：搜索 + 语系（原有交互保持不变） -->
          <div class="flex gap-2 mb-3">
            <input v-model="store.searchQuery" placeholder="搜索词根/含义..." class="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500" />
            <select :value="store.selectedFamily" @change="store.setFamily(($event.target as HTMLSelectElement).value)"
              class="bg-slate-900 border border-slate-600 rounded px-2 text-sm text-slate-300">
              <option value="all">全部语系</option>
              <option v-for="f in LANGUAGE_FAMILIES" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>

          <!-- 语系内组合定位条件 -->
          <div v-if="store.isFamilyMode" class="flex flex-wrap items-center gap-2 mb-3 p-2 rounded bg-slate-900/60 border border-slate-700 text-xs">
            <span class="text-slate-500">语系内定位：</span>
            <select v-model="store.targetLanguage" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300">
              <option value="">目标语言：任意</option>
              <option v-for="l in store.familyLanguages" :key="l" :value="l">目标语言：{{ l }}</option>
            </select>
            <select v-model="store.presenceMode" :disabled="!store.targetLanguage"
              class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300 disabled:opacity-40">
              <option value="any">出现情况：不限</option>
              <option value="present">仅看出现</option>
              <option value="absent">仅看缺失</option>
            </select>
            <select v-model="store.wordInitial" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300">
              <option value="">词形首字母：不限</option>
              <option v-for="i in store.initialOptions" :key="i" :value="i">首字母 {{ i.toUpperCase() }}</option>
            </select>
            <select v-model="store.coverageMode" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-300">
              <option value="any">覆盖完整度：不限</option>
              <option value="full">完整覆盖</option>
              <option value="partial">存在缺失</option>
            </select>
            <button v-if="hasSubFilters" class="px-2 py-1 rounded border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200"
              @click="store.clearSubFilters()">清空子条件</button>

            <!-- 生效条件标签 -->
            <span v-if="store.activeFilterCount" class="w-full flex flex-wrap gap-1.5 mt-1">
              <span v-if="store.searchQuery.trim()" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
                含义/词根：{{ store.searchQuery }}
                <button @click="store.searchQuery = ''">✕</button>
              </span>
              <span v-if="store.targetLanguage" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
                {{ store.targetLanguage }}·{{ presenceLabel }}
                <button @click="store.targetLanguage = ''; store.presenceMode = 'any'">✕</button>
              </span>
              <span v-if="store.wordInitial" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">
                首字母 {{ store.wordInitial.toUpperCase() }}
                <button @click="store.wordInitial = ''">✕</button>
              </span>
              <span v-if="store.coverageMode !== 'any'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
                {{ store.coverageMode === 'full' ? '完整覆盖' : '存在缺失' }}
                <button @click="store.coverageMode = 'any'">✕</button>
              </span>
              <button class="underline text-slate-500 hover:text-slate-300" @click="store.clearAllFilters()">清除全部条件</button>
            </span>
          </div>

          <!-- 加载失败：条件区仍在上方可编辑，重试不会清空条件 -->
          <div v-if="store.error" class="rounded border border-rose-700 bg-rose-950/40 p-6 text-center">
            <div class="text-sm text-rose-300 mb-1">⚠ {{ store.error }}</div>
            <div class="text-xs text-slate-500 mb-3">已选筛选条件已保留，可直接重试</div>
            <button class="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-sm disabled:opacity-50"
              :disabled="store.loading" @click="store.loadCognates()">
              {{ store.loading ? '重试中…' : '重试' }}
            </button>
          </div>

          <!-- 加载中 -->
          <div v-else-if="store.loading" class="p-8 text-center text-sm text-slate-500">同源词数据加载中…</div>

          <!-- 空结果 -->
          <div v-else-if="!store.filteredCognates.length" class="p-8 text-center">
            <div class="text-sm text-slate-400 mb-1">没有符合当前条件的同源词</div>
            <div class="text-xs text-slate-500 mb-3">
              当前语系：{{ store.currentFamily?.name }}，可放宽或清除条件后重试
            </div>
            <div class="flex justify-center gap-2">
              <button class="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm" @click="store.clearAllFilters()">清除全部条件</button>
              <button v-if="hasSubFilters" class="px-3 py-1.5 rounded border border-slate-600 text-slate-300 text-sm hover:border-slate-400" @click="store.clearSubFilters()">仅清空子条件</button>
            </div>
          </div>

          <!-- 全部语系表（保持原有列与查询逻辑） -->
          <div v-else-if="!store.isFamilyMode" ref="tableScrollRef" class="overflow-auto max-h-64">
            <table class="w-full text-xs">
              <thead class="sticky top-0 bg-slate-700">
                <tr>
                  <th class="px-2 py-2 text-left text-slate-300">词根</th>
                  <th class="px-2 py-2 text-left text-slate-300">含义</th>
                  <th class="px-2 py-2 text-left text-cyan-400">英语</th>
                  <th class="px-2 py-2 text-left text-blue-400">法语</th>
                  <th class="px-2 py-2 text-left text-green-400">德语</th>
                  <th class="px-2 py-2 text-left text-orange-400">西班牙语</th>
                  <th class="px-2 py-2 text-left text-purple-400">俄语</th>
                  <th class="px-2 py-2 text-left text-yellow-400">拉丁语</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cs in store.filteredCognates" :key="cognateId(cs)" class="border-t border-slate-700 hover:bg-slate-700">
                  <td class="px-2 py-1.5 font-mono text-slate-200 font-bold">{{ cs.root }}</td>
                  <td class="px-2 py-1.5 text-slate-400">{{ cs.meaning }}</td>
                  <td class="px-2 py-1.5 font-mono text-cyan-300">{{ cs.languages['英语'] || '—' }}</td>
                  <td class="px-2 py-1.5 font-mono text-blue-300">{{ cs.languages['法语'] || '—' }}</td>
                  <td class="px-2 py-1.5 font-mono text-green-300">{{ cs.languages['德语'] || '—' }}</td>
                  <td class="px-2 py-1.5 font-mono text-orange-300">{{ cs.languages['西班牙语'] || '—' }}</td>
                  <td class="px-2 py-1.5 font-mono text-purple-300">{{ cs.languages['俄语'] || '—' }}</td>
                  <td class="px-2 py-1.5 font-mono text-yellow-300">{{ cs.languages['拉丁语'] || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 语系内组合定位表 -->
          <div v-else ref="tableScrollRef" class="overflow-auto max-h-64">
            <table class="w-full text-xs">
              <thead class="sticky top-0 bg-slate-700">
                <tr>
                  <th class="px-2 py-2 text-left text-slate-300">词根</th>
                  <th class="px-2 py-2 text-left text-slate-300">含义</th>
                  <th class="px-2 py-2 text-left text-slate-300">覆盖</th>
                  <th v-for="l in store.familyLanguages" :key="l"
                    class="px-2 py-2 text-left whitespace-nowrap" :class="LANG_COLORS[l] || 'text-slate-300'">
                    {{ l }}
                    <span v-if="store.targetLanguage === l" class="ml-1 text-emerald-400">◎</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cs in store.filteredCognates" :key="cognateId(cs)"
                  class="border-t border-slate-700 cursor-pointer hover:bg-slate-700/70"
                  :class="cognateId(cs) === store.selectedCognateId ? 'bg-cyan-500/10 ring-1 ring-inset ring-cyan-500/50' : ''"
                  @click="enterDetail(cs)">
                  <td class="px-2 py-1.5 font-mono text-slate-200 font-bold whitespace-nowrap">
                    <span v-if="store.coverageMode === 'full' && isFull(cs)" class="text-emerald-400 mr-1">✓</span>{{ cs.root }}
                  </td>
                  <td class="px-2 py-1.5 text-slate-400 whitespace-nowrap">{{ cs.meaning }}</td>
                  <td class="px-2 py-1.5 whitespace-nowrap" :class="isFull(cs) ? 'text-emerald-400' : 'text-rose-400'">
                    {{ filledCount(cs) }}/{{ store.familyLanguages.length }}
                  </td>
                  <td v-for="l in store.familyLanguages" :key="l" class="px-2 py-1.5 font-mono" :class="cellClass(cs, l)">
                    <FormHighlight :text="cs.languages[l] || ''" :query="store.searchQuery"
                      :hit-initial="initialHit(cs, l)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { useEtymologyStore, cognateId, LANGUAGE_FAMILIES } from './store/etymology'
import { initialOf } from './mock/data'
import type { CognateSet } from './types'
import FormHighlight from './components/FormHighlight.vue'
import CognateDetail from './components/CognateDetail.vue'

const store = useEtymologyStore()
const svgRef = ref<SVGSVGElement | null>(null)
const tableScrollRef = ref<HTMLElement | null>(null)
const windowScroll = ref(0)
const COLORS: Record<string, string> = { ie: '#3b82f6', st: '#22c55e', aa: '#f59e0b', ural: '#8b5cf6' }

const LANG_COLORS: Record<string, string> = {
  '英语': 'text-cyan-400', '法语': 'text-blue-400', '德语': 'text-green-400',
  '西班牙语': 'text-orange-400', '俄语': 'text-purple-400', '拉丁语': 'text-yellow-400',
  '汉语': 'text-red-300', '藏语': 'text-emerald-300', '缅甸语': 'text-amber-300',
  '阿拉伯语': 'text-amber-300', '希伯来语': 'text-sky-300',
  '芬兰语': 'text-violet-300', '匈牙利语': 'text-pink-300',
}

const presenceLabel = computed(() =>
  store.presenceMode === 'present' ? '出现' : store.presenceMode === 'absent' ? '缺失' : '不限'
)
const hasSubFilters = computed(() =>
  !!store.targetLanguage || !!store.wordInitial || store.coverageMode !== 'any'
)

function isFull(cs: CognateSet) {
  return store.isFullCoverage(cs, store.familyLanguages)
}
function filledCount(cs: CognateSet) {
  return store.familyLanguages.filter(l => !!cs.languages[l]).length
}

/** 目标语言出现/缺失命中的单元格 */
function presenceHit(cs: CognateSet, lang: string) {
  if (!store.targetLanguage || store.targetLanguage !== lang || store.presenceMode === 'any') return false
  const present = !!cs.languages[lang]
  return store.presenceMode === 'present' ? present : !present
}

/** 首字母命中的词形（未指定目标语言时各列各自判定） */
function initialHit(cs: CognateSet, lang: string) {
  if (!store.wordInitial) return false
  if (store.targetLanguage && store.targetLanguage !== lang) return false
  const w = cs.languages[lang]
  return !!w && initialOf(w) === store.wordInitial
}

function cellClass(cs: CognateSet, lang: string) {
  const present = !!cs.languages[lang]
  if (presenceHit(cs, lang)) {
    return present
      ? 'bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/70 text-emerald-200 font-bold'
      : 'bg-rose-500/20 ring-1 ring-inset ring-rose-500/70 text-rose-300 font-bold'
  }
  if (!present) return 'text-slate-600'
  if (initialHit(cs, lang)) return LANG_COLORS[lang] + ' bg-cyan-500/10'
  return LANG_COLORS[lang] || 'text-slate-300'
}

function enterDetail(cs: CognateSet) {
  windowScroll.value = window.scrollY
  store.openDetail(cs, tableScrollRef.value?.scrollTop ?? 0)
}

async function backFromDetail() {
  store.closeDetail()
  await nextTick()
  if (tableScrollRef.value) tableScrollRef.value.scrollTop = store.savedScrollTop
  window.scrollTo({ top: windowScroll.value })
}

function drawGraph() {
  if (!svgRef.value) return
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const W = svgRef.value.getBoundingClientRect().width || 700, H = 460
  const nodes = store.graph.nodes.map((n: any) => ({ ...n }))
  const links = store.graph.links.map((l: any) => ({ ...l }))
  const sim = d3.forceSimulation(nodes as any)
    .force('link', d3.forceLink(links as any).id((d: any) => d.id).distance(55))
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(22))
  const g = svg.append('g')
  svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 3]).on('zoom', (e) => g.attr('transform', e.transform)) as any)
  const link = g.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', '#475569').attr('stroke-width', 1).attr('opacity', 0.5)
  const node = g.append('g').selectAll('g').data(nodes).join('g')
    .call(d3.drag<any, any>()
      .on('start', (e, d: any) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
      .on('drag', (e, d: any) => { d.fx = e.x; d.fy = e.y })
      .on('end', (e, d: any) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }))
    .on('click', (_: any, d: any) => { store.selectedNode = d })
  node.append('circle')
    .attr('r', (d: any) => d.language === 'Proto-IE' ? 12 : 7)
    .attr('fill', (d: any) => COLORS[d.family] || '#64748b')
    .attr('stroke', '#1e293b').attr('stroke-width', 1.5)
  node.append('text').attr('dy', -14).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#e2e8f0')
    .text((d: any) => d.word.length > 8 ? d.word.slice(0, 8) + '…' : d.word)
  node.append('title').text((d: any) => `${d.word} (${d.language}): ${d.meaning}`)
  sim.on('tick', () => {
    link.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y)
    node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
  })
}

onMounted(() => {
  store.loadCognates()
  setTimeout(drawGraph, 100)
})
</script>
