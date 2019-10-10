/* globals window */
(function () {
  var WATER_TOP_COLOR = "rgba(244,0,9,0.6";
  var WATER_BOTTOM_COLOR = "#F40009";

  var htmlCanvas = document.querySelector("canvas");
  var ctx = htmlCanvas.getContext('2d')
  var bottle = window.document.querySelector('.ccBottle');
  const bottles = Array.prototype.slice.call(window.document.querySelectorAll('.ccBottle'))  
  console.log(bottles)
  var container = document.querySelector(".container");

  var screenWidth;
  var screenHeight;

  var wave = {};
  var waveLength = 0;
  var wave2 = {};
  var wave3 = {};
  var waves = {};
  var bottleComputed;
  var bottlesComputed;

  var moveWavesId;
  var movebottleId;

  function value(x, width, numberOfWaves) {
    x = x * numberOfWaves / width * 2 * Math.PI;
    return Math.sin(x);
    
  }

  function multiplier(x, width) {
    var multiplierVar = 90;

    if (x <= width / 2) {
      return x * multiplierVar * 2 / width;
    }
    return width * multiplierVar / 2 / x;
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function draw() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    ctx.beginPath();
    ctx.moveTo(screenWidth, screenHeight);

    for (var x = waveLength - 1; x > 0; x--) {
      ctx.lineTo(x, waves[x])
    }
    
    var gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
    gradient.addColorStop(.5, WATER_TOP_COLOR);
    gradient.addColorStop(1, WATER_BOTTOM_COLOR);
    ctx.fillStyle = gradient;
    ctx.lineTo(0, screenHeight);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  function movebottle() {
    for(const [value, index] of [bottles]){
      
    }
    var y1 = waves[bottleComputed.left];
    var y2 = waves[bottleComputed.left + 1];

    bottleComputed.angle = -Math.atan(y1 - y2) + 'rad';
    bottleComputed.top = y1;
    bottleComputed.left +=1;
    if (bottleComputed.left > screenWidth - 1) {
      bottleComputed.left = -10;
    }

    bottle.style.transform = 'rotate(' + bottleComputed.angle + ')';
    bottle.style.left = bottleComputed.left - (screenWidth * bottleComputed.widthScreenWidthPercent / 2) + 'px';
    bottle.style.top = bottleComputed.top - (screenWidth * bottleComputed.widthScreenWidthPercent) + 'px';
  }

  function initializeWaves() {
    var randomWaves1 = randomIntFromInterval(4, 5);
    var randomWaves2 = randomIntFromInterval(2, 3);
    var randomWaves3 = randomIntFromInterval(6, 7);

    for (var x = 0; x < screenWidth; x++) {
      wave[x] = value(x, screenWidth, randomWaves1) * multiplier(x, screenWidth) / 4;
      wave2[x] = value(x, screenWidth, randomWaves2) * multiplier(x * 3, screenWidth) / 6;
      wave3[x] = value(x, screenWidth, randomWaves3);
    }
    waveLength = Object.keys(wave).length;
  }

  function moveWaves() {
    if (!waveLength) {
      initializeWaves();
    }

    for (var x = waveLength - 1; x >= 0; x--) {
      if (x === 0) {
        wave2[x] = wave2[waveLength - 1];
        wave3[x] = wave3[waveLength - 1];
      } else {
        wave2[x] = wave2[x - 1];
        wave3[x] = wave3[x - 1];
      }

      waves[x] = wave[x] + wave2[x] + wave3[x] + screenHeight / 2;
    }
  }

  function startLoop() {
    clearInterval(moveWavesId);
    moveWavesId = setInterval(moveWaves, 8000 / screenWidth);

    clearInterval(movebottleId);
    movebottleId = setInterval(movebottle, 10000 / screenWidth);
  }

  function recalculateCanvas() {
    var containerInfo = container.getBoundingClientRect();
    screenWidth = containerInfo.width;
    screenHeight = containerInfo.height;
    htmlCanvas.width = screenWidth;
    htmlCanvas.height = screenHeight;

    wave = {};
    wave2 = {};
    wave3 = {};
    waveLength = 0;
    waves = {};

    bottleComputed = {
      top: screenHeight / 2,
      left: -10,
      widthScreenWidthPercent: 0.07,
    };

    startLoop();
  }

  window.addEventListener('resize', recalculateCanvas);
  window.addEventListener('orientationchange', recalculateCanvas);
  window.removeEventListener("unload", recalculateCanvas);

  recalculateCanvas();
  requestAnimationFrame(draw);
}());
