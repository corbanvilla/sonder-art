// "use client"

// import React, { useRef, useState } from 'react';

// const WebcamCapture = () => {
//     const webcamRef = useRef(null);
//     const [imgSrc, setImgSrc] = useState(null);

//     const capture = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         //@ts-ignore
//         webcamRef.current.srcObject = stream;
//     };

//     const takePhoto = () => {
//         const video = webcamRef.current;
//         const canvas = document.createElement('canvas');
//         //@ts-ignore
//         canvas.width = video.videoWidth;
//         //@ts-ignore
//         canvas.height = video.videoHeight;
//         //@ts-ignore
//         canvas.getContext('2d').drawImage(video, 0, 0);
//         //@ts-ignore
//         setImgSrc(canvas.toDataURL('image/png'));
//     };

//     return (
//         <div>
//             <video ref={webcamRef} autoPlay playsInline></video>
//             <button onClick={capture}>Start Camera</button>
//             <button onClick={takePhoto}>Take Photo</button>
//             {imgSrc && <img src={imgSrc} alt="Captured" />}
//         </div>
//     );
// };

// export default WebcamCapture;
