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
      <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 class="text-sm font-bold text-slate-400 mb-3">同源词对照表</h3>
        <div class="flex gap-2 mb-3">
          <input v-model="store.searchQuery" placeholder="搜索词根/含义..." class="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500" />
          <select v-model="store.selectedFamily" class="bg-slate-900 border border-slate-600 rounded px-2 text-sm text-slate-300">
            <option value="all">全部语系</option>
            <option v-for="f in LANGUAGE_FAMILIES" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </div>

        <!-- 语系内组合定位条件 -->
        <div v-if="store.isCombinable" class="flex flex-wrap items-center gap-2 mb-3 text-xs">
          <span class="text-slate-500 font-bold">语系内定位：</span>
          <select :value="store.targetLanguage" @change="store.selectTargetLanguage(($event.target as HTMLSelectElement).value)"
                  class="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-300">
            <option value="">目标语言（全部）</option>
            <option v-for="f in store.languageFacets" :key="f.lang" :value="f.lang">
              {{ f.lang }}（出现 {{ f.presentCount }} / 缺失 {{ f.absentCount }}）
            </option>
          </select>
          <select v-model="store.presence" :disabled="!store.targetLanguage"
                  class="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-300 disabled:opacity-40">
            <option value="present">出现（{{ store.presenceFacets.present }}）</option>
            <option value="absent">未出现（{{ store.presenceFacets.absent }}）</option>
            <option value="any">不限（{{ store.presenceFacets.any }}）</option>
          </select>
          <select v-model="store.initial" :disabled="!store.targetLanguage || store.presence === 'absent'"
                  class="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-300 disabled:opacity-40">
            <option value="">词形首字母（全部）</option>
            <option v-for="f in store.initialFacets" :key="f.value" :value="f.value">
              {{ f.value.toUpperCase() }}（{{ f.count }}）
            </option>
          </select>
          <select v-model="store.coverage" class="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-slate-300">
            <option value="any">覆盖：不限（{{ store.coverageFacets.any }}）</option>
            <option value="full">完整覆盖（{{ store.coverageFacets.full }}）</option>
            <option value="partial">部分覆盖（{{ store.coverageFacets.partial }}）</option>
          </select>
          <button @click="store.resetFamilyFilters()"
                  class="px-2 py-1 rounded border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400">
            重置组合条件
          </button>
          <span class="ml-auto text-slate-500">
            命中 <span class="text-cyan-400 font-bold">{{ store.resultCount }}</span> / {{ store.totalCount }} 条
          </span>
        </div>

        <div ref="scrollRef" class="overflow-x-auto max-h-64 overflow-y-auto">
          <!-- 详情面板：返回后保留语系、条件、滚动位置与原选中词条 -->
          <div v-if="store.detailSet" class="p-4 space-y-4 text-sm">
            <div class="flex items-center justify-between">
              <button @click="goBack()" class="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200">
                ← 返回列表（保留条件与滚动位置）
              </button>
              <span class="text-xs text-slate-500">{{ store.familyMeta?.name }} · {{ store.detailSet.period }}</span>
            </div>
            <div>
              <div class="text-xl font-bold font-mono text-cyan-400">
                <template v-for="(seg, i) in segments(store.detailSet.root)" :key="i">
                  <mark v-if="seg.hit" class="bg-amber-400/30 text-amber-100 rounded-sm">{{ seg.text }}</mark>
                  <span v-else>{{ seg.text }}</span>
                </template>
              </div>
              <div class="text-slate-300 mt-1">
                <template v-for="(seg, i) in segments(store.detailSet.meaning)" :key="i">
                  <mark v-if="seg.hit" class="bg-amber-400/30 text-amber-100 rounded-sm">{{ seg.text }}</mark>
                  <span v-else>{{ seg.text }}</span>
                </template>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span>词形覆盖度</span>
              <div class="w-32 h-1.5 bg-slate-700 rounded">
                <div class="h-1.5 rounded"
                     :class="detailPresent === store.activeLanguages.length ? 'bg-green-400' : 'bg-yellow-400'"
                     :style="{ width: (detailPresent / store.activeLanguages.length * 100) + '%' }"></div>
              </div>
              <span>{{ detailPresent }}/{{ store.activeLanguages.length }}</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-2">
              <div v-for="lang in store.activeLanguages" :key="lang"
                   class="bg-slate-900 rounded p-2"
                   :class="isTargetHit(store.detailSet, lang)
                     ? (wordOf(store.detailSet, lang) ? 'ring-1 ring-amber-400' : 'ring-1 ring-amber-400/40')
                     : ''">
                <div class="text-xs text-slate-500">
                  {{ lang }}
                  <span v-if="store.targetLanguage === lang" class="text-amber-400">● 目标语言</span>
                </div>
                <div v-if="wordOf(store.detailSet, lang)" class="font-mono mt-0.5"
                     :class="isTargetHit(store.detailSet, lang) ? 'text-amber-300 font-bold' : langTextClass(lang)">
                  <template v-for="(seg, i) in segments(wordOf(store.detailSet, lang))" :key="i">
                    <mark v-if="seg.hit" class="bg-amber-400 text-slate-900 rounded-sm">{{ seg.text }}</mark>
                    <span v-else>{{ seg.text }}</span>
                  </template>
                </div>
                <div v-else class="font-mono mt-0.5"
                     :class="isTargetHit(store.detailSet, lang) ? 'text-amber-300 font-bold' : 'text-slate-600'">
                  — 缺失
                </div>
              </div>
            </div>
          </div>

          <!-- 加载失败：重试不丢失已选条件 -->
          <div v-else-if="store.error" class="py-10 text-center text-sm space-y-3">
            <div class="text-red-400">加载失败：{{ store.error }}</div>
            <button @click="store.retryFamily()"
                    class="px-3 py-1.5 text-xs rounded bg-cyan-600 hover:bg-cyan-500 text-white">
              重试（保留当前条件）
            </button>
            <div class="text-xs text-slate-500">
              当前条件：{{ store.familyMeta?.name }}
              <template v-if="store.targetLanguage"> · {{ store.targetLanguage }}/{{ presenceLabel }}</template>
              <template v-if="store.initial"> · 首字母 {{ store.initial.toUpperCase() }}</template>
              <template v-if="store.coverage !== 'any'"> · {{ store.coverage === 'full' ? '完整覆盖' : '部分覆盖' }}</template>
              <template v-if="store.searchQuery"> · 搜索「{{ store.searchQuery }}」</template>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-else-if="store.loading" class="py-10 text-center text-sm text-slate-400">
            <span class="inline-block w-4 h-4 mr-2 rounded-full border-2 border-slate-600 border-t-cyan-400 animate-spin align-middle"></span>
            正在加载{{ store.familyMeta?.name }}同源词…
          </div>

          <!-- 空结果：提供清除条件入口 -->
          <div v-else-if="store.filteredCognates.length === 0" class="py-10 text-center text-sm text-slate-500 space-y-3">
            <div>没有符合当前条件的同源词</div>
            <button @click="store.clearAllFilters()"
                    class="px-3 py-1.5 text-xs rounded bg-cyan-600 hover:bg-cyan-500 text-white">
              清除全部条件
            </button>
          </div>

          <!-- 结果表 -->
          <table v-else class="w-full text-xs">
            <thead class="sticky top-0 bg-slate-700">
              <tr>
                <th class="px-2 py-2 text-left text-slate-300">词根</th>
                <th class="px-2 py-2 text-left text-slate-300">含义</th>
                <th v-for="lang in store.activeLanguages" :key="lang" class="px-2 py-2 text-left whitespace-nowrap"
                    :class="store.targetLanguage === lang ? 'text-amber-400' : langHeadClass(lang)">
                  {{ lang }}
                  <span v-if="store.targetLanguage === lang"> ●</span>
                </th>
                <th v-if="store.isCombinable" class="px-2 py-2 text-left text-slate-300">覆盖度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cs in store.filteredCognates" :key="cs.root"
                  class="border-t border-slate-700"
                  :class="rowClass(cs)"
                  @click="openRow(cs)">
                <td class="px-2 py-1.5 font-mono text-slate-200 font-bold">
                  <template v-for="(seg, i) in segments(cs.root)" :key="i">
                    <mark v-if="seg.hit" class="bg-amber-400/30 text-amber-100 rounded-sm">{{ seg.text }}</mark>
                    <span v-else>{{ seg.text }}</span>
                  </template>
                </td>
                <td class="px-2 py-1.5 text-slate-400">
                  <template v-for="(seg, i) in segments(cs.meaning)" :key="i">
                    <mark v-if="seg.hit" class="bg-amber-400/30 text-amber-100 rounded-sm">{{ seg.text }}</mark>
                    <span v-else>{{ seg.text }}</span>
                  </template>
                </td>
                <td v-for="lang in store.activeLanguages" :key="lang" class="px-2 py-1.5 font-mono">
                  <template v-if="wordOf(cs, lang)">
                    <span :class="cellWordClass(cs, lang)">
                      <template v-for="(seg, i) in segments(wordOf(cs, lang))" :key="i">
                        <mark v-if="seg.hit" class="bg-amber-400 text-slate-900 rounded-sm">{{ seg.text }}</mark>
                        <span v-else>{{ seg.text }}</span>
                      </template>
                    </span>
                  </template>
                  <span v-else :class="isTargetHit(cs, lang) ? 'text-amber-300 font-bold' : ''">—</span>
                </td>
                <td v-if="store.isCombinable" class="px-2 py-1.5 text-slate-400">
                  <div class="flex items-center gap-1 whitespace-nowrap">
                    <div class="w-8 h-1.5 bg-slate-700 rounded">
                      <div class="h-1.5 rounded"
                           :class="presentCount(cs) === store.activeLanguages.length ? 'bg-green-400' : 'bg-yellow-400'"
                           :style="{ width: (presentCount(cs) / store.activeLanguages.length * 100) + '%' }"></div>
                    </div>
                    {{ presentCount(cs) }}/{{ store.activeLanguages.length }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import * as d3 from 'd3'
import { useEtymologyStore, LANGUAGE_FAMILIES, wordInitial } from './store/etymology'
import type { CognateSet } from './types'

const store = useEtymologyStore()
const svgRef = ref<SVGSVGElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const COLORS: Record<string, string> = { ie: '#3b82f6', st: '#22c55e', aa: '#f59e0b', ural: '#8b5cf6' }

const LANG_TEXT: Record<string, string> = {
  英语: 'text-cyan-300', 法语: 'text-blue-300', 德语: 'text-green-300',
  西班牙语: 'text-orange-300', 俄语: 'text-purple-300', 拉丁语: 'text-yellow-300',
  汉语: 'text-rose-300', 藏语: 'text-teal-300', 缅甸语: 'text-lime-300',
  阿拉伯语: 'text-amber-300', 希伯来语: 'text-fuchsia-300',
  芬兰语: 'text-sky-300', 匈牙利语: 'text-violet-300',
}
const LANG_HEAD: Record<string, string> = {
  英语: 'text-cyan-400', 法语: 'text-blue-400', 德语: 'text-green-400',
  西班牙语: 'text-orange-400', 俄语: 'text-purple-400', 拉丁语: 'text-yellow-400',
  汉语: 'text-rose-400', 藏语: 'text-teal-400', 缅甸语: 'text-lime-400',
  阿拉伯语: 'text-amber-400', 希伯来语: 'text-fuchsia-400',
  芬兰语: 'text-sky-400', 匈牙利语: 'text-violet-400',
}

function langTextClass(lang: string) { return LANG_TEXT[lang] ?? 'text-slate-300' }
function langHeadClass(lang: string) { return LANG_HEAD[lang] ?? 'text-slate-300' }

function wordOf(cs: CognateSet, lang: string): string {
  const w = cs.languages[lang]
  return w && w.trim() !== '-' ? w : ''
}

function presentCount(cs: CognateSet): number {
  return store.activeLanguages.filter(l => wordOf(cs, l)).length
}

/** 该语言词形是否命中当前“目标语言 + 出现情况 + 首字母”条件 */
function isTargetHit(cs: CognateSet, lang: string): boolean {
  if (!store.isCombinable || store.targetLanguage !== lang) return false
  const w = wordOf(cs, lang)
  if (store.presence === 'absent') return !w
  if (!w) return false
  if (store.initial && wordInitial(w) !== store.initial) return false
  return true
}

function cellWordClass(cs: CognateSet, lang: string): string {
  if (isTargetHit(cs, lang)) {
    return 'bg-amber-400 text-slate-900 font-bold rounded px-1'
  }
  const soft = store.coverage !== 'any' && wordOf(cs, lang)
    ? ' underline decoration-dotted underline-offset-4 decoration-slate-500'
    : ''
  return langTextClass(lang) + soft
}

function rowClass(cs: CognateSet): string {
  if (!store.isCombinable) return 'hover:bg-slate-700'
  const selected = store.lastSelectedRoot === cs.root
  return 'cursor-pointer ' + (selected ? 'bg-cyan-950/60 hover:bg-cyan-900/60' : 'hover:bg-slate-700')
}

/** 将文本按搜索词拆成片段，用于高亮命中部分（非组合语系模式不高亮） */
function segments(text: string): { text: string; hit: boolean }[] {
  const q = store.isCombinable ? store.searchQuery.trim().toLowerCase() : ''
  if (!q || !text) return [{ text, hit: false }]
  const lower = text.toLowerCase()
  const out: { text: string; hit: boolean }[] = []
  let i = 0
  while (i < text.length) {
    const idx = lower.indexOf(q, i)
    if (idx === -1) {
      out.push({ text: text.slice(i), hit: false })
      break
    }
    if (idx > i) out.push({ text: text.slice(i, idx), hit: false })
    out.push({ text: text.slice(idx, idx + q.length), hit: true })
    i = idx + q.length
  }
  return out
}

const presenceLabel = computed(() =>
  ({ present: '出现', absent: '未出现', any: '不限' } as const)[store.presence]
)

const detailPresent = computed(() =>
  store.detailSet ? presentCount(store.detailSet) : 0
)

// 进入详情：保存滚动位置与选中词条（语系/条件保留在 store 中）
function openRow(cs: CognateSet) {
  if (!store.isCombinable) return
  if (scrollRef.value) store.tableScrollTop = scrollRef.value.scrollTop
  store.openDetail(cs.root)
}

// 返回列表：恢复滚动位置与原选中词条
function goBack() {
  store.closeDetail()
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = store.tableScrollTop
  })
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

onMounted(() => { setTimeout(drawGraph, 100) })
</script>
