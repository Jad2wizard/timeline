# jad-timeline

A flexible timeline component for frontend applications, featuring adjustable time scales that range from seconds, minutes, and hours to days, months, and years

## Installation

```bash
npm install jad-timeline
```

## Usage

```ts
import * as moment from 'moment'
import Timeline from 'jad-timeline'

document.body.style.position = 'relative'

const tl = new Timeline({ parentElement: document.body })

tl.container.style.position = 'absolute'
tl.container.style.bottom = '0px'
tl.container.style.left = '0px'

tl.setTimeRange(moment().subtract(3, 'year').valueOf(), moment().add(5, 'year').valueOf())
tl.setTimeUnit('day')
tl.setCurrentTime(moment().valueOf())

tl.play()
tl.pause()
```

## UI

1. Change the timeline's scale unit by scrolling the mouse wheel
2. Adjust the current time by dragging the timeline scale area with the mouse
3. Modify the total playback progress by dragging the dot on the progress bar
