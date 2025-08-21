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

	//绘制刻度轴最左侧指向当前时间的指示器（垂直线+上下三角形）
	// 绘制垂直指示线
	ctx.beginPath()
	ctx.moveTo(startX, 0)
	ctx.lineTo(startX, tickZoneHeight)
	ctx.strokeStyle = style.pointerColor
	ctx.lineWidth = 2
	ctx.stroke()

	// 绘制底部小三角形
	ctx.beginPath()
	ctx.moveTo(startX - 4, tickZoneHeight - 2)
	ctx.lineTo(startX + 4, tickZoneHeight - 2)
	ctx.lineTo(startX, tickZoneHeight - 8)
	ctx.closePath()
	ctx.fillStyle = style.pointerColor
	ctx.fill()

	//确定 lowerTick 和 upperTick 的位置
	const lowerTickXList: number[] = []
	const upperTickXList: number[] = []
	const midLabelList: { x: number; text: string }[] = []
	const upperLabelList: { x: number; text: string }[] = []
	const level = levelMap[currentLevel]
	const uplabelWidth = level.getUplabelWidth(ctx)
	const midLabelWidth = level.getMidlabelWidth(ctx)
	tickGap = Math.min(Math.max(tickGap, level.minGap), level.maxGap)

	// 计算当前时间在时间单位内的偏移量，实现平滑移动
	const unitDuration = typeof level.duration === 'function' ? level.duration(currentTime) : level.duration
	const timeOffset = currentTime.diff(currentTime.clone().startOf(currentLevel)) / 1000 / unitDuration
	const pixelTimeOffset = timeOffset * tickGap

	// 从当前时间向前回退到最近的整数时间单位
	let time = currentTime.clone().startOf(currentLevel)
	let pixelOffset = startX - pixelTimeOffset

	// 向左扩展，确保覆盖可见区域
	while (pixelOffset > -tickGap) {
		pixelOffset -= tickGap
		time.subtract(1, currentLevel)
	}

	let count = 0
	while (pixelOffset < pixelWidth) {
		if (pixelOffset >= 0) {
			// 只绘制可见区域内的刻度
			if (level.shouldDrawHighLabel(time)) {
				if (pixelOffset > uplabelWidth / 2)
					upperLabelList.push({ x: pixelOffset, text: level.getUplabel(time) })
				if (pixelOffset > midLabelWidth / 2)
					midLabelList.push({ x: pixelOffset, text: level.getMidlabel(time) })
				upperTickXList.push(pixelOffset)
			} else if (level.shouldDrawMidLabel(time)) {
				if (pixelOffset > midLabelWidth / 2)
					midLabelList.push({ x: pixelOffset, text: level.getMidlabel(time) })
				upperTickXList.push(pixelOffset)
			} else {
				lowerTickXList.push(pixelOffset)
			}
		}
		count++
		pixelOffset += tickGap
		time.add(1, currentLevel)
	}

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
