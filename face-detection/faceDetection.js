const faceapi = require('face-api.js');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { createCanvas, Image } = require('canvas');

// Input video file
const inputVideo = 'face-demographics-walking-and-pause.mp4';

// Output video file
const outputVideo = 'output.mp4';

// Initialize face-api.js
const canvas = createCanvas(640, 480);
faceapi.env.monkeyPatch({ fs, canvas, Image });

async function extractFrames() {
  // Initialize FFmpeg
  const command = ffmpeg(inputVideo);
  const frameRate = 30; // Adjust to match your video's frame rate

  // Create a filter complex to extract video frames
  command.complexFilter([
    `fps=${frameRate},scale=640:480`,
    {
      filter: 'drawbox',
      options: { x: 'iw/4', y: 'ih/4', w: 'iw/2', h: 'ih/2', color: 'red', t: 'fill' },
      inputs: '0'
    },
  ]);

  // Set output format to image
  command.outputFormat('mjpeg');

  // Use a stream to read the frames
  command.pipe();

  let frameCount = 0;

  command.on('data', (frame) => {
    frameCount++;
    
    // Process the frame with face-api.js
    const img = new Image();
    img.src = frame;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Perform face detection on the frame
    const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions();
    const detections = faceapi.detectAllFaces(canvas, faceDetectionOptions);
    
    // Draw rectangles around detected faces
    faceapi.draw.drawDetections(canvas, detections);

    // Write the frame to the output video
    command.input(canvas.toBuffer('image/png'));
  });

  command.on('end', () => {
    console.log(`Processed ${frameCount} frames`);
    command.save(outputVideo);
  });

  command.on('error', (err) => console.error(err));
}

async function main() {
  await faceapi.nets.tinyFaceDetector.loadFromDisk('models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('models');

  await extractFrames();
}

main();































// async function detectFacesInVideo() {
//   await faceapi.nets.tinyFaceDetector.loadFromDisk('models');
//   await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
//   await faceapi.nets.faceRecognitionNet.loadFromDisk('models');
//   // const detections = await faceapi.detectAllFaces(videoElement, options)

//   const command = ffmpeg(inputVideo);

//   // Create a filter complex to detect faces and draw rectangles
//   command.complexFilter([
//     'scale=640:480',
//     {
//       filter: 'drawbox',
//       options: { x: 'iw/4', y: 'ih/4', w: 'iw/2', h: 'ih/2', color: 'red', t: 'fill' },
//       inputs: '0',
//     }
//   ]);

//   // Set output format and save the modified video
//   command
//     .outputOptions('-c:v libx264')
//     .on('end', () => console.log('Finished processing'))
//     .on('error', (err) => console.error(err))
//     .save(outputVideo);
// }

// async function main() {

//   // Detect faces
//   const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions();
//   const detections = await faceapi.detectAllFaces(inputVideo, faceDetectionOptions);
//   console.log(`Number of detected faces: ${detections.length}`);

//   // Run video processing
//   detectFacesInVideo();
// }

// main();