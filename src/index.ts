import * as _ from 'lodash'
import { Style, defaultStyle } from './style'
import { drawPlayBtn } from './canvas/playBtn'
import { drawTimeScale } from './canvas/timeScale'
import { containerHeight } from './constants'

type Props = {
	parentElement: HTMLElement
	style?: Style
}

class Timeline {
	private startTime = 0
	private endTime = 0
	private _container: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D | null
	constructor(props: Props) {
		const style: typeof defaultStyle = _.merge({}, defaultStyle, props.style)
		this._container = document.createElement('canvas')
		this._container.style.background = style.background
		this._container.style.width = '100%'
		this._container.style.height = containerHeight + 'px'
		this._container.style.borderRadius = '4px'
		props.parentElement.appendChild(this._container)
		this._container.width = this._container.offsetWidth
		this._container.height = this._container.offsetHeight

		this.ctx = this._container.getContext('2d')
		if (!this.ctx) {
			throw '浏览器不支持 canvas'
		}
		drawPlayBtn(this.ctx, style.playBtn, true)
		drawTimeScale(this.ctx, style.timeScale, 0.25)
	}

	get container() {
		return this._container
	}

	/*************  ✨ Codeium Command ⭐  *************/
	/**
	 * Sets the time range for the timeline. The timeline will be rendered to
	 * represent the given time range.
	 * @param startTime The start time of the time range.
	 * @param endTime The end time of the time range.
	 */
	/******  eb8f44fc-2c50-4067-915e-6a1c36a3b96f  *******/
	setTimeRange(startTime: number, endTime: number) {
		this.startTime = startTime
		this.endTime = endTime
	}
}

export default Timeline
