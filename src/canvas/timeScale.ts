import { DeepRequired } from 'utility-types'
import { Style } from '../style'
import { containerHeight, leftZoneWidth, playBtnRadius, topPadding, bottomPadding } from '../constants'

const height = 16
const textTriangleGap = 12
const triangleGap = 4

export const drawTimeScale = (ctx: CanvasRenderingContext2D, style: DeepRequired<Style>['timeScale'], scale = 1) => {
	if (!style.show) return
	ctx.save()
	ctx.translate(leftZoneWidth / 2, containerHeight - bottomPadding - height / 2)
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillStyle = style.label.color
	ctx.font = style.label.font
	ctx.fillText(scale + 'x', 0, 0)

	const textWidth = ctx.measureText(scale + 'x').width
	const firstTriangleX = textWidth / 2 + textTriangleGap
	let y = height / 2
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

	y *= 0.9
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

	ctx.stroke()
}
