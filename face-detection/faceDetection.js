const faceapi = require('face-api.js');
const ffmpeg = require('fluent-ffmpeg');

// Input video file
const inputVideo = 'face-demographics-walking-and-pause.mp4';

// Output video file
const outputVideo = 'output.mp4';

async function detectFacesInVideo() {
  const command = ffmpeg(inputVideo);

  // Create a filter complex to detect faces and draw rectangles
  command
    .complexFilter([
      'scale=640:480',
      {
        filter: 'drawbox',
        options: { x: 'iw/4', y: 'ih/4', w: 'iw/2', h: 'ih/2', color: 'red', t: 'fill' },
        inputs: '0'
      },
    ]);

  // Set output format and save the modified video
  command
    .outputOptions('-c:v libx264')
    .on('end', () => console.log('Finished processing'))
    .on('error', (err) => console.error(err))
    .save(outputVideo);
}

detectFacesInVideo();