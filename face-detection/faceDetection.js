import * as faceapi from 'face-api.js';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Face Detection in Video</title>
</head>
<body>
  <video id="video" width="640" height="480" controls></video>
  <canvas id="canvas" width="640" height="480"></canvas>
  <a id="downloadLink" style="display: none" download="output.mp4">Download Video</a>
  <script src="face-api.js"></script>
  <script src="script.js"></script>
</body>
</html>
`;

const htmlContainer = document.createElement('div');
htmlContainer.innerHTML = htmlContent;

document.body.appendChild(htmlContainer);

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');
const ctx = canvas.getContext('2d');

video.src = 'face-demographics-walking-and-pause.mp4';

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models'),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => console.error(error));
}

video.addEventListener('play', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 320 });

  const mediaStream = canvas.captureStream();
  const mediaRecorder = new MediaRecorder(mediaStream);
  const recordedChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = 'block';
  };

  mediaRecorder.start();

  async function detectFaces() {
    const detections = await faceapi.detectAllFaces(video, faceDetectionOptions).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw red rectangles around detected faces
    resizedDetections.forEach((detection) => {
      const box = detection.detection.box;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });

    requestAnimationFrame(detectFaces);
  }

  detectFaces();
});
