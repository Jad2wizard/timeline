import * as moment from 'moment'
import Timeline from './src'

document.body.style.position = 'relative'

const tl = new Timeline({
	parentElement: document.body,
	onCurrentTimeChange: (t) => {
		console.log(moment(t).format('YYYY-MM-DD HH:mm:ss'))
	},
	onStatusChange: (isPlaying) => {
		console.log(isPlaying)
	},
})

tl.container.style.position = 'absolute'
tl.container.style.bottom = '0px'
tl.container.style.left = '0px'

tl.setTimeRange(moment().subtract(3, 'year').valueOf(), moment().add(5, 'year').valueOf())
tl.setTimeUnit('second')
tl.setCurrentTime(moment().valueOf())

//@ts-ignore
window.tl = tl
