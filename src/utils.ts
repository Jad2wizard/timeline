import * as moment from 'moment'
import { LevelKey, levelMap } from './constants'

export const getAbsoluteLeft = (dom: HTMLElement | null): number => {
	if (!dom) return 0
	let offsetLeft = 0
	let parentEle: HTMLElement | null = dom.parentElement
	while (parentEle) {
		offsetLeft = offsetLeft + parentEle.offsetLeft
		parentEle = parentEle.parentElement
	}
	return offsetLeft
}

export const getFontSize = (font: string) => {
	const temp = font.split('')
	return Number(temp.find((i) => i.endsWith('px'))?.split('px')[0] || 0)
}

export const getCountOfTimeLevel = (timestamp: number, level: LevelKey) => {
	return (timestamp / 1000 / levelMap[level].duration) | 0
}
