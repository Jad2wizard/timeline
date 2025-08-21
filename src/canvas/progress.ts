import * as moment from 'moment'
import { RequiredStyle } from '../style'
import { leftZoneWidth, tickZoneHeight, rightPadding, bottomPadding, topPadding } from '../constants'

export const clearProgress = (ctx: CanvasRenderingContext2D) => {
	const containerWidth = ctx.canvas.width
	const containerHeight = ctx.canvas.height
	const height = containerHeight - bottomPadding - tickZoneHeight
	ctx.clearRect(leftZoneWidth, 0, containerWidth, height)
}

const trackY = 25

export const drawProgress = (
	ctx: CanvasRenderingContext2D,
	style: RequiredStyle['progress'],
	currentTime: number,
	startTime: number,
	endTime: number,
) => {
	clearProgress(ctx)
	if (!style.show) return
	const containerWidth = ctx.canvas.width
	const width = containerWidth - leftZoneWidth - rightPadding
	const progress = (currentTime - startTime) / (endTime - startTime)

	ctx.save()
	ctx.translate(leftZoneWidth, topPadding)
	//在左侧、中间和右侧分别绘制起始、当前和结束时间
	ctx.textBaseline = 'top'
	ctx.fillStyle = style.currentTimeLabel.color
	ctx.font = style.currentTimeLabel.font
	ctx.textAlign = 'left'
	ctx.fillText('当前时间：' + moment(currentTime).format('YYYY-MM-DD HH:mm:ss'), 0, 0)

	ctx.fillStyle = style.startTimeLabel.color
	ctx.font = style.startTimeLabel.font
	ctx.textAlign = 'right'
	ctx.fillText(
		`起始时间: ${moment(startTime).format('YYYY-MM-DD HH:mm:ss')} 结束时间：${moment(endTime).format('YYYY-MM-DD HH:mm:ss')}`,
		width,
		0,
	)

	//绘制 track 和 progress
	ctx.lineWidth = style.trackWidth
	ctx.lineCap = 'round'
	ctx.strokeStyle = style.trackBgColor
	ctx.beginPath()
	ctx.moveTo(0, trackY)
	ctx.lineTo(width, trackY)
	// ctx.closePath()
	ctx.stroke()

	ctx.strokeStyle = style.trackColor
	ctx.beginPath()
	ctx.moveTo(0, trackY)
	ctx.lineTo(width * progress, trackY)
	ctx.stroke()
	ctx.closePath()

	//绘制代表当前进度的圆点
	ctx.beginPath()
	ctx.arc(width * progress, trackY, style.pointerSize / 2, 0 * Math.PI, 2 * Math.PI, true)
	ctx.fillStyle = style.pointerColor
	ctx.closePath()
	ctx.fill()
	ctx.textAlign = 'left'
	ctx.textBaseline = 'middle'
	ctx.fillStyle = style.label.color
	ctx.font = style.label.font
	ctx.fillText((progress * 100).toFixed(2) + '%', width * progress + style.pointerSize, trackY)

	ctx.restore()
}

export const mouseInProgressPointer = (
	ctx: CanvasRenderingContext2D,
	style: RequiredStyle['progress'],
	x: number,
	y: number,
	currentTime: number,
	startTime: number,
	endTime: number,
) => {
	const containerWidth = ctx.canvas.width
	const width = containerWidth - leftZoneWidth - rightPadding
	const progress = (currentTime - startTime) / (endTime - startTime)
	const r = style.pointerSize / 2
	return (x - width * progress - leftZoneWidth) ** 2 + (y - trackY - topPadding) ** 2 < r ** 2
}
