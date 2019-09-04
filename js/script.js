// Ecuation = ( x - h )^2 + ( y - k )^2 = r^2
// Math.pow(x-xc, 2) + Math.pow(y-yc, 2)) = (Math.pow(r, 2)

// Canvas element
const CANVAS = document.getElementById('canvas')
const HEIGHT = document.body.clientHeight
const WIDTH = document.body.clientWidth
CANVAS.width = WIDTH
CANVAS.height = HEIGHT
const CTX = CANVAS.getContext('2d')

// Settings
const RADIUS = 20
const COLOR = '#ce1919'
const BG_COLOR = '#3e3e3e'

function clear() {
  CTX.fillStyle = BG_COLOR
  CTX.fillRect( 0, 0, WIDTH, HEIGHT )
}

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
  posx = Math.round( Math.random() * ( WIDTH - RADIUS * 2 ) + RADIUS )
  posy = Math.round( Math.random() * ( HEIGHT - RADIUS * 2 ) + RADIUS )
  drawCircle(posx, posy, COLOR, RADIUS)
}



function hitCircle(ev) {
  const clickX = ev.clientX
  const clickY = ev.clientY
  if ( (Math.pow(clickX - posx, 2) + Math.pow(clickY - posy, 2)) < Math.pow(RADIUS, 2) ) {
    clear()
  }
}

// Main function contains the events listener
function main() {

  clear()
  randomCircle()
  setInterval(() => {
    clear()
    randomCircle()
  }, 800);
  
  CANVAS.addEventListener('click', hitCircle)
}

document.onload = main()