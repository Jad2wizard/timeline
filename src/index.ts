import * as _ from 'lodash'
import * as elementResizeEvent from 'element-resize-event'
import * as moment from 'moment'
import { Style, RequiredStyle, defaultStyle } from './style'
import { drawPlayBtn, mouseInPlayBtn } from './canvas/playBtn'
import { drawTimeScale, mouseInTimeScale } from './canvas/timeScale'
import { drawTickZone, mouseInTickZone } from './canvas/tickZone'
import { drawProgress, mouseInProgressPointer } from './canvas/progress'
import { containerHeight, leftZoneWidth, LevelKey, levelKeys, levelMap, rightPadding, timeScaleList } from './constants'

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
	private disposed = false

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
		requestAnimationFrame(this.animate)
	}

	get container() {
		return this._container
	}

	render() {
		if (!this.ctx || this.currentTime < 0) return
		drawPlayBtn(this.ctx, this.style.playBtn, this.isPlaying)
		drawTimeScale(this.ctx, this.style.timeScale, this.timeScale)
		drawProgress(this.ctx, this.style['progress'], this.currentTime, this.startTime, this.endTime)
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

	play() {
		this.lastTimestamp = 0
		this.isPlaying = true
		this.render()
	}

	pause() {
		this.isPlaying = false
		this.render()
	}

	resize = () => {
		this._container.width = this._container.offsetWidth
		this._container.height = this._container.offsetHeight
		this.render()
	}

	dispose() {
		this.disposed = true
		this.unbindEvents()
		elementResizeEvent.unbind(document.body, this.resize)
	}

	private setTickGap(t: number) {
		this.tickGap = t
		this.render()
	}

	private onMouseWheel = (e: WheelEvent) => {
		const { minGap, maxGap } = levelMap[this.level]
		const speed = e.shiftKey ? 5 : 1
		if (e.deltaY > 0) {
			if (this.tickGap < maxGap) {
				this.setTickGap(this.tickGap + speed)
			} else {
				const forwardLevel = levelKeys[levelKeys.indexOf(this.level) + 1] as LevelKey
				if (!forwardLevel) return
				this.level = forwardLevel
				this.setTickGap(levelMap[this.level].minGap)
			}
		} else if (e.deltaY < 0) {
			if (this.tickGap > minGap) {
				this.setTickGap(this.tickGap - speed)
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
		if (
			mouseInProgressPointer(
				this.ctx,
				this.style['progress'],
				x,
				y,
				this.currentTime,
				this.startTime,
				this.endTime,
			)
		) {
			this.onProgressPointerMouseDown(x)
			return
		}
		if (mouseInTickZone(this.ctx, x, y)) {
			this.onTimelineMouseDown(x)
			return
		}
	}

	mouseDownX = 0
	moveStartTime = 0

	private onProgressPointerMouseDown = (x: number) => {
		this.draggingItem = 'progress'
		this.mouseDownX = x
		this.moveStartTime = this.currentTime
		window.addEventListener('mousemove', this.onProgressPointerMouseMove)
		window.addEventListener('mouseup', this.onMouseUp)
	}

	private onProgressPointerMouseMove = (e: MouseEvent) => {
		if (this.draggingItem !== 'progress' || !this.ctx) return
		const { x } = this.getCanvasCoord(e)
		const dist = x - this.mouseDownX
		if (Math.abs(dist) <= 1) return
		this.pause()
		const timeRange = this.endTime - this.startTime
		const delta = dist / (this.ctx.canvas.width - leftZoneWidth - rightPadding)
		let currentTime = this.moveStartTime + delta * timeRange
		currentTime = Math.max(this.startTime, Math.min(this.endTime, currentTime))
		this.setCurrentTime(currentTime)
	}

	private onTimelineMouseDown = (x: number) => {
		this.draggingItem = 'timeline'
		this.mouseDownX = x
		this.moveStartTime = this.currentTime
		window.addEventListener('mousemove', this.onTimelineMouseMove)
		window.addEventListener('mouseup', this.onMouseUp)
	}

	private onTimelineMouseMove = (e: MouseEvent) => {
		if (this.draggingItem !== 'timeline') return
		// const speed = e.shiftKey ? 5 : 1
		const speed = 1
		const { x } = this.getCanvasCoord(e)
		const dist = x - this.mouseDownX
		if (Math.abs(dist) <= 1) return
		this.pause()
		const flag = dist > 0 ? 1 : -1
		let offset = 0
		let currentTime = this.moveStartTime
		while (Math.abs(offset) < Math.abs(dist)) {
			offset += flag * this.tickGap
			currentTime += -flag * levelMap[this.level].getOneTickTime(moment(currentTime)) * speed
		}
		currentTime = Math.max(this.startTime, Math.min(this.endTime, currentTime))
		this.setCurrentTime(currentTime)
	}

	private onMouseUp = () => {
		window.removeEventListener('mousemove', this.onTimelineMouseMove)
		window.removeEventListener('mouseup', this.onMouseUp)
		this.draggingItem = undefined
	}

	private onPlayBtnClick = () => {
		this.isPlaying = !this.isPlaying
		if (this.isPlaying) {
			this.play()
		} else {
			this.pause()
		}
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

	private lastTimestamp = 0
	private ellapsedTime = 0
	//每 1 / this.timeScale 秒，更新一次currentTime，每次累加 timeLevel 单位的时间
	private animate = (timestamp: number) => {
		if (this.disposed) return
		if (this.isPlaying && this.currentTime < this.endTime) {
			if (this.lastTimestamp === 0) this.lastTimestamp = timestamp
			const delta = timestamp - this.lastTimestamp
			this.lastTimestamp = timestamp

			if (this.ellapsedTime >= 1000 / this.timeScale) {
				const n = ((this.ellapsedTime / 1000) * this.timeScale) | 0
				this.currentTime = moment(this.currentTime).add(n, this.level).valueOf()
				this.ellapsedTime -= (n * 1000) / this.timeScale
				this.render()
			}
			this.ellapsedTime += delta
		}
		requestAnimationFrame(this.animate)
	}
}

export default Timeline
