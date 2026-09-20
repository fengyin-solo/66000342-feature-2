import type { CognateSet, LanguageFamily } from '../types'

export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  { id: 'ie', name: '印欧语系', color: '#3b82f6', languages: ['英语','法语','德语','西班牙语','俄语','拉丁语'], era: '公元前4000年' },
  { id: 'st', name: '汉藏语系', color: '#22c55e', languages: ['汉语','藏语','缅甸语'], era: '公元前4000年' },
  { id: 'aa', name: '亚非语系', color: '#f59e0b', languages: ['阿拉伯语','希伯来语'], era: '公元前6000年' },
  { id: 'ural', name: '乌拉尔语系', color: '#8b5cf6', languages: ['芬兰语','匈牙利语'], era: '公元前5000年' },
]

export const COGNATE_SETS: CognateSet[] = [
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

  // 汉藏语系（汉语 / 藏语 / 缅甸语）
  { root: '*s-ljuːʔ', meaning: '水', languages: { '汉语': '水', '藏语': 'ཆུ་', '缅甸语': 'ရေ' }, period: 'PST', family: 'st' },
  { root: '*pʰəjʔ', meaning: '火', languages: { '汉语': '火', '藏语': 'མེ་', '缅甸语': 'မီး' }, period: 'PST', family: 'st' },
  { root: '*mjuk', meaning: '眼睛', languages: { '汉语': '目', '藏语': 'མིག་', '缅甸语': 'မျက်လုံး' }, period: 'PST', family: 'st' },
  { root: '*r-naː', meaning: '耳朵', languages: { '汉语': '耳', '藏语': 'རྣ་བ་', '缅甸语': 'နား' }, period: 'PST', family: 'st' },
  { root: '*n̥jit', meaning: '太阳/日', languages: { '汉语': '日', '藏语': 'ཉི་མ་' }, period: 'PST', family: 'st' },
  { root: '*zlaː', meaning: '月亮', languages: { '汉语': '月', '藏语': 'ཟླ་བ་', '缅甸语': 'လ' }, period: 'PST', family: 'st' },
  { root: '*hljuʔ', meaning: '手', languages: { '汉语': '手', '缅甸语': 'လက်' }, period: 'PST', family: 'st' },
  { root: '*kəŋ', meaning: '脚/足', languages: { '汉语': '足', '藏语': 'རྐང་པ་', '缅甸语': 'ခြေ' }, period: 'PST', family: 'st' },
  { root: '*dŋja', meaning: '鱼', languages: { '汉语': '鱼', '藏语': 'ཉ་', '缅甸语': 'ငါး' }, period: 'PST', family: 'st' },
  { root: '*kʷen', meaning: '狗', languages: { '汉语': '犬', '缅甸语': 'ခွေး' }, period: 'PST', family: 'st' },
  { root: '*mjeŋ', meaning: '名字', languages: { '汉语': '名', '藏语': 'མིང་' }, period: 'PST', family: 'st' },
  { root: '*sijʔ', meaning: '死亡', languages: { '汉语': '死', '藏语': 'འཆི་བ་', '缅甸语': 'သေ' }, period: 'PST', family: 'st' },

  // 亚非语系（阿拉伯语 / 希伯来语，闪含词根 √q-ṭ-b 式三辅音词根）
  { root: '*√ktb', meaning: '书写', languages: { '阿拉伯语': 'كَتَبَ', '希伯来语': 'כָּתַב' }, period: 'PAA', family: 'aa' },
  { root: '*√qdš', meaning: '神圣', languages: { '阿拉伯语': 'قَدُسَ', '希伯来语': 'קָדַשׁ' }, period: 'PAA', family: 'aa' },
  { root: '*√šlm', meaning: '平安/完整', languages: { '阿拉伯语': 'سَلِمَ', '希伯来语': 'שָׁלוֹם' }, period: 'PAA', family: 'aa' },
  { root: '*√kbd', meaning: '沉重/荣耀', languages: { '阿拉伯语': 'كَبُدَ', '希伯来语': 'כָּבֵד' }, period: 'PAA', family: 'aa' },
  { root: '*√mlk', meaning: '王', languages: { '阿拉伯语': 'مَلِك', '希伯来语': 'מֶלֶךְ' }, period: 'PAA', family: 'aa' },
  { root: '*√ʕbd', meaning: '侍奉/劳作', languages: { '阿拉伯语': 'عَبَدَ', '希伯来语': 'עָבַד' }, period: 'PAA', family: 'aa' },
  { root: '*√ydʕ', meaning: '知道', languages: { '阿拉伯语': 'يَدَعَ', '希伯来语': 'יָדַע' }, period: 'PAA', family: 'aa' },
  { root: '*√rʔy', meaning: '看见', languages: { '阿拉伯语': 'رَأَى', '希伯来语': 'רָאָה' }, period: 'PAA', family: 'aa' },
  { root: '*√brk', meaning: '祝福/膝', languages: { '阿拉伯语': 'بَارَكَ', '希伯来语': 'בֵּרֵךְ' }, period: 'PAA', family: 'aa' },
  { root: '*√maw', meaning: '水', languages: { '阿拉伯语': 'مَاء', '希伯来语': 'מַיִם' }, period: 'PAA', family: 'aa' },
  { root: '*√yd', meaning: '手', languages: { '阿拉伯语': 'يَد' }, period: 'PAA', family: 'aa' },
  { root: '*√ktb-book', meaning: '书籍/文书', languages: { '阿拉伯语': 'كِتَاب' }, period: 'PAA', family: 'aa' },
  { root: '*√ḥyy', meaning: '生命', languages: { '希伯来语': 'חַיִּים' }, period: 'PAA', family: 'aa' },
  { root: '*√ḥlb', meaning: '奶/乳', languages: { '希伯来语': 'חָלָב' }, period: 'PAA', family: 'aa' },

  // 乌拉尔语系（芬兰语 / 匈牙利语）
  { root: '*wete', meaning: '水', languages: { '芬兰语': 'vesi', '匈牙利语': 'víz' }, period: 'PU', family: 'ural' },
  { root: '*käte', meaning: '手', languages: { '芬兰语': 'käsi', '匈牙利语': 'kéz' }, period: 'PU', family: 'ural' },
  { root: '*śilmä', meaning: '眼睛', languages: { '芬兰语': 'silmä', '匈牙利语': 'szem' }, period: 'PU', family: 'ural' },
  { root: '*vere', meaning: '血', languages: { '芬兰语': 'veri', '匈牙利语': 'vér' }, period: 'PU', family: 'ural' },
  { root: '*luwe', meaning: '骨头', languages: { '芬兰语': 'luu' }, period: 'PU', family: 'ural' },
  { root: '*kala', meaning: '鱼', languages: { '芬兰语': 'kala', '匈牙利语': 'hal' }, period: 'PU', family: 'ural' },
  { root: '*nime', meaning: '名字', languages: { '芬兰语': 'nimi', '匈牙利语': 'név' }, period: 'PU', family: 'ural' },
  { root: '*kole', meaning: '死亡', languages: { '芬兰语': 'kuolla', '匈牙利语': 'halni' }, period: 'PU', family: 'ural' },
  { root: '*ŋele', meaning: '舌头', languages: { '芬兰语': 'kieli', '匈牙利语': 'nyelv' }, period: 'PU', family: 'ural' },
  { root: '*śäntä', meaning: '尾巴', languages: { '芬兰语': 'häntä' }, period: 'PU', family: 'ural' },
  { root: '*śüδäme', meaning: '心脏', languages: { '芬兰语': 'sydän', '匈牙利语': 'szív' }, period: 'PU', family: 'ural' },
  { root: '*päŋe', meaning: '头', languages: { '芬兰语': 'pää', '匈牙利语': 'fej' }, period: 'PU', family: 'ural' },
  { root: '*kota', meaning: '家', languages: { '芬兰语': 'koti', '匈牙利语': 'ház' }, period: 'PU', family: 'ural' },
  { root: '*verkko', meaning: '网', languages: { '芬兰语': 'verkko' }, period: 'PU', family: 'ural' },
  { root: '*ńu̯li', meaning: '箭', languages: { '匈牙利语': 'nyíl' }, period: 'PU', family: 'ural' },
  { root: '*leipä', meaning: '面包', languages: { '芬兰语': 'leipä' }, period: 'PU', family: 'ural' },
]

export function buildGraph() {
  const nodes: any[] = []
  const links: any[] = []
  COGNATE_SETS.forEach((cs, ci) => {
    const rootId = 'root_' + ci
    nodes.push({ id: rootId, word: cs.root, language: 'Proto-IE', meaning: cs.meaning, family: 'ie', era: '公元前5000年' })
    Object.entries(cs.languages).forEach(([lang, word]) => {
      if (!word || word === '-') return
      const nid = ci + '_' + lang
      nodes.push({ id: nid, word, language: lang, meaning: cs.meaning, family: 'ie', era: '现代' })
      links.push({ source: rootId, target: nid, type: 'derived' })
    })
  })
  return { nodes, links }
}
