const { createCanvas, loadImage } = require('canvas');
const faceapi = require('face-api.js');
const fs = require('fs');

// HTML content
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Face Detection</title>
</head>
<body>
    <video id="video" width="640" height="480" autoplay></video>
    <canvas id="canvas" width="640" height="480"></canvas>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/face-api.js"></script>
</body>
</html>
`;

// Create a virtual DOM and set its content
const { window, document } = new JSDOM(htmlContent);
global.document = document;
global.window = window;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

async function setupVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return video;
}

async function detectFacesInVideo(video) {
    await faceapi.nets.tinyFaceDetector.loadFromDisk('models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('models');
    const context = canvas.getContext('2d');

    async function detectFaces() {
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        context.clearRect(0, 0, canvas.width, canvas.height);

        const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
        resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            context.beginPath();
            context.rect(box.x, box.y, box.width, box.height);
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.stroke();
        });

        requestAnimationFrame(detectFaces);
    }

    video.addEventListener('play', () => {
        detectFaces();
    });
}

async function main() {
    const video = await setupVideoStream();
    detectFacesInVideo(video);
}

main();
