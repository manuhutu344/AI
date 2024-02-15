let video = document.getElementById("video")
let canvas = document.body.appendChild(document.createElement("canvas"))
let ctx = canvas.getContext('2d')
let displaySize ;
let width = 1280
let height = 720

function startStream(){
    navigator.mediaDevices.getUserMedia({
        video: {width, height},
        audio: false
    }).then((steam)=>{video.srcObject = steam})
}

Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('model'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('model'),
    faceapi.nets.tinyFaceDetector.loadFromUri('model'),
    faceapi.nets.faceLandmark68Net.loadFromUri('model'),
    faceapi.nets.faceRecognitionNet.loadFromUri('model'),
    faceapi.nets.faceExpressionNet.loadFromUri('model')
]).then(startStream)

async function detect(){
    const detections = await faceapi.detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender()
    ctx.clearRect(0,0, width, height)
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
}

video.addEventListener('play', ()=>{
    displaySize = {width, height}
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(detect, 100)
})