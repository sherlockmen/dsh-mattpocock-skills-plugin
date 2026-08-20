import type { Context } from '@deepseek-ai/cordis'

export const name: string

/** 将随包发布的 skills/ 目录注册为 DSH runtime skills。 */
export function apply(ctx: Context): void
