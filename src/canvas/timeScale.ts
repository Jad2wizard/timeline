import { RequiredStyle } from '../style'
import { leftZoneWidth, bottomPadding } from '../constants'

const height = 20
const textTriangleGap = 10
const triangleGap = 4

export const clearTimeScale = (ctx: CanvasRenderingContext2D) => {
	const containerHeight = ctx.canvas.height
	ctx.clearRect(0, containerHeight - bottomPadding - height, leftZoneWidth, containerHeight - bottomPadding)
}

export const mouseInTimeScale = (ctx: CanvasRenderingContext2D, scale: number, x: number, y: number) => {
	const containerHeight = ctx.canvas.height
	x -= leftZoneWidth / 2
	y -= containerHeight - bottomPadding - height / 2
	const textWidth = ctx.measureText(scale + 'x').width
	const firstTriangleH = height * 0.3
	const firstTriangleW = firstTriangleH * 0.75
	const secondTriangleH = firstTriangleH * 0.8
	const secondTriangleW = secondTriangleH * 0.75
	const sx = textWidth / 2 + textTriangleGap
	const ex = sx + firstTriangleW + triangleGap + secondTriangleW
	if (y < -firstTriangleH || y > firstTriangleH) return
	if (x > -sx && x < sx) return
	if (x > sx && x < ex) return 'up'
	if (x > -ex && x < -sx) return 'down'
	return
}

export const drawTimeScale = (ctx: CanvasRenderingContext2D, style: RequiredStyle['timeScale'], scale = 1) => {
	if (!style.show) return
	clearTimeScale(ctx)
	const containerHeight = ctx.canvas.height
	ctx.save()
	ctx.translate(leftZoneWidth / 2, containerHeight - bottomPadding - height / 2)
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillStyle = style.label.color
	ctx.font = style.label.font
	ctx.fillText(scale + 'x', 0, 0)

	const textWidth = ctx.measureText(scale + 'x').width
	const firstTriangleX = textWidth / 2 + textTriangleGap
	let y = height * 0.3
	let triangleW = y * 0.75
	const secondTriangleX = firstTriangleX + triangleW + triangleGap
	ctx.strokeStyle = style.label.color
	ctx.beginPath()
	ctx.moveTo(firstTriangleX, 0)
	ctx.lineTo(firstTriangleX, y)
	ctx.lineTo(firstTriangleX + triangleW, 0)
	ctx.lineTo(firstTriangleX, -y)
	ctx.lineTo(firstTriangleX, 0)

	ctx.moveTo(-firstTriangleX, 0)
	ctx.lineTo(-firstTriangleX, y)
	ctx.lineTo(-firstTriangleX - triangleW, 0)
	ctx.lineTo(-firstTriangleX, -y)
	ctx.lineTo(-firstTriangleX, 0)

	y *= 0.8
	triangleW = y * 0.75
	ctx.moveTo(secondTriangleX, 0)
	ctx.lineTo(secondTriangleX, y)
	ctx.lineTo(secondTriangleX + triangleW, 0)
	ctx.lineTo(secondTriangleX, -y)
	ctx.lineTo(secondTriangleX, 0)

	ctx.moveTo(-secondTriangleX, 0)
	ctx.lineTo(-secondTriangleX, y)
	ctx.lineTo(-secondTriangleX - triangleW, 0)
	ctx.lineTo(-secondTriangleX, -y)
	ctx.lineTo(-secondTriangleX, 0)

	ctx.closePath()

	ctx.stroke()

	ctx.restore()
}
