// Ecuation = ( x - h )^2 + ( y - k )^2 = r^2
// Math.pow(x-xc, 2) + Math.pow(y-yc, 2)) = (Math.pow(r, 2)

// DOM elements
const CANVAS = document.getElementById('canvas')
const HEIGHT = document.body.clientHeight
const WIDTH = document.body.clientWidth
CANVAS.width = WIDTH
CANVAS.height = HEIGHT
const CTX = CANVAS.getContext('2d')
const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
const togglesbBtn = document.getElementById('toggle-sb')
const formSettings = document.getElementById('settings')
const speedInput = document.getElementById('speed-input')
const colorInput = document.getElementById('color-input')
const sizeInput = document.getElementById('size-input')
const targetsInput = document.getElementById('targets-input')

// Settings
let radius = 20
let color = '#ce1919'
const BG_COLOR = '#3e3e3e'
let loop = null
let speed = 800
let target = 25
let targetCounter = 0

// stats
let hitted = 0
let missed = 0
let total = 0

// Circle position
let posx = 0
let posy = 0

// for draw the circle on the canvas
function drawCircle(x, y, color, radius) {
  CTX.fillStyle = color
  CTX.beginPath()
  CTX.arc(x, y, radius, 0, Math.PI * 2, true)
  CTX.fill()
  CTX.closePath()
}

// for set a random position and draw the circle
function randomCircle () {
  posx = Math.round( Math.random() * ( WIDTH - ( radius * 2 ) - 30 )  + radius + 30 )
  posy = Math.round( Math.random() * ( HEIGHT - radius * 2 ) + radius )
  drawCircle(posx, posy, color, radius)
}


function clear() {
  CTX.fillStyle = BG_COLOR
  CTX.fillRect( 0, 0, WIDTH, HEIGHT )
}

function hitCircle(ev) {
  const clickX = ev.clientX
  const clickY = ev.clientY
  total++
  if ( (Math.pow(clickX - posx, 2) + Math.pow(clickY - posy, 2)) < Math.pow(radius, 2) ) {
    clear()
    hitted++
  } else {
    missed++
  }
}

function initLoop(ev) {
  ev.preventDefault()
  toggleMenu()
  loop = setInterval(() => {
    if(targetCounter < target) {
      clear()
      randomCircle()
      targetCounter++
    } else {
      stopLoop(ev)
    }
  }, speed);
}

function stopLoop(ev) {
  ev.preventDefault()
  if (loop) {
    clearInterval(loop)
    clear()
    targetCounter = 0
    console.log(`hitted: ${hitted}, missed: ${missed}\nAccuraccy: ${(hitted * 100) / total}%`)
    hitted = 0
    missed = 0
    total = 0
  }
}

function toggleMenu(ev) {
  if(!formSettings.classList.contains('d-none')) {
    formSettings.classList.add('d-none')
  } else {
    formSettings.classList.remove('d-none')
  }
}

function initSettings() {
  speedInput.value = speed
  colorInput.value = color
  sizeInput.value = radius * 2
  targetsInput.value = target
}

function setSpeed(ev) {
  speed = Number( speedInput.value )
}

function setSize(ev) {
  radius = Number( sizeInput.value ) / 2
}

function setColor(ev) {
  color = colorInput.value
}

function setTargets(ev) {
  target = Number(targetsInput.value)
}

// Main function contains the events listener
function main() {
  clear()
  initSettings()

  togglesbBtn.addEventListener('click', toggleMenu)
  speedInput.addEventListener('change', setSpeed)
  colorInput.addEventListener('change', setColor)
  sizeInput.addEventListener('change', setSize)
  targetsInput.addEventListener('change', setTargets)
  startBtn.addEventListener('click', initLoop)
  stopBtn.addEventListener('click', stopLoop)
  CANVAS.addEventListener('click', hitCircle)
  
}

document.onload = main()