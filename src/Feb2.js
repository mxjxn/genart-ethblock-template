import React from "react";
import Sketch from "react-p5";
import p5 from "p5";
import blocks from "./blocks";

class Pen {
  constructor(p5, size, color) {
    this.p5 = p5;
    this.color = color;
    this.size = size;
  }


  placePen(x, y, angle, density, pressure) {
    // (x, y) represents the middle of the pen
    // angle is the angle of the pen in degrees
    // pressure is the relative opacity of the pen
    // density is the number of dots per unit length of the pen
    // the pen is placed by drawing pressure * size translucent dots

    // convert angle to radians
    angle = angle * (Math.PI / 180);

    // calculate the x and y components of the pen
    const xComponent = Math.cos(angle);
    const yComponent = Math.sin(angle);

    // calculate the new color with pressure with slight randomness
    const randNum = this.p5.random(0.9, 1.1);
    const newColor = this.p5.color(
      this.p5.red(this.color),
      this.p5.green(this.color),
      this.p5.blue(this.color),
      Math.floor(this.p5.alpha(this.color) * pressure * randNum)
    );
    // draw the pen centered at (x, y)
    for (let i = -this.size / 2; i < this.size / 2 * density; i++) {

      this.p5.strokeWeight(0.7);
      if (i % 4 === 0 || i % 5 === 0 || (15 > i > -15 && Math.random() > 0.5)) {
        this.p5.strokeWeight(0.3);
      }
      this.p5.stroke(this.color);
      this.p5.point(
        x + xComponent * i / density,
        y + yComponent * i / density
      );
    }
  }
}

const hexToValues = (hex) => {
  const hexString = hex.slice(2)
  const values = []
  for (let i = 0; i < hexString.length; i += 2) {
    values.push(parseInt(hexString.slice(i, i + 2), 16))
  }
  return values
}

export default ({ block = blocks[2] }) => {

  const { hash } = block;
  const valuesFromHash = hexToValues(hash);

  let width, height, pen;
  let gridWidth = 4, gridHeight = 4;
  let backgroundAngleMin = -30;
  let backgroundAngleMax = 40;
  let backgroundAngle = 10;
  let backgroundDensityMin = 0.1;
  let backgroundDensityMax = 0.8;
  let backgroundPressureMin = 0.1;
  let backgroundPressureMax = 0.8;

  // convert value from 0-255 to min-max
  const convert = (value, min, max) => (value / 255) * (max - min) + min;

  // convert value from 0-255 to a color in hsl, using hue
  const convertToColor = (value, ...rest) => {
    const hue = convert(value, 0, 360);
    if (rest.length === 0) {
      return `hsl(${hue}, 100%, 50%)`;
    }
    const [saturation, lightness] = rest;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  const convertToGrey = (value, minLum, maxLum) => {
    const lum = convert(value, minLum, maxLum);
    return `hsl(0, 0%, ${lum}%)`;
  }

  // value one is background angle
  // q holds variables that are used in the draw function
  const q = {
    backgroundAngle: convert(valuesFromHash[0], backgroundAngleMin, backgroundAngleMax),
    backgroundDensity: convert(valuesFromHash[1], backgroundDensityMin, backgroundDensityMax),
    backgroundPressure: convert(valuesFromHash[2], backgroundPressureMin, backgroundPressureMax),
    backgroundColor: convertToColor(valuesFromHash[3]),
    backgroundHue: convert(valuesFromHash[3], 0, 360),
    backgroundSaturation: convert(valuesFromHash[4], 0, 100),
    gradientColorA: convertToColor(valuesFromHash[5], 30, 50),
    gradientColorB: convertToColor(valuesFromHash[6], 55, 90),
    multiplierX: convert(valuesFromHash[7], 90, 125),
    multiplierY: convert(valuesFromHash[8], 90, 125),
    wildcardMultiplier: convert(valuesFromHash[9], 0.125/2, 8),
  }

  const setup = (p5, canvasParentRef) => {
    width = 640, height = 400;
    // pen = new Pen(p5, 10, p5.color(0, 0, 0, 70));
    // use parent to render the canvas in this ref

    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(width, height).parent(canvasParentRef);
    p5.mouseClicked = () => {
      pen.placePen(p5.mouseX, p5.mouseY, -35, 0.1);
    }
  };

  const draw = (p5) => {
    // p5.background('#aaa');
    // draw a vertical gradient #aaa to #333 in the background
    for (let i = 0; i < height; i++) {
      const color = p5.color(p5.lerpColor(p5.color(q.gradientColorA), p5.color(q.gradientColorB), i / height));
      p5.stroke(color);
      p5.line(0, i, width, i);
    }




    // draw the background
    // create a new pen for it that is bigger than the screen
    const backgroundPen = new Pen(p5, width * 2, p5.color('black'));

    // starting y postion is 50% above the screen
    // ending y position is 50% below the screen
    // x,y starting position is the middle top of the screen
    // using a loop create a background by calling placePen at an based on background variables.
    // it should move at the backgroundAngle, have density between backgroundDensityMin and backgroundDensityMax, and pressure between backgroundPressureMin and backgroundPressureMax
    for (let i = 0; i < height * 2; i += .25) {
      // backgroundPen.placePen(width / 2, i - height / 2, backgroundAngle + p5.random(-1, 1), p5.random(backgroundDensityMin, backgroundDensityMax), p5.random(backgroundPressureMin, backgroundPressureMax));
      // rewrite the above line to use the values from the hash to control sinewave frequency, amplitude and phase to determine the first two parameters of placePen
      // the third parameter should be backgroundAngle
      // the fourth parameter should be between backgroundDensityMin and backgroundDensityMax
      // the fifth parameter should be between backgroundPressureMin and backgroundPressureMax
      console.table({
        x: width / 2 + p5.sin(i / 103) * 100,
        y: i - height / 2 + p5.sin(i / 110) * 100,
        angle: q.backgroundAngle + p5.random(-1, 1),
        density: valuesFromHash[Math.floor(i * 4) % valuesFromHash.length] / 255 * (backgroundDensityMax - backgroundDensityMin) + backgroundDensityMin,
        pressure: valuesFromHash[Math.floor(i * 4) % valuesFromHash.length] / 255 * (backgroundPressureMax - backgroundPressureMin) + backgroundPressureMin,
        color: q.backgroundColor
      })
      backgroundPen.placePen(
        width / 2 + p5.sin(i / q.multiplierX) * 100,
        i - height / 2 + p5.sin(i / q.multiplierY) * 100,
        q.backgroundAngle + convert(valuesFromHash[Math.floor(i*q.wildcardMultiplier) % valuesFromHash.length], -1, 1),
        valuesFromHash[Math.floor(i * 4) % valuesFromHash.length] / 255 * (backgroundDensityMax - backgroundDensityMin) + backgroundDensityMin,
        valuesFromHash[Math.floor(i * 4) % valuesFromHash.length] / 255 * (backgroundPressureMax - backgroundPressureMin) + backgroundPressureMin,
        //p5.random(backgroundDensityMin, backgroundDensityMax),
        // p5.random(backgroundPressureMin, backgroundPressureMax)
      );
    }

    //noloop
    p5.noLoop();

    // pen.placePen(i * width / gridWidth + k * width / gridWidth, j * height / gridHeight + (1 - k) * height / gridHeight, 30 + p5.random(-1, 1), p5.random(0.1, .81));
  }

  return <Sketch setup={setup} draw={draw} />;
};