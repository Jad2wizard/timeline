import * as moment from 'moment'

const isLeapYear = (time: number) => {
	const year = moment(time).year()
	if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
		return 366
	}
	return 365
}

export const levelMap = {
	year: {
		minGap: 32,
		tickGap: 40,
		maxGap: 48,
		playSpeed: 60, //动画1秒执行60次，若为60则一秒动一个gap
		gettickNum: (time: number) => 1 /*一年 */,
		getOneTickTime: (time: number) => 1000 * 60 * 60 * 24 * isLeapYear(time), //28 29 31
		setTickNum: (time: number) => 1,
		setUplabel: (time: number) => moment(time).format('YYYY年'),
		setMidlabel: (time: number) => moment(time).format('YYYY年'),
		setPointerLabel: (time: number) => moment(time).format('YYYY年'),
	},
	month: {
		minGap: 32, //刻度之间的最小距离
		tickGap: 40, //刻度之间的默认距离
		maxGap: 48, //刻度之间的最大距离
		playSpeed: 60, //动画1秒执行60次，若为60则一秒动一个gap
		gettickNum: (time: number) => 12 /*一年12个月 */,
		getOneTickTime: (time: number) => 1000 * 60 * 60 * 24 * moment(time).daysInMonth(),
		setTickNum: (time: number) => time / 1000 / 60 / 60 / 24 / moment(time).daysInMonth(),
		setUplabel: (time: number) => moment(time).format('YYYY年'), //刻度格式
		setMidlabel: (time: number) => moment(time).format('MM月'), //刻度格式
		setPointerLabel: (time: number) => moment(time).format('YYYY-MM'), //label格式
	},

	day: {
		minGap: 16,
		tickGap: 24,
		maxGap: 32,
		playSpeed: 60,
		gettickNum: (time: number) => moment(time).daysInMonth() /*每个月的天数 */,
		getOneTickTime: (time: number) => 1000 * 60 * 60 * 24,
		setTickNum: (time: number) => Math.floor(time / 1000 / 60 / 60 / 24) + 1,
		setUplabel: (time: number) => moment(time).format('YYYY-MM'),
		setMidlabel: (time: number) => moment(time).format('DD'),
		setPointerLabel: (time: number) => moment(time).format('YYYY-MM-DD'),
	},
	hour: {
		minGap: 16,
		tickGap: 24,
		maxGap: 32,
		playSpeed: 60,
		gettickNum: (time: number) => 24,
		getOneTickTime: (time: number) => 1000 * 60 * 60,
		setTickNum: (time: number) => Math.floor(time / 1000 / 60 / 60) + 1,
		setUplabel: (time: number) => moment(time).format('YYYY-MM-DD'),
		setMidlabel: (time: number) => moment(time).format('HH:00:00'),
		setPointerLabel: (time: number) => moment(time).format('YYYY-MM-DD HH:00'),
	},
	minute: {
		minGap: 8,
		tickGap: 16,
		maxGap: 24,
		playSpeed: 60,
		gettickNum: (time: number) => 60,
		getOneTickTime: (time: number) => 1000 * 60,
		setTickNum: (time: number) => Math.floor(time / 1000 / 60) + 1,
		setUplabel: (time: number) => moment(time).format('YYYY-MM-DD'),
		setMidlabel: (time: number) => moment(time).format('HH:mm:00'),
		setPointerLabel: (time: number) => moment(time).format('YYYY-MM-DD HH:mm'),
	},
	second: {
		minGap: 8,
		tickGap: 16,
		maxGap: 24,
		playSpeed: 60,
		gettickNum: (time: number) => 60,
		getOneTickTime: (time: number) => 1000,
		setTickNum: (time: number) => Math.floor(time / 1000) + 1,
		setUplabel: (time: number) => moment(time).format('YYYY-MM-DD'),
		setMidlabel: (time: number) => moment(time).format('HH:mm:ss'),
		setPointerLabel: (time: number) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
	},
}

export type LimitMapKey = keyof typeof levelMap

export const containerHeight = 80
export const topPadding = 10
export const bottomPadding = 10
export const leftZoneWidth = 100
export const playBtnRadius = 16

export const timeScaleList = [0.25, 0.5, 0.75, 1, 2, 5, 10, 20, 50]

const startX = 8 //绘图的起点
const dist = 0 //刻度线离进度条的距离
const lowLabel = 14 //段刻度线的长度
const highLabel = 26 //长刻度线的长度
const timeCanvasWidth = 110 //显示起始时间的canvas大小
const timeCanvasHeight = 32 //时间轴画布的Height
const limitKeys = Object.keys(levelMap)
const canvasStyle = {
	canvasHeight: 36,
	pointerColor: '#A25A53',
	labelColor: 'rgba(255,255,255,0.7)',
	labelFont: '10px "MicrosoftYaHeiUI"',
	lineColor: 'white',
	lineWidth: 1.5,
	lowTickHeight: 4,
	highTickHeight: 8,
}
