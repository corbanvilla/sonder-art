import React from "react";
import { Image } from "p5";
import { type Sketch } from "@p5-wrapper/react";
//@ts-ignore
import { NextReactP5Wrapper } from "@p5-wrapper/next";

let faceDescriptor: Float32Array;
let imageURL: string = "images/barkley.jpg";
let lastImageURL: string;

const sketch: Sketch = (p5) => {
    let img: Image;
    let aspectRatio: number;
    let mulitplier: number = 600;
    let adjustedWidth: number;
    let adjustedHeight: number;

    p5.preload = () => {
        img = p5.loadImage(imageURL);
    }


    p5.setup = () => {
        aspectRatio = img.width / img.height;
        adjustedHeight = mulitplier;
        adjustedWidth = Math.floor(mulitplier * aspectRatio);
        
        p5.createCanvas(adjustedWidth, adjustedHeight);
        p5.pixelDensity(1);
        p5.frameRate(1);
        // p5.noLoop();
    }


    p5.draw = () => {
        if (lastImageURL !== imageURL) {
            lastImageURL = imageURL;
            // p5.preload(); p5.setup();
            p5.loadImage(imageURL, (newImg) => {
                img = newImg;
                aspectRatio = img.width / img.height;
                adjustedHeight = mulitplier;
                adjustedWidth = Math.floor(mulitplier * aspectRatio);
                p5.resizeCanvas(adjustedWidth, adjustedHeight);
            });

        }
        p5.image(img, 0, 0, adjustedWidth, adjustedHeight);
        // Don't start drawing until face is found
        if (faceDescriptor.length === 0) return;

        applyRandomFilter();

    }

    function applyRandomFilter() {
        p5.loadPixels();

        const height = p5.height;
        const width = p5.width;
        const pixels = p5.pixels;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              let index = (x + y * width)*4;
              let r = pixels[index+0];
              let g = pixels[index+1];
              let b = pixels[index+2];
              let a = pixels[index+3];     
              
            //   let bw = (r + g + b)/3;
              
            //   pixels[index+0] = bw;
            //   pixels[index+1] = bw;
            //   pixels[index+2] = bw;

            const faceDescriptorIdx = index % 128;
            const adjustment = ((255 * faceDescriptor[faceDescriptorIdx]) % 255);
            pixels[index+0] = ((r - adjustment) % 255);
            pixels[index+1] = ((g + adjustment) % 255);
            pixels[index+2] = ((b - adjustment) % 255);
        }
      }


        p5.updatePixels();
      }
      

};

export default function Page({ foundFaceDescriptor, setImageURL }: { foundFaceDescriptor: Float32Array, setImageURL: string }) {

    // Set globals
    imageURL = setImageURL;
    faceDescriptor = foundFaceDescriptor;

    return (
        <>
            <NextReactP5Wrapper sketch={sketch} />
        </>
    );
}