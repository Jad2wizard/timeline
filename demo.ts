import Timeline from './src'

document.body.style.position = 'relative'

const tl = new Timeline({ parentElement: document.body })

tl.container.style.position = 'absolute'
tl.container.style.bottom = '0px'
tl.container.style.left = '0px'
