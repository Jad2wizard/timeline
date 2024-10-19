import * as _ from 'lodash'
import * as elementResizeEvent from 'element-resize-event'
import * as moment from 'moment'
import { Style, RequiredStyle, defaultStyle } from './style'
import { drawPlayBtn } from './canvas/playBtn'
import { drawTimeScale } from './canvas/timeScale'
import { drawTickZone } from './canvas/tickZone'
import { drawProgress } from './canvas/progress'
import { containerHeight, LevelKey } from './constants'
import Event from './mouseEvent'

type Props = {
	parentElement: HTMLElement
	style?: Style
}

class Timeline {
	private startTime = 0
	private endTime = 0
	private _container: HTMLCanvasElement
	private _ctx: CanvasRenderingContext2D | null
	private style: RequiredStyle
	private currentTime: number
	private tickGap: number
	private level: LevelKey
	private isPlaying = false
	private timeScale = 1
	private disposed = false
	private event: Event

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

		this._ctx = this._container.getContext('2d')
		if (!this._ctx) {
			throw '浏览器不支持 canvas'
		}

		this.event = new Event({
			canvas: this._container,
			ctx: this._ctx,
			style: this.style,
			getCurrentTime: () => this.currentTime,
			getStartTime: () => this.startTime,
			getEndTime: () => this.endTime,
			getTickGap: () => this.tickGap,
			getTimeScale: () => this.timeScale,
			getLevel: () => this.level,
			onLevelChange: (level: LevelKey) => {
				this.level = level
			},
			onTickGapChange: this.setTickGap.bind(this),
			onTimeScaleChange: this.setTimeScale.bind(this),
			onIsPlayingToggle: this.onIsPlayingChange.bind(this),
			onCurrentTimeChange: this.setCurrentTime.bind(this),
			pause: this.pause.bind(this),
		})
		elementResizeEvent(document.body, this.resize)
		requestAnimationFrame(this.animate)
	}

	get container() {
		return this._container
	}

	get ctx() {
		return this._ctx
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
		elementResizeEvent.unbind(document.body, this.resize)
		this.event.dispose()
	}

	private setTickGap(t: number) {
		this.tickGap = t
		this.render()
	}

	private setTimeScale(s: number) {
		this.timeScale = s
		this.render()
	}

	private onIsPlayingChange = () => {
		this.isPlaying = !this.isPlaying
		if (this.isPlaying) {
			this.play()
		} else {
			this.pause()
		}
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
