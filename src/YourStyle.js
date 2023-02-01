import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import blocks from './blocks'

const hexToValues = (hex) => {
  const hexString = hex.slice(2)
  const values = []
  for (let i = 0; i < hexString.length; i += 2) {
    values.push(parseInt(hexString.slice(i, i + 2), 16))
  }
  return values
}

const CustomStyle = ({ block = blocks[0], mod1 = 0.5, mod2 = 0, mod3 = 1, color = '#cacaca', color2 = 'blue' }) => {
  const mesh = useRef()
  const { hash } = block

  // valuesFromHash takes the hex value of hash (formatted 0x00000000000000000000), removes the 0x, and splits each pair of characters and parses it as an int
  const valuesFromHash = hexToValues(hash);
  console.log({ valuesFromHash })

  // gridDensity is the number of blocks in the x and y direction. 10 means 10x10 blocks
  // its value is the first value in the array of valuesFromHash scaled from 0-255 down to a value between 5 and 32.
  const gridDensity =  32// valuesFromHash[0] / 255 * 200 + 30;

  // array of boxes
  const boxes = []

  // make a grid of boxes
  for (let x = 0; x < gridDensity; x++) {
    for (let y = 0; y < gridDensity; y++) {

      // calculate x, y, z position of the box
      const xPos = x - gridDensity / 2
      const yPos = y - gridDensity / 2
      const zPos = 0

      const color = `hsl(${valuesFromHash[(x * y) % valuesFromHash.length]}, 100%, 50%)`
      // push a box to the array of boxes
      boxes.push(
        <mesh key={`${x}-${y}`}
          rotation-x={Math.PI * 0.01 * y}
          rotation-y={Math.PI * 0.01 * y}
          position={[xPos, yPos, zPos - 25 + (valuesFromHash[(x * y) % valuesFromHash.length]) / 255 * 15]} 
          scale={[.3, .3, 2]}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )
    }
  }

  // get lightColor frm hash
  const lightColor = `hsl(${valuesFromHash[9]}, 100%, 20%)`

  return (
    <group>
      <ambientLight intensity={0.4} color={lightColor} />
      <spotLight position={[10, 0, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {boxes}
    </group>
  )
}
/*

an example of some boxes in react three fiber
```
  <mesh ref={mesh} scale={[1, hashLastDigit / 3, 1]}>
    <boxBufferGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color2} />
  </mesh>

  <mesh ref={mesh} scale={[hashLastDigit / 5, 1, 1]}>
    <boxBufferGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color} />
  </mesh>
```


*/

export default CustomStyle
