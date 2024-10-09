import * as moment from 'moment'

type Moment = moment.Moment

const isLeapYear = (time: Moment) => {
	const year = time.year()
	if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
		return 366
	}
	return 365
}

export const levelMap = {
	year: {
		minGap: 36,
		tickGap: 40,
		maxGap: 48,
		shouldDrawMidLabel: () => true,
		shouldDrawHighLabel: () => false,
		getOneTickTime: (time: Moment) => 1000 * 60 * 60 * 24 * isLeapYear(time), //28 29 31
		setUplabel: (time: Moment) => time.format('YYYY年'),
		setMidlabel: (time: Moment) => time.format('YYYY年'),
	},
	month: {
		minGap: 32, //刻度之间的最小距离
		tickGap: 40, //刻度之间的默认距离
		maxGap: 48, //刻度之间的最大距离
		shouldDrawMidLabel: () => true,
		shouldDrawHighLabel: (time: Moment) => time.month() === 0,
		getOneTickTime: (time: Moment) => 1000 * 60 * 60 * 24 * time.daysInMonth(),
		setUplabel: (time: Moment) => time.format('YYYY年'), //刻度格式
		setMidlabel: (time: Moment) => time.format('MM月'), //刻度格式
	},

	day: {
		minGap: 16,
		tickGap: 24,
		maxGap: 32,
		shouldDrawMidLabel: () => true,
		shouldDrawHighLabel: (time: Moment) => time.date() === 1,
		getOneTickTime: (time: Moment) => 1000 * 60 * 60 * 24,
		setUplabel: (time: Moment) => time.format('YYYY-MM'),
		setMidlabel: (time: Moment) => time.format('DD'),
	},
	hour: {
		minGap: 16,
		tickGap: 24,
		maxGap: 32,
		shouldDrawMidLabel: (time: Moment) => time.hours() % 6 === 0,
		shouldDrawHighLabel: (time: Moment) => time.hours() === 0,
		getOneTickTime: (time: Moment) => 1000 * 60 * 60,
		setUplabel: (time: Moment) => time.format('YYYY-MM-DD'),
		setMidlabel: (time: Moment) => time.format('HH:00:00'),
	},
	minute: {
		minGap: 8,
		tickGap: 16,
		maxGap: 24,
		shouldDrawMidLabel: (time: Moment) => time.minutes() % 10 === 0,
		shouldDrawHighLabel: (time: Moment) => time.minutes() === 0,
		getOneTickTime: (time: Moment) => 1000 * 60,
		setUplabel: (time: Moment) => time.format('YYYY-MM-DD'),
		setMidlabel: (time: Moment) => time.format('HH:mm:00'),
	},
	second: {
		minGap: 8,
		tickGap: 16,
		maxGap: 24,
		shouldDrawMidLabel: (time: Moment) => time.seconds() % 10 === 0,
		shouldDrawHighLabel: (time: Moment) => time.seconds() === 0,
		getOneTickTime: (time: Moment) => 1000,
		setUplabel: (time: Moment) => time.format('YYYY-MM-DD'),
		setMidlabel: (time: Moment) => time.format('HH:mm:ss'),
	},
}

export type LevelKey = keyof typeof levelMap

export const containerHeight = 90
export const topPadding = 10
export const bottomPadding = 10
export const rightPadding = 20
export const leftZoneWidth = 100
export const playBtnRadius = 16

export const timeScaleList = [0.25, 0.5, 0.75, 1, 2, 5, 10, 20, 50, 100]

export const startX = 8 //绘图的起点
export const dist = 0 //刻度线离进度条的距离
export const levelKeys = Object.keys(levelMap)
export const tickZoneHeight = 36
