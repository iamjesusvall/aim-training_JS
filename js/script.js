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
const delayInput = document.getElementById('delay-input')
const durationInput = document.getElementById('duration-input')
const colorInput = document.getElementById('color-input')
const sizeInput = document.getElementById('size-input')
const targetsInput = document.getElementById('targets-input')

// General settings
const BG_COLOR = '#232931'
let loop = null
let durationTO = null
let delayTO = null
let total_targets = 25

// Target settings
// |----------Target life----------|
// |----Delay----||----Duration----|
let target = {
  x : 0,
  y : 0,
  color : '#4ecca3',
  radius : 20,
  clicked : false,
  delay: 500,
  duration: 750
}

// Statistics
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
  const clickX = ev.clientX - CANVAS.offsetLeft
  const clickY = ev.clientY - CANVAS.offsetTop
  
  // console.log(`clickX : ${clickX}\nclickY : ${clickY}\ntargetX : ${target.x}\ntargetY : ${target.y}`)
  total++
  if(loop) {
    if ( (Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)) < Math.pow(target.radius, 2) ) {
      if (!target.clicked) {
        target.clicked = true
        clear()
        drawCircle( clickX, clickY, '#0f0', 2 )
        hitted++
        clearTimeout(delayTO)
        clearTimeout(durationTO)
        window.cancelAnimationFrame(loop)
        mainloop()
      }
    } else {
      drawCircle( clickX, clickY, '#f00', 2 )
      missed++
    }
  }
}

function mainloop() {
  if(targetCounter >= total_targets) {
    stopLoop()
  } else {
    delayTO = setTimeout(() => {
      // console.log(`Delay: ${target.delay}`)
      loop = window.requestAnimationFrame(() => {

          clear()
          target.clicked = false
          generateRandomTarget()
          targetCounter++
          durationTO = setTimeout(() => {
            // console.log(`Duration: ${target.duration}`)
            clear()
            mainloop()
          }, target.duration)

      })
    }, target.delay)
  }
  
}

function initLoop(ev) {
  ev.preventDefault()
  if (!formSettings.classList.contains('d-none')) {
    toggleMenu()
  }
  if (!loop) {
    mainloop()
  }

}


function stopLoop(ev = null) {

  if (ev) {
    ev.preventDefault()
  }
  if (loop) {
    clearTimeout(delayTO)
    clearTimeout(durationTO)
    window.cancelAnimationFrame(loop)
    clear()
    target.clicked = false
    targetCounter = 0
    console.log(`hitted: ${hitted}, missed: ${missed}\nAccuraccy: ${hitted * 100 / total}%`)
    swal.fire({
      title: 'Results',
      html: `<p class="mt-3 mb-2">Hitted: <strong class="text-success">${hitted}</strong></p>
      <p class="mb-3">Missed: <strong class="text-danger">${missed}</strong></p>`,
      confirmButtonColor: '#5cb85c',
      allowOutsideClick: false
    })
    hitted = 0
    missed = 0
    total = 0
    loop = null
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
  delayInput.value = target.delay
  durationInput.value = target.duration
  colorInput.value = target.color
  sizeInput.value = target.radius * 2
  targetsInput.value = total_targets
}

function setDelay(ev) {
  target.delay = Number( delayInput.value )
}

function setDuration(ev) {
  target.duration = Number( durationInput.value )
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
  delayInput.addEventListener('change', setDelay)
  durationInput.addEventListener('change', setDuration)
  colorInput.addEventListener('change', setColor)
  sizeInput.addEventListener('change', setSize)
  targetsInput.addEventListener('change', setTargets)
  startBtn.addEventListener('click', initLoop)
  stopBtn.addEventListener('click', stopLoop)
  window.addEventListener('keyup', (ev) => {

    if (Number(ev.keyCode) === 32) {
      initLoop(ev);
    }
  })
  window.addEventListener('keyup', (ev) => {

    if (Number(ev.keyCode) === 27) {
      stopLoop(ev);
    }
  })

  // Canvas events
  CANVAS.addEventListener('click', hitCircle)
  
}

document.onload = main()