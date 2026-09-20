import type { CognateSet, LanguageFamily } from '../types'

export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  { id: 'ie', name: '印欧语系', color: '#3b82f6', languages: ['英语','法语','德语','西班牙语','俄语','拉丁语'], era: '公元前4000年' },
  { id: 'st', name: '汉藏语系', color: '#22c55e', languages: ['汉语','藏语','缅甸语'], era: '公元前4000年' },
  { id: 'aa', name: '亚非语系', color: '#f59e0b', languages: ['阿拉伯语','希伯来语'], era: '公元前6000年' },
  { id: 'ural', name: '乌拉尔语系', color: '#8b5cf6', languages: ['芬兰语','匈牙利语'], era: '公元前5000年' },
]

export const COGNATE_SETS: CognateSet[] = [
  // —— 印欧语系 ——
  { root: '*pṓds', meaning: '脚/足', languages: { '英语': 'foot', '法语': 'pied', '德语': 'Fuß', '西班牙语': 'pie', '俄语': 'ступня', '拉丁语': 'pēs' }, period: 'PIE', family: 'ie' },
  { root: '*mātér', meaning: '母亲', languages: { '英语': 'mother', '法语': 'mère', '德语': 'Mutter', '西班牙语': 'madre', '俄语': 'мать', '拉丁语': 'māter' }, period: 'PIE', family: 'ie' },
  { root: '*pṓtr', meaning: '父亲', languages: { '英语': 'father', '法语': 'père', '德语': 'Vater', '西班牙语': 'padre', '俄语': 'отец', '拉丁语': 'pater' }, period: 'PIE', family: 'ie' },
  { root: '*h₂épo', meaning: '水', languages: { '英语': 'aqua', '法语': 'eau', '德语': 'Au', '西班牙语': 'agua', '俄语': 'вода', '拉丁语': 'aqua' }, period: 'PIE', family: 'ie' },
  { root: '*dʰómos', meaning: '家', languages: { '英语': 'dome', '法语': 'maison', '德语': 'Dom', '西班牙语': 'domo', '俄语': 'дом', '拉丁语': 'domus' }, period: 'PIE', family: 'ie' },
  { root: '*wḗdr̥', meaning: '水/Water', languages: { '英语': 'water', '法语': 'eau', '德语': 'Wasser', '俄语': 'вода', '拉丁语': 'unda' }, period: 'PIE', family: 'ie' },
  { root: '*sol-', meaning: '太阳', languages: { '英语': 'sun', '法语': 'soleil', '德语': 'Sonne', '西班牙语': 'sol', '俄语': 'солнце', '拉丁语': 'sol' }, period: 'PIE', family: 'ie' },
  { root: '*luks-', meaning: '光/亮', languages: { '英语': 'light', '法语': 'lumière', '德语': 'Licht', '西班牙语': 'luz', '俄语': 'луч', '拉丁语': 'lux' }, period: 'PIE', family: 'ie' },
  { root: '*nokʷt-', meaning: '夜晚', languages: { '英语': 'night', '法语': 'nuit', '德语': 'Nacht', '西班牙语': 'noche', '俄语': 'ночь', '拉丁语': 'nox' }, period: 'PIE', family: 'ie' },
  { root: '*okʷ-', meaning: '眼睛', languages: { '英语': 'eye', '法语': 'oeil', '德语': 'Auge', '西班牙语': 'ojo', '俄语': 'oko', '拉丁语': 'oculus' }, period: 'PIE', family: 'ie' },
  { root: '*ed-', meaning: '吃', languages: { '英语': 'eat', '德语': 'essen', '俄语': 'есть', '拉丁语': 'edere' }, period: 'PIE', family: 'ie' },
  { root: '*ǵneh₃-', meaning: '知道', languages: { '英语': 'know', '德语': 'kennen', '西班牙语': 'conocer', '俄语': 'знать', '拉丁语': 'gnoscere' }, period: 'PIE', family: 'ie' },
  { root: '*h₃érō', meaning: '鹰', languages: { '英语': 'eagle', '法语': 'aigle', '德语': 'Adler', '西班牙语': 'águila', '拉丁语': 'aquila' }, period: 'PIE', family: 'ie' },
  { root: '*sker-', meaning: '切割', languages: { '英语': 'shear', '德语': 'scheren', '俄语': 'резать', '拉丁语': 'scindere' }, period: 'PIE', family: 'ie' },
  { root: '*gʷen-', meaning: '女人', languages: { '英语': 'queen', '德语': 'Frau', '俄语': 'жена' }, period: 'PIE', family: 'ie' },

  // —— 汉藏语系（汉语/藏语/缅甸语；转写形式，便于首字母定位）——
  { root: '*s-ljuj', meaning: '水', languages: { '汉语': 'shuǐ', '藏语': 'chu', '缅甸语': 're' }, period: 'PST', family: 'st' },
  { root: '*mjej', meaning: '火', languages: { '汉语': 'huǒ', '藏语': 'me', '缅甸语': 'mî' }, period: 'PST', family: 'st' },
  { root: '*mik', meaning: '眼睛', languages: { '汉语': 'mù', '藏语': 'mig', '缅甸语': 'myak' }, period: 'PST', family: 'st' },
  { root: '*ma', meaning: '母亲', languages: { '汉语': 'mǔ', '藏语': 'ma' }, period: 'PST', family: 'st' },
  { root: '*pā', meaning: '父亲', languages: { '汉语': 'fù', '藏语': 'pha', '缅甸语': 'apha' }, period: 'PST', family: 'st' },
  { root: '*nəm', meaning: '太阳/日', languages: { '汉语': 'rì', '藏语': 'nyi ma', '缅甸语': 'ne' }, period: 'PST', family: 'st' },
  { root: '*g-sum', meaning: '三', languages: { '汉语': 'sān', '藏语': 'gsum', '缅甸语': 'sûm' }, period: 'PST', family: 'st' },
  { root: '*l-ŋa', meaning: '五', languages: { '汉语': 'wǔ', '藏语': 'lnga', '缅甸语': 'ngâ' }, period: 'PST', family: 'st' },
  { root: '*s-jəm', meaning: '心', languages: { '汉语': 'xīn', '藏语': 'sems' }, period: 'PST', family: 'st' },
  { root: '*kʷə', meaning: '狗', languages: { '汉语': 'quǎn', '藏语': 'khyi', '缅甸语': 'khwe' }, period: 'PST', family: 'st' },

  // —— 亚非语系（阿拉伯语/希伯来语；拉丁转写）——
  { root: '*māy-', meaning: '水', languages: { '阿拉伯语': "ma'", '希伯来语': 'máyim' }, period: 'PAA', family: 'aa' },
  { root: '*ʾimm-', meaning: '母亲', languages: { '阿拉伯语': 'umm', '希伯来语': 'em' }, period: 'PAA', family: 'aa' },
  { root: '*ʾab-', meaning: '父亲', languages: { '阿拉伯语': 'ab', '希伯来语': 'av' }, period: 'PAA', family: 'aa' },
  { root: '*ṯalāṯ-', meaning: '三', languages: { '阿拉伯语': 'thalath', '希伯来语': 'shalosh' }, period: 'PAA', family: 'aa' },
  { root: '*lisān-', meaning: '舌头', languages: { '阿拉伯语': 'lisan', '希伯来语': 'lashon' }, period: 'PAA', family: 'aa' },
  { root: '*kalb-', meaning: '狗', languages: { '阿拉伯语': 'kalb', '希伯来语': 'kelev' }, period: 'PAA', family: 'aa' },
  { root: '*bayt-', meaning: '房子', languages: { '阿拉伯语': 'bayt', '希伯来语': 'bayit' }, period: 'PAA', family: 'aa' },
  { root: '*yad-', meaning: '手', languages: { '阿拉伯语': 'yad', '希伯来语': 'yad' }, period: 'PAA', family: 'aa' },
  { root: '*ʿayn-', meaning: '眼睛', languages: { '阿拉伯语': 'ayn' }, period: 'PAA', family: 'aa' },
  { root: '*šamš-', meaning: '太阳', languages: { '阿拉伯语': 'shams' }, period: 'PAA', family: 'aa' },

  // —— 乌拉尔语系（芬兰语/匈牙利语）——
  { root: '*wete', meaning: '水', languages: { '芬兰语': 'vesi', '匈牙利语': 'víz' }, period: 'PU', family: 'ural' },
  { root: '*käte', meaning: '手', languages: { '芬兰语': 'käsi', '匈牙利语': 'kéz' }, period: 'PU', family: 'ural' },
  { root: '*silmä', meaning: '眼睛', languages: { '芬兰语': 'silmä', '匈牙利语': 'szem' }, period: 'PU', family: 'ural' },
  { root: '*neljä', meaning: '四', languages: { '芬兰语': 'neljä', '匈牙利语': 'négy' }, period: 'PU', family: 'ural' },
  { root: '*wītē', meaning: '五', languages: { '芬兰语': 'viisi' }, period: 'PU', family: 'ural' },
  { root: '*kuole-', meaning: '死', languages: { '芬兰语': 'kuolla' }, period: 'PU', family: 'ural' },
  { root: '*kala', meaning: '鱼', languages: { '芬兰语': 'kala' }, period: 'PU', family: 'ural' },
  { root: '*näke-', meaning: '看', languages: { '芬兰语': 'nähdä', '匈牙利语': 'néz' }, period: 'PU', family: 'ural' },
  { root: '*tule', meaning: '火', languages: { '芬兰语': 'tuli' }, period: 'PU', family: 'ural' },
  { root: '*kümmen', meaning: '十', languages: { '芬兰语': 'kymmenen' }, period: 'PU', family: 'ural' },
]

/** 取词形首字母：忽略词首的喉塞/引号符号与组合附加符号，统一小写，用于筛选与高亮 */
export function initialOf(word: string): string {
  const stripped = word.trim().replace(/^[ʾʿ'`\s]+/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return (stripped[0] || '').toLowerCase()
}

export function buildGraph() {
  const nodes: any[] = []
  const links: any[] = []
  COGNATE_SETS.filter(cs => cs.family === 'ie').forEach((cs, ci) => {
    const rootId = 'root_' + ci
    nodes.push({ id: rootId, word: cs.root, language: 'Proto-IE', meaning: cs.meaning, family: cs.family, era: '公元前5000年' })
    Object.entries(cs.languages).forEach(([lang, word]) => {
      if (!word || word === '-') return
      const nid = ci + '_' + lang
      nodes.push({ id: nid, word, language: lang, meaning: cs.meaning, family: cs.family, era: '现代' })
      links.push({ source: rootId, target: nid, type: 'derived' })
    })
  })
  return { nodes, links }
}

// —— 模拟远程数据加载：每个浏览器会话首次请求失败，重试即成功（用于演示失败重试，且不影响已选条件）——
const LOAD_FLAG = 'etymology.cognates.loaded'

export function fetchCognates(): Promise<CognateSet[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (sessionStorage.getItem(LOAD_FLAG) !== '1') {
        sessionStorage.setItem(LOAD_FLAG, '1')
        reject(new Error('同源词数据加载失败（模拟网络错误），请重试'))
        return
      }
      resolve(COGNATE_SETS)
    }, 500)
  })
}
