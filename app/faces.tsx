"use client"
// TODO - also play with face mood, age, gender, etc

import * as faceapi from 'face-api.js'
import { useEffect, useRef, useState } from 'react';

import PhotoDistort from './photodistort';

const images = [
    "images/barkley.jpg",
    "images/farah-al-qasimi.jpg",
    "images/jacolby.jpg",
    "images/jade-guanaro.jpg",
    "images/judy-chicago.jpg",
]

export default function Faces() {
    const webcamRef = useRef(null);
    const [imageURL, setImageURL] = useState(images[0]);
    const [imageIndex, setImageIndex] = useState(0);
    const [imgSrc, setImgSrc] = useState(null);
    const [faceDescriptor, setFaceDescriptor] = useState(new Float32Array);

    const capture = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        //@ts-ignore
        webcamRef.current.srcObject = stream;
    };

    const generateEmbedding = async () => {
        if (!webcamRef.current) return;

        const results = await faceapi
            .detectAllFaces(webcamRef.current)
            .withFaceLandmarks()
            .withFaceDescriptors();

        // console.log("Face scan done!");
        // console.log(`Detected ${results.length} faces`);
        if (results.length === 0) return;
        // console.log(results[0].descriptor);
        setFaceDescriptor(results[0].descriptor);

        // Draw to canvas
        const video = webcamRef.current;
        const canvas = document.createElement('canvas');
        //@ts-ignore
        canvas.width = video.videoWidth;
        //@ts-ignore
        canvas.height = video.videoHeight;
        //@ts-ignore
        canvas.getContext('2d').drawImage(video, 0, 0);
        faceapi.draw.drawDetections(canvas, results);
        faceapi.draw.drawFaceLandmarks(canvas, results);
        //@ts-ignore
        setImgSrc(canvas.toDataURL('image/png'));

 

    }

    const nextImage = () => {
        setImageIndex((imageIndex + 1) % images.length);
        setImageURL(images[imageIndex]);
    }

    useEffect(() => {
        // console.log("My code only runs on client!");
        (async () => {
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            // console.log("Loaded face api models");
        })();

        // Capture webcam every second
        const interval = setInterval(() => {
            if (!webcamRef.current) return;
            generateEmbedding();
        }, 2000);
      
        // Clear interval on component unmount
        return () => clearInterval(interval);

    }, []);

    return (
        <>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 items-center">
                    {faceDescriptor.length === 0 && <p className="text-white">You must start the camera and allow it to detect your face before you can see images!</p>}
                    <button className="bg-white text-black px-4 py-2 rounded shadow cursor-pointer" onClick={capture}>Start Camera</button>
                    <video ref={webcamRef} autoPlay playsInline></video>
                    {imgSrc && <p className="text-black bg-white px-4 py-2 rounded text-lg">Face detection:</p>}
                    {imgSrc && <img src={imgSrc} alt="Captured" />}
                </div>
                <div className="flex flex-col gap-4 items-center">
                    {/* @ts-ignore */}
                    {faceDescriptor.length > 0 && <PhotoDistort foundFaceDescriptor={faceDescriptor} setImageURL={imageURL} />}
                    {faceDescriptor.length > 0 && <button className="bg-white text-black px-4 py-2 rounded" onClick={nextImage}>Next image</button>}
                </div>
            </div>
        </>
    )
}