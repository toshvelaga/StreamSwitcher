'use strict';

const screenButton = document.getElementById('screenButton');
const cameraButton = document.getElementById('cameraButton');
const recordStartButton = document.getElementById('recordStartButton');
const recordStopButton = document.getElementById('recordStopButton');

screenButton.addEventListener('click', screen);
cameraButton.addEventListener('click', camera);
recordStartButton.addEventListener('click', startRecord);
recordStopButton.addEventListener('click', stopRecord);

if (!supported()) {
  console.error("Browser does not support this functionality!")
  document.getElementById("error").innerHTML = 'Browser not supported <a href="https://caniuse.com/#search=captureStream">Info</a>';
} else {
  enableStartButtons();
}

var mediaRecorder;
var chunks = [];

const remoteVideo = document.getElementById('remoteVideo');
var tempStream = new MediaStream();

setTimeout(function () {
  remoteVideo.srcObject = tempStream.remoteStream;
}, 500);

async function screen() {
  const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
  console.log('Received local screen stream');
  stream.replaceVideoTrack(stream.getVideoTracks()[0])
  enableButtons()
}

async function camera() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  console.log('Received local screen stream');
  stream.replaceVideoTrack(stream.getVideoTracks()[0])
  stream.replaceAudioTrack(stream.getAudioTracks()[0])
  enableButtons()
}

async function enableButtons() {
  recordStartButton.disabled = false;
  recordStopButton.disabled = false;
}

function enableStartButtons() {
  screenButton.disabled = false;
  cameraButton.disabled = false;
}

async function startRecord() {
  mediaRecorder = new MediaRecorder(remoteVideo.captureStream());
  mediaRecorder.ondataavailable = function (e) {
    console.log("Added Data");
    chunks.push(e.data);
  }
  mediaRecorder.onstop = onStop;
  mediaRecorder.start();
  recordStartButton.style.background = "red";
  recordStartButton.style.color = "black";
}

async function stopRecord() {
  mediaRecorder.stop();
  recordStartButton.style.background = "";
  recordStartButton.style.color = "";
}

function onStop(e) {
  console.log("data available after MediaRecorder.stop() called.");
  var blob = new Blob(chunks, {
    type: 'video/webm'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'test.webm';
  a.click();
  window.URL.revokeObjectURL(url);
  chunks = [];
}




