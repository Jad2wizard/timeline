import { RequiredStyle } from '../style'
import { leftZoneWidth, tickZoneHeight, rightPadding, bottomPadding, LevelKey, startX, levelMap } from '../constants'
import { Moment } from 'moment'

export const clearTickZone = (ctx: CanvasRenderingContext2D) => {
	const containerWidth = ctx.canvas.width
	const containerHeight = ctx.canvas.height
	ctx.clearRect(leftZoneWidth, containerHeight - bottomPadding - tickZoneHeight, containerWidth, containerHeight)
}

export const mouseInTickZone = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
	const containerWidth = ctx.canvas.width
	const containerHeight = ctx.canvas.height
	return (
		x > leftZoneWidth &&
		x < containerWidth &&
		y > containerHeight - bottomPadding - tickZoneHeight &&
		y < containerHeight
	)
}

export const drawTickZone = (
	ctx: CanvasRenderingContext2D,
	style: RequiredStyle,
	currentTime: Moment,
	currentLevel: LevelKey,
	tickGap: number,
) => {
	clearTickZone(ctx)
	const containerWidth = ctx.canvas.width
	const containerHeight = ctx.canvas.height
	const pixelWidth = containerWidth - leftZoneWidth - rightPadding
	ctx.save()
	ctx.translate(leftZoneWidth, containerHeight - bottomPadding - tickZoneHeight)

	//绘制刻度轴最左侧指向当前时间的三角形
	ctx.beginPath()
	ctx.moveTo(startX - 5, 0)
	ctx.lineTo(startX + 5, 0)
	ctx.lineTo(startX, 12)
	ctx.lineTo(startX - 5, 0)
	ctx.closePath()
	ctx.fillStyle = style.pointerColor
	ctx.fill()

	//确定 lowerTick 和 upperTick 的位置
	const lowerTickXList: number[] = []
	const upperTickXList: number[] = []
	const midLabelList: { x: number; text: string }[] = []
	const upperLabelList: { x: number; text: string }[] = []
	let pixelOffset = startX
	let time = currentTime
	const level = levelMap[currentLevel]
	const uplabelWidth = level.getUplabelWidth(ctx)
	const midLabelWidth = level.getMidlabelWidth(ctx)
	tickGap = Math.min(Math.max(tickGap, level.minGap), level.maxGap)
	while (pixelOffset < pixelWidth) {
		if (level.shouldDrawHighLabel(time)) {
			if (pixelOffset > uplabelWidth / 2) upperLabelList.push({ x: pixelOffset, text: level.getUplabel(time) })
			if (pixelOffset > midLabelWidth / 2) midLabelList.push({ x: pixelOffset, text: level.getMidlabel(time) })
			upperTickXList.push(pixelOffset)
		} else if (level.shouldDrawMidLabel(time)) {
			if (pixelOffset > midLabelWidth / 2) midLabelList.push({ x: pixelOffset, text: level.getMidlabel(time) })
			upperTickXList.push(pixelOffset)
		} else {
			lowerTickXList.push(pixelOffset)
		}
		pixelOffset += tickGap
		time.add(1, currentLevel)
	}
	console.log(upperTickXList)

	//绘制短的刻度线
	let height = style.lowerTick.length
	ctx.strokeStyle = style.lowerTick.color
	ctx.lineWidth = style.lowerTick.lineWidth
	for (let x of lowerTickXList) {
		ctx.moveTo(x, 1)
		ctx.lineTo(x, height + 1)
	}
	ctx.stroke()

	//绘制长的刻度线
	height = style.upperTick.length
	ctx.strokeStyle = style.upperTick.color
	ctx.lineWidth = style.upperTick.lineWidth
	for (let x of upperTickXList) {
		ctx.moveTo(x, 1)
		ctx.lineTo(x, height + 1)
	}

	// ctx.moveTo(0, 0)
	// ctx.lineTo(pixelWidth, 0)
	ctx.stroke()

	//绘制刻度标签
	ctx.textAlign = 'center'
	ctx.textBaseline = 'top'

	height = style.midLabel.y
	ctx.font = style.midLabel.font
	ctx.fillStyle = style.midLabel.color
	for (let item of midLabelList) {
		ctx.fillText(item.text, item.x, height)
	}

	height = style.upperLabel.y
	ctx.font = style.upperLabel.font
	ctx.fillStyle = style.upperLabel.color
	for (let item of upperLabelList) {
		ctx.fillText(item.text, item.x, height)
	}

	ctx.restore()
}
