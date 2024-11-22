import * as moment from 'moment'
import { mouseInPlayBtn } from './canvas/playBtn'
import { mouseInTimeScale } from './canvas/timeScale'
import { mouseInTickZone } from './canvas/tickZone'
import { mouseInProgressPointer } from './canvas/progress'
import { RequiredStyle } from './style'
import { leftZoneWidth, LevelKey, levelKeys, levelMap, rightPadding, timeScaleList } from './constants'

type Props = {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	style: RequiredStyle
	getCurrentTime: () => number
	getStartTime: () => number
	getEndTime: () => number
	getLevel: () => LevelKey
	getTickGap: () => number
	getTimeScale: () => number
	onTickGapChange: (tickGap: number) => void
	onTimeScaleChange: (scale: number) => void
	onLevelChange: (level: LevelKey) => void
	onCurrentTimeChange: (currentTime: number) => void
	onIsPlayingToggle: () => void
	pause: () => void
}

class Event {
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	private style: RequiredStyle
	private draggingItem?: 'timeline' | 'progress'
	private hoverItem?: 'playBtn' | 'timeScale' | 'tickZone' | 'progressPointer'
	private getTimeScale: () => number
	private getCurrentTime: () => number
	private getStartTime: () => number
	private getEndTime: () => number
	private getTickGap: () => number
	private getLevel: () => LevelKey
	private onTickGapChange: (tickGap: number) => void
	private onTimeScaleChange: (scale: number) => void
	private onLevelChange: (level: LevelKey) => void
	private onCurrentTimeChange: (currentTime: number) => void
	private onIsPlayingToggle: () => void
	private pause: () => void

	constructor(props: Props) {
		this.canvas = props.canvas
		this.ctx = props.ctx
		this.style = props.style

		this.getLevel = props.getLevel
		this.getTickGap = props.getTickGap
		this.getTimeScale = props.getTimeScale
		this.getCurrentTime = props.getCurrentTime
		this.getStartTime = props.getStartTime
		this.getEndTime = props.getEndTime
		this.onLevelChange = props.onLevelChange
		this.onTickGapChange = props.onTickGapChange
		this.onTimeScaleChange = props.onTimeScaleChange
		this.onCurrentTimeChange = props.onCurrentTimeChange
		this.onIsPlayingToggle = props.onIsPlayingToggle

		this.pause = props.pause

		this.canvas.addEventListener('wheel', this.onMouseWheel)
		this.canvas.addEventListener('mousedown', this.onMouseDown)
		this.canvas.addEventListener('mousemove', this.onMouseMove)
	}

	private getCanvasCoord(e: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		return { x, y }
	}

	private onMouseMove = (e: MouseEvent) => {
		if (!this.ctx) return
		const { x, y } = this.getCanvasCoord(e)
		const onPlayBtn = mouseInPlayBtn(x, y)
		if (onPlayBtn && this.hoverItem !== 'playBtn') {
			this.hoverItem = 'playBtn'
			this.canvas.style.cursor = 'pointer'
			return
		}
		const onTimeScale = mouseInTimeScale(this.ctx, this.getTimeScale(), x, y)
		if (onTimeScale) {
			this.hoverItem = 'timeScale'
			this.canvas.style.cursor = 'pointer'
			return
		}
		const onProgressPointer = mouseInProgressPointer(
			this.ctx,
			this.style['progress'],
			x,
			y,
			this.getCurrentTime(),
			this.getStartTime(),
			this.getEndTime(),
		)
		if (onProgressPointer) {
			this.hoverItem = 'progressPointer'
			this.canvas.style.cursor = 'move'
			return
		}
		const onTickZone = mouseInTickZone(this.ctx, x, y)
		if (onTickZone) {
			this.hoverItem = 'tickZone'
			this.canvas.style.cursor = 'ew-resize'
			return
		}
		if (!onTimeScale && !onPlayBtn && !onProgressPointer && this.hoverItem) {
			this.hoverItem = undefined
			this.canvas.style.cursor = 'default'
		}
	}

	private onMouseDown = (e: MouseEvent) => {
		if (!this.ctx) return
		const { x, y } = this.getCanvasCoord(e)
		if (mouseInPlayBtn(x, y)) {
			this.onPlayBtnClick()
			return
		}
		const timeScaleDir = mouseInTimeScale(this.ctx, this.getTimeScale(), x, y)
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
				this.getCurrentTime(),
				this.getStartTime(),
				this.getEndTime(),
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

	private onMouseWheel = (e: WheelEvent) => {
		const { minGap, maxGap } = levelMap[this.getLevel()]
		const speed = e.shiftKey ? 5 : 1
		const tickGap = this.getTickGap()
		const level = this.getLevel()
		if (e.deltaY > 0) {
			if (tickGap < maxGap) {
				this.onTickGapChange(tickGap + speed)
			} else {
				const forwardLevel = levelKeys[levelKeys.indexOf(level) + 1] as LevelKey
				if (!forwardLevel) return
				this.onLevelChange(forwardLevel)
				this.onTickGapChange(levelMap[forwardLevel].minGap)
			}
		} else if (e.deltaY < 0) {
			if (tickGap > minGap) {
				this.onTickGapChange(tickGap - speed)
			} else {
				const nextLevel = levelKeys[levelKeys.indexOf(level) - 1] as LevelKey
				if (!nextLevel) return
				this.onLevelChange(nextLevel)
				this.onTickGapChange(levelMap[nextLevel].maxGap)
			}
		}
	}

	mouseDownX = 0
	moveStartTime = 0

	private onProgressPointerMouseDown = (x: number) => {
		this.draggingItem = 'progress'
		this.mouseDownX = x
		this.moveStartTime = this.getCurrentTime()
		window.addEventListener('mousemove', this.onProgressPointerMouseMove)
		window.addEventListener('mouseup', this.onMouseUp)
	}

	private onProgressPointerMouseMove = (e: MouseEvent) => {
		if (this.draggingItem !== 'progress' || !this.ctx) return
		const { x } = this.getCanvasCoord(e)
		const dist = x - this.mouseDownX
		if (Math.abs(dist) <= 1) return
		this.pause()
		const timeRange = this.getEndTime() - this.getStartTime()
		const delta = dist / (this.ctx.canvas.width - leftZoneWidth - rightPadding)
		let currentTime = this.moveStartTime + delta * timeRange
		currentTime = Math.max(this.getStartTime(), Math.min(this.getEndTime(), currentTime))
		this.onCurrentTimeChange(currentTime)
	}

	private onTimelineMouseDown = (x: number) => {
		this.draggingItem = 'timeline'
		this.mouseDownX = x
		this.moveStartTime = this.getCurrentTime()
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
			offset += flag * this.getTickGap()
			currentTime += -flag * levelMap[this.getLevel()].getOneTickTime(moment(currentTime)) * speed
		}
		currentTime = Math.max(this.getStartTime(), Math.min(this.getEndTime(), currentTime))
		this.onCurrentTimeChange(currentTime)
	}

	private onMouseUp = () => {
		window.removeEventListener('mousemove', this.onTimelineMouseMove)
		window.removeEventListener('mouseup', this.onMouseUp)
		this.draggingItem = undefined
	}

	private onPlayBtnClick = () => {
		this.onIsPlayingToggle()
	}

	private onTimeScaleClick = (dir: 'up' | 'down') => {
		const index = timeScaleList.indexOf(this.getTimeScale())
		if (index === -1) return
		if (dir === 'up') {
			this.onTimeScaleChange(timeScaleList[(index + 1) % timeScaleList.length])
		} else {
			this.onTimeScaleChange(timeScaleList[(index - 1 + timeScaleList.length) % timeScaleList.length])
		}
	}

	dispose() {
		this.canvas.removeEventListener('wheel', this.onMouseWheel)
		this.canvas.removeEventListener('mousedown', this.onMouseDown)
		this.canvas.removeEventListener('mousemove', this.onMouseMove)
		//@ts-ignore
		this._canvas = null
	}
}

export default Event
