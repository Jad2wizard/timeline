import * as _ from 'lodash'
import * as elementResizeEvent from 'element-resize-event'
import * as moment from 'moment'
import { Style, RequiredStyle, defaultStyle } from './style'
import { drawPlayBtn, mouseInPlayBtn } from './canvas/playBtn'
import { drawTimeScale, mouseInTimeScale } from './canvas/timeScale'
import { drawTickZone, mouseInTickZone } from './canvas/tickZone'
import { containerHeight, LevelKey, levelKeys, levelMap, timeScaleList } from './constants'

type Props = {
	parentElement: HTMLElement
	style?: Style
}

class Timeline {
	private startTime = 0
	private endTime = 0
	private _container: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D | null
	private style: RequiredStyle
	private currentTime: number
	private tickGap: number
	private level: LevelKey
	private isPlaying = false
	private timeScale = 1
	private draggingItem?: 'timeline' | 'progress'

	constructor(props: Props) {
		this.currentTime = -1
		this.level = 'second'
		this.tickGap = 20
		this.style = _.merge({}, defaultStyle, props.style)
		this._container = document.createElement('canvas')
		this._container.style.background = this.style.background
		this._container.style.width = '100%'
		this._container.style.height = containerHeight + 'px'
		this._container.style.borderRadius = '0px'
		props.parentElement.appendChild(this._container)
		this._container.width = this._container.offsetWidth
		this._container.height = this._container.offsetHeight

		this.ctx = this._container.getContext('2d')
		if (!this.ctx) {
			throw '浏览器不支持 canvas'
		}

		elementResizeEvent(document.body, this.resize)
		this.bindEvents()
	}

	get container() {
		return this._container
	}

	render() {
		if (!this.ctx || this.currentTime < 0) return
		drawPlayBtn(this.ctx, this.style.playBtn, this.isPlaying)
		drawTimeScale(this.ctx, this.style.timeScale, this.timeScale)
		drawTickZone(this.ctx, this.style, moment(this.currentTime), this.level, this.tickGap)
	}

	setTimeRange(startTime: number, endTime: number) {
		this.startTime = startTime
		this.endTime = endTime
		this.currentTime = Math.min(Math.max(this.startTime, this.currentTime), this.endTime)
		this.render()
	}

	setCurrentTime(time: number) {
		this.currentTime = time
		this.render()
	}

	setTimeUnit(unit: LevelKey) {
		this.level = unit
		this.render()
	}

	setPlay(p: boolean) {
		this.isPlaying = p
		this.render()
	}

	resize = () => {
		this._container.width = this._container.offsetWidth
		this._container.height = this._container.offsetHeight
		this.render()
	}

	dispose() {
		this.unbindEvents()
		elementResizeEvent.unbind(document.body, this.resize)
	}

	private setTickGap(t: number) {
		this.tickGap = t
		this.render()
	}

	private onMouseWheel = (e: WheelEvent) => {
		const { minGap, maxGap } = levelMap[this.level]
		if (e.deltaY > 0) {
			if (this.tickGap < maxGap) {
				this.setTickGap(this.tickGap + 1)
			} else {
				const forwardLevel = levelKeys[levelKeys.indexOf(this.level) + 1] as LevelKey
				if (!forwardLevel) return
				this.level = forwardLevel
				this.setTickGap(levelMap[this.level].minGap)
			}
		} else if (e.deltaY < 0) {
			if (this.tickGap > minGap) {
				this.setTickGap(this.tickGap - 1)
			} else {
				const nextLevel = levelKeys[levelKeys.indexOf(this.level) - 1] as LevelKey
				if (!nextLevel) return
				this.level = nextLevel
				this.setTickGap(levelMap[this.level].maxGap)
			}
		}
	}

	private onMouseDown = (e: MouseEvent) => {
		if (!this.ctx) return
		const { x, y } = this.getCanvasCoord(e)
		if (mouseInPlayBtn(x, y)) {
			this.onPlayBtnClick()
			return
		}
		const timeScaleDir = mouseInTimeScale(this.ctx, this.timeScale, x, y)
		if (timeScaleDir) {
			this.onTimeScaleClick(timeScaleDir)
			return
		}
		if (mouseInTickZone(this.ctx, x, y)) {
			this.onTimelineMouseDown(x)
			return
		}
	}

	mouseDownX = 0
	private onTimelineMouseDown = (x: number) => {
		this.draggingItem = 'timeline'
		this.mouseDownX = x
		window.addEventListener('mousemove', this.onTimelineMouseMove)
		window.addEventListener('mouseup', this.onTimelineMouseUp)
	}

	private onTimelineMouseMove = (e: MouseEvent) => {
		const { x } = this.getCanvasCoord(e)
	}

	private onTimelineMouseUp() {
		window.removeEventListener('mousemove', this.onTimelineMouseMove)
		window.removeEventListener('mouseup', this.onTimelineMouseUp)
		this.draggingItem = undefined
	}

	private onPlayBtnClick = () => {
		this.isPlaying = !this.isPlaying
		this.render()
	}

	private onTimeScaleClick = (dir: 'up' | 'down') => {
		const index = timeScaleList.indexOf(this.timeScale)
		if (index === -1) return
		if (dir === 'up') {
			this.timeScale = timeScaleList[(index + 1) % timeScaleList.length]
		} else {
			this.timeScale = timeScaleList[(index - 1 + timeScaleList.length) % timeScaleList.length]
		}
		this.render()
	}

	private getCanvasCoord(e: MouseEvent) {
		const rect = this.container.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		return { x, y }
	}

	private bindEvents() {
		this.container.addEventListener('wheel', this.onMouseWheel)
		this.container.addEventListener('mousedown', this.onMouseDown)
	}

	private unbindEvents() {
		this.container.removeEventListener('wheel', this.onMouseWheel)
		this.container.removeEventListener('mousedown', this.onMouseDown)
	}
}

export default Timeline
