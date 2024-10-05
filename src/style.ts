import { DeepRequired } from 'utility-types'

type FontStyle = {
	font?: string
	color?: string
}

type LineStyle = {
	color?: string
	lineWidth?: number
	length?: number
}

export type Style = {
	background?: string
	pointerColor?: string
	startTimeLabel?: FontStyle
	endTimeLabel?: FontStyle
	lowerLabel?: FontStyle
	upperLabel?: FontStyle
	lowerTick?: LineStyle
	upperTick?: LineStyle
	currentTime?: {
		show?: boolean
		label?: FontStyle
	}
	playBtn?: {
		color?: string
		lineWidth?: number
	}
	timeScale?: {
		show?: boolean
		label?: FontStyle
	}
	progress?: {
		show?: boolean
		pointerSize?: number
		pointerColor?: string
		pointerBorderWidth?: number
		pointerBorderColor?: string
		trackWidth?: number
		trackeColor?: string
		barColor?: string
		label?: FontStyle
	}
}

export const defaultStyle: DeepRequired<Style> = {
	background: '#333',
	pointerColor: '#A25A53',
	startTimeLabel: {
		color: 'rgba(255, 255, 255, 0.9)',
		font: '12px MicrosoftYaHeiUI',
	},
	endTimeLabel: {
		color: 'rgba(255, 255, 255, 0.9)',
		font: '12px MicrosoftYaHeiUI',
	},
	upperLabel: {
		color: 'rgba(255, 255, 255, 0.7)',
		font: '12px MicrosoftYaHeiUI',
	},
	lowerLabel: {
		color: 'rgba(255, 255, 255, 0.7)',
		font: '12px MicrosoftYaHeiUI',
	},
	lowerTick: {
		color: 'rgba(255, 255, 255, 1)',
		lineWidth: 1.5,
		length: 4,
	},
	upperTick: {
		color: 'rgba(255, 255, 255, 1)',
		lineWidth: 1.5,
		length: 8,
	},
	currentTime: {
		show: true,
		label: {
			color: 'rgba(255, 255, 255, 0.9)',
			font: '14px MicrosoftYaHeiUI',
		},
	},
	playBtn: {
		color: 'rgba(255, 255, 255, 0.7)',
		lineWidth: 2,
	},
	timeScale: {
		show: true,
		label: {
			color: 'rgba(255, 255, 255, 0.9)',
			font: '14px MicrosoftYaHeiUI',
		},
	},
	progress: {
		show: true,
		pointerSize: 15,
		pointerColor: 'rgba(255, 255, 255, 1)',
		pointerBorderWidth: 1,
		pointerBorderColor: '#333',
		trackWidth: 10,
		trackeColor: 'rgba(245, 124, 1, 1)',
		barColor: '',
		label: {
			color: 'rgba(255, 255, 255, 1)',
			font: '12px MicrosoftYaHeiUI',
		},
	},
}