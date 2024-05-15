document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    if (candles.length >= 20) {
      return; // Don't add more than 20 candles
    }

    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;

    // Ensure the candle is placed only on the top layer of the cake
    const icingRect = document.querySelector(".layer-top").getBoundingClientRect();
    const icingLeft = icingRect.left - rect.left + 30;
    const icingTop = icingRect.top - rect.top;
    const icingWidth = icingRect.width - 60;
    const icingHeight = icingRect.height - 30;

    // Ensure the candle is not placed on the drips
    const drip1Rect = document.querySelector(".drip1").getBoundingClientRect();
    const drip2Rect = document.querySelector(".drip2").getBoundingClientRect();
    const drip3Rect = document.querySelector(".drip3").getBoundingClientRect();


    if (
      left >= icingLeft &&
      left <= icingLeft + icingWidth &&
      top >= icingTop &&
      top <= icingTop + icingHeight
    ) {
      addCandle(left, top);
    }
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; //
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
        candles.forEach((candle) => {
            if (!candle.classList.contains("out") && Math.random() > 0.5) {
                candle.classList.add("out");
                blownOut++;
            }
        });
    }

    if (blownOut > 0) {
        updateCandleCount();
        if (candles.every(candle => candle.classList.contains("out"))) {
            // All candles have been blown out, so play the blast sound
            blast();
            startConfetti();
            displayTextAfterConfetti();
        }
    }
}


  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

function blast() {
  var audio = new Audio("balloonpop.mp3");
  audio.volume = 1;
  audio.play();

}

function displayTextAfterConfetti() {
  // Create a div element for the text
  const textElement = document.createElement("div");
  textElement.textContent = "Happy 20th Birthday Jasmine!";
  textElement.classList.add("celebration-text");

  // Append the text element to the document body
  document.body.appendChild(textElement);

    // Create an image element for the GIF
    const gifElement = document.createElement("img");
    gifElement.src = "birthday-cake.gif"; // Replace "path/to/your/gif.gif" with the actual path to your GIF
    gifElement.classList.add("celebration-gif");
  
    // Append the GIF element to the document body
    document.body.appendChild(gifElement);
  
}

