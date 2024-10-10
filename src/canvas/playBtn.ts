import { RequiredStyle } from '../style'
import { leftZoneWidth, playBtnRadius, topPadding } from '../constants'

export const clearPlayBtn = (ctx: CanvasRenderingContext2D) => {
	const playBtnPos = { x: leftZoneWidth / 2 - playBtnRadius, y: topPadding, r: playBtnRadius }
	const { x, y, r } = playBtnPos
	ctx.clearRect(x - 1, y - 1, r * 2 + x + 1, r * 2 + y + 1)
}

export const drawPlayBtn = (ctx: CanvasRenderingContext2D, style: RequiredStyle['playBtn'], isPause = true) => {
	const playBtnPos = { x: leftZoneWidth / 2 - playBtnRadius, y: topPadding, r: playBtnRadius }
	clearPlayBtn(ctx)
	ctx.save()
	ctx.translate(playBtnPos.x + playBtnPos.r, playBtnPos.y + playBtnPos.r)
	const color = style.color
	const lineWidth = style.lineWidth
	ctx.beginPath()
	ctx.arc(0, 0, playBtnPos.r, 0, 2 * Math.PI)
	const r = playBtnPos.r * 0.6
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
	ctx.closePath()
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(0, 0, playBtnPos.r, 0, 2 * Math.PI)
	ctx.closePath()
	const gradient = ctx.createRadialGradient(0, 0, playBtnPos.r * 0.75, 0, 0, playBtnPos.r * 1)
	gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
	gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)')
	ctx.fillStyle = gradient
	ctx.fill()
	ctx.restore()
}

export const mouseInPlayBtn = (x: number, y: number) => {
	const playBtnPos = { x: leftZoneWidth / 2 - playBtnRadius, y: topPadding, r: playBtnRadius }
	return (
		Math.pow(x - playBtnPos.x - playBtnPos.r, 2) + Math.pow(y - playBtnPos.y - playBtnPos.r, 2) <=
		Math.pow(playBtnPos.r, 2)
	)
}
