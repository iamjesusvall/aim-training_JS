// Ecuation = ( x - h )^2 + ( y - k )^2 = r^2
// Math.pow(x-xc, 2) + Math.pow(y-yc, 2)) = (Math.pow(r, 2)

// DOM elements
const CANVAS = document.getElementById('canvas')
const HEIGHT = document.body.clientHeight - (document.body.clientHeight * 0.4)
const WIDTH = document.body.clientWidth - (document.body.clientWidth * 0.2)
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

// General settings
const BG_COLOR = '#3e3e3e'
let loop = null
let speed = 800
let total_targets = 25

// Target settings
let target = {
  x : 0,
  y : 0,
  color : '#ce1919',
  radius : 20,
  clicked : false
}

// stats
let targetCounter = 0
let hitted = 0
let missed = 0
let total = 0

// for draw the circle on the canvas
function drawCircle(x, y, color, radius) {
  CTX.fillStyle = color
  CTX.beginPath()
  CTX.arc(x, y, radius, 0, Math.PI * 2, true)
  CTX.fill()
  CTX.closePath()
}

// for set a random position and draw the circle
function generateRandomTarget () {
  target.x = Math.round( Math.random() * ( WIDTH - ( target.radius * 2 ) - 30 ) + target.radius + 30 )
  target.y = Math.round( Math.random() * ( HEIGHT - target.radius * 2 ) + target.radius )
  drawCircle(target.x, target.y, target.color, target.radius)
}


function clear() {
  CTX.fillStyle = BG_COLOR
  CTX.fillRect( 0, 0, WIDTH, HEIGHT )
}

function hitCircle(ev) {
  console.log(CANVAS)
  const clickX = ev.clientX - CANVAS.offsetLeft
  const clickY = ev.clientY - CANVAS.offsetTop
  console.log(`clickX : ${clickX}\nclickY : ${clickY}\ntargetX : ${target.x}\ntargetY : ${target.y}`)
  total++
  if ( (Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)) < Math.pow(target.radius, 2) ) {
    if (!target.clicked) {
      clear()
      hitted++
      target.clicked = true
    }
  } else {
    missed++
  }
}

function initLoop(ev) {
  ev.preventDefault()
  toggleMenu()
  loop = setInterval(() => {
    if(targetCounter < total_targets) {
      clear()
      target.clicked = false
      generateRandomTarget()
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
    target.clicked = false
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
  colorInput.value = target.color
  sizeInput.value = target.radius * 2
  targetsInput.value = total_targets
}

function setSpeed(ev) {
  speed = Number( speedInput.value )
}

function setSize(ev) {
  target.radius = Number( sizeInput.value ) / 2
}

function setColor(ev) {
  target.color = colorInput.value
}

function setTargets(ev) {
  total_targets = Number(targetsInput.value)
}

// Main function contains the events listener
function main() {
  clear()
  initSettings()

  // Menu events
  togglesbBtn.addEventListener('click', toggleMenu)
  speedInput.addEventListener('change', setSpeed)
  colorInput.addEventListener('change', setColor)
  sizeInput.addEventListener('change', setSize)
  targetsInput.addEventListener('change', setTargets)
  startBtn.addEventListener('click', initLoop)
  stopBtn.addEventListener('click', stopLoop)

  // Canvas events
  CANVAS.addEventListener('click', hitCircle)
  
}

document.onload = main()