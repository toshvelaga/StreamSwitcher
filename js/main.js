'use strict';

const screenButton = document.getElementById('screenButton');
const cameraButton = document.getElementById('cameraButton');
const recordStartButton = document.getElementById('recordStartButton');
const recordStopButton = document.getElementById('recordStopButton');

screenButton.addEventListener('click', screen);
cameraButton.addEventListener('click', camera);
recordStartButton.addEventListener('click', startRecord);
recordStopButton.addEventListener('click', stopRecord);

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
}

async function camera() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  console.log('Received local screen stream');
  stream.replaceVideoTrack(stream.getVideoTracks()[0])
  stream.replaceAudioTrack(stream.getAudioTracks()[0])
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
}

async function stopRecord() {
  mediaRecorder.stop();
  recordStartButton.style.background = "";
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




