const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide'))

let isDragging = false, // Is mouse clicked/finger on device; only for browser hovers
  startPos = 0, // first click poistion
  currentTranslate = 0, // translateX value 
  prevTranslate = 0,
  animationID = 0, // id for canceling request frame  
  currentIndex = 0 // current slide

slides.forEach((slide, index) => {
  // Prevent default image selection upon hover
  slide.addEventListener('dragstart', (e) => e.preventDefault())

  // Touch events for mobile devices
  slide.addEventListener('touchstart', touchStart(index))
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)

  // Mouse events for browser
  slide.addEventListener('mousedown', touchStart(index))
  slide.addEventListener('mouseup', touchEnd)
  slide.addEventListener('mouseleave', touchEnd)
  slide.addEventListener('mousemove', touchMove)
})

// Disable context menu
window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

// Finger on device
function touchStart(index) {
  return function (event) {
    currentIndex = index
    startPos = getPositionX(event)
    isDragging = true

    // https://css-tricks.com/using-requestanimationframe/
    // Better performance than set-interval 
    animationID = requestAnimationFrame(animation)
  }
}

// Finger Removed
function touchEnd() {
  isDragging = false
  cancelAnimationFrame(animationID)

  // Snap in next slide after certain movement 
  const movedBy = currentTranslate - prevTranslate
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1

  setPositionByIndex()
}

// Finger moved on device
function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event)
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}

function getPositionX(event) {
  // Different fetch based on browser vs mobile
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
  setSliderPosition()
  if (isDragging) requestAnimationFrame(animation)
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth
  prevTranslate = currentTranslate
  setSliderPosition()
}
