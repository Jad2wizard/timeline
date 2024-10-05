import { DeepRequired } from 'utility-types'
import { Style } from '../style'
import { leftZoneWidth, playBtnRadius, topPadding } from '../constants'

export const clearPlayBtn = (ctx: CanvasRenderingContext2D) => {
	const playBtnPos = { x: leftZoneWidth / 2 - playBtnRadius, y: topPadding, r: playBtnRadius }
	const { x, y, r } = playBtnPos
	ctx.clearRect(x, y, r * 2 + x, r * 2 + y)
}

export const drawPlayBtn = (ctx: CanvasRenderingContext2D, style: DeepRequired<Style>['playBtn'], isPause = true) => {
	const playBtnPos = { x: leftZoneWidth / 2 - playBtnRadius, y: topPadding, r: playBtnRadius }
	clearPlayBtn(ctx)
	ctx.save()
	ctx.translate(playBtnPos.x + playBtnPos.r, playBtnPos.y + playBtnPos.r)
	console.log(style)
	const color = style.color
	const lineWidth = style.lineWidth
	ctx.beginPath()
	ctx.arc(0, 0, playBtnPos.r, 0, 2 * Math.PI)
	const r = playBtnPos.r * 0.75
	if (isPause) {
		ctx.moveTo(-r / 2, -r * Math.sin(Math.PI / 3))
		ctx.lineTo(-r / 2, r * Math.sin(Math.PI / 3))
		ctx.lineTo(r, 0)
		ctx.lineTo(-r / 2, -r * Math.sin(Math.PI / 3))
	} else {
		const x1 = r / 2 + 1.5
		const x2 = r / 2 - 1.5
		const y = r * 0.6
		ctx.moveTo(-x1, -y)
		ctx.lineTo(-x2, -y)
		ctx.lineTo(-x2, y)
		ctx.lineTo(-x1, y)
		ctx.lineTo(-x1, -y)

		ctx.moveTo(x1, -y)
		ctx.lineTo(x2, -y)
		ctx.lineTo(x2, y)
		ctx.lineTo(x1, y)
		ctx.lineTo(x1, -y)
	}
	ctx.strokeStyle = color
	ctx.lineWidth = lineWidth
	ctx.stroke()
	ctx.restore()
}

export const isMouseInPlayBtn = (x: number, y: number) => {
	const playBtnPos = { x: leftZoneWidth / 2 - playBtnRadius, y: topPadding, r: playBtnRadius }
	return (
		Math.pow(x - playBtnPos.x - playBtnPos.r, 2) + Math.pow(y - playBtnPos.y - playBtnPos.r, 2) <=
		Math.pow(playBtnPos.r, 2)
	)
}