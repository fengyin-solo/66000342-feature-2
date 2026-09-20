import { COGNATE_SETS } from './data'
import type { CognateSet } from '../types'

// 组合定位支持的语系（走异步加载，模拟后端查询）
export const COMBINABLE_FAMILIES = ['st', 'aa', 'ural'] as const

// 每个语系第一次加载必然失败，重试成功 —— 用于演示“失败重试不丢失已选条件”。
const delivered = new Set<string>()

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 重置某个语系的失败状态（仅供演示/测试使用） */
export function resetCognateDelivery(family?: string) {
  if (family) delivered.delete(family)
  else delivered.clear()
}

export async function fetchCognateSets(family: string): Promise<CognateSet[]> {
  await delay(450)
  if (!delivered.has(family)) {
    delivered.add(family)
    throw new Error(`「${family}」语系词库暂时不可达，请重试`)
  }
  return COGNATE_SETS.filter(cs => cs.family === family)
}
