import React, { useRef, useState } from 'react'
import blocks from './blocks'

/*
Create your Custom style to be turned into a EthBlock.art Mother NFT

Basic rules:
 - use a minimum of 1 and a maximum of 4 "modifiers", modifiers are values between 0 and 1,
 - use a minimum of 1 and a maximum of 3 colors, the color "background" will be set at the canvas root
 - Use the block as source of entropy, no Math.random() allowed!

 Arguments:
  - block: the blockData, in this example template you are given 3 different blocks to experiment with variations
  - mod[1-3]: template modifier arguments with arbitrary defaults to get your started
  - color: template color argument with arbitrary default to get you started

Getting started:
 - Write react-three-fiber (THREE.JS) code, comsuming the block data and modifier arguments,
   make it cool and use no random() internally, component must be pure, output deterministic
 - Customize the list of arguments as you wish, given the rules listed below
 - Provide a set of initial /default values for the implemented arguments, your preset.
 - Think about what scarcity rule you want to appply limiting the usage of your style.
 - Think about what fee structure you want to apply, for NFTs minted using your style, added to what ethblock.art charges for each NFT minted.
 
Suggestions on how to get acclimatized:
 - Change "block = block[0]" to block[1] or block[2] to see how different blocks look with the code written
 - replace any number in the code with mod1, mod2 or mod3.
 - check out rect-three fiber documentation for examples!
*/

const CustomStyle = ({ block = blocks[0], mod1 = 0.5, mod2 = 0, mod3 = 1, color = '#cacaca', color2 = 'blue' }) => {
  const mesh = useRef()
  const { hash } = block
  const hashLastDigit = parseInt(hash[hash.length - 1], 36)
  console.log(hash, hashLastDigit)
  return (
    <group>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      <mesh ref={mesh} scale={[1, hashLastDigit / 3, 1]}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color2} />
      </mesh>

      <mesh ref={mesh} scale={[hashLastDigit / 5, 1, 1]}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

export default CustomStyle
