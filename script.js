$(document).ready(function () {
  $("#rateSelect").on("input", function () {
    var rateValue = $(this).val();
    $("#rateSelect2").val(rateValue + " bps");
  });

  $("#propagationSlider").on("input", function () {
    var propagationValue = $(this).val();
    $("#propagation2").val(propagationValue + "e8 m/s");
  });
});

// Constants
var lineLength = 502;
var linePadding = 48;
var delay = 50;
var tick = 1e-5;

// Globals
var running = false;
var timer;
var packet;
var timetext;
var proptimetext;
var sender;
var receiver;
var startButton;
var length;
var rate;
var size;
var time = 0;
var emissionTime;
var propagation = 2.8e8;

function init() {
  startButton = document.getElementById("startButton");
  $(startButton).removeAttr("disabled");

  svgElement = document.getElementById("svg2");
  packet = document.getElementById("packet");
  timetext = document.getElementById("timetext");
  proptimetext = document.getElementById("proptimetext");
  sender = document.getElementById("sender");
  receiver = document.getElementById("receiver");

  
  $("#propagation2").val(propagation + "e8 m/s");
}

function startAnim() {
  if (running == true) {
    clearInterval(timer);
  }

  
  length = Number(document.getElementById("lengthSelect").value) * 1000; 
  rate = Number(document.getElementById("rateSelect").value) * 1000; 
  size = Number(document.getElementById("sizeSelect").value);
  propagation =
    Number(document.getElementById("propagationSlider").value) * 1e8; 

  
  var propagationDelay = (length / propagation) * 100; 

  
  var transmissionDelay = (size / rate) * 1000; 
  var totalDelay = propagationDelay + transmissionDelay;

  
  proptimetext.textContent = "Propagation Delay: 0.000 ms";

  
  timetext.textContent = "Total Delay: 0.000 ms";

  
  var packetLength = (transmissionDelay * lineLength) / length;
  packet.setAttribute("x", -packetLength);
  packet.setAttribute("width", packetLength);

  packet.setAttribute("visibility", "visible");

  time = 0;
  emissionTime = 0;

  timer = setInterval(doAnim, delay);
  startButton.startButtonClicked = true;
}

function doAnim() {
  
  var xfirst = time - emissionTime;
  var xlast = xfirst - size / rate;

  
  xfirst = (xfirst * propagation * lineLength) / length;
  xlast = (xlast * propagation * lineLength) / length;

  if (xlast < 0) xlast = 0;

  var width = Math.max(Math.min(xfirst, lineLength) - xlast, 0);

  packet.setAttribute("width", width);

 
  packet.setAttribute("x", xlast + linePadding);

  
  var propagationDelay = time * 1000; 
  proptimetext.textContent =
    "Propagation Delay: " + propagationDelay.toFixed(3) + " ms";

  
  var totalDelay = (time + size / rate) * 1000; 
  timetext.textContent = "Total Delay: " + totalDelay.toFixed(3) + " ms";

  sender.setAttribute("class", xlast <= 0 ? "sendrec" : "");
  receiver.setAttribute("class", xfirst >= lineLength ? "sendrec" : "");

  
  if (xfirst >= lineLength) {
    
    clearInterval(timer);
    running = false;
    receiver.setAttribute("class", "sendrec");
  }

  time += tick;
}

$(window).load(function () {
  init();
});

$(window).load(function () {
  checkFeatures({
    inlinesvg: true,
    canvas: false,
  });

  init();
});


function updateLengthInput() {
  var lengthValue = document.getElementById("lengthSelect").value;
  document.getElementById("lengthSelect2").value = lengthValue + " km";
}

function preFix(n) {
  if (n >= 1e9) return n / 1e9 + " g";
  if (n >= 1e6) return n / 1e6 + " m";
  if (n >= 1e3) return n / 1000 + " k";
  return n + " ";
}