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
// #genruary 2023 day two
const CustomStyle = ({ block = blocks[0], mod1 = 0.5, mod2 = 0, mod3 = 1, color = '#cacaca', color2 = 'blue' }) => {
  const mesh = useRef()
  const { hash } = block

  // valuesFromHash takes the hex value of hash (formatted 0x00000000000000000000), removes the 0x, and splits each pair of characters and parses it as an int
  const valuesFromHash = hexToValues(hash);
  console.log({ valuesFromHash })



  return (
    <group>
      <ambientLight intensity={.24} color="white" />
      <spotLight position={[10, 0, 10]} angle={0.5} penumbra={1} intensity={30} />
      <pointLight position={[-10, -10, -10]} intensity={20} />
      {
      }
    </group>
  )
}
/*
an example of a box in react three fiber
```
  <mesh ref={mesh} scale={[1, hashLastDigit / 3, 1]}>
    <boxBufferGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color2} />
  </mesh>
```
*/

export default CustomStyle
