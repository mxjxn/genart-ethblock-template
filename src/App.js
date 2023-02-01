import React, { useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import DayOne from './YourStyle'

export default function App() {
  return (
    <div>
      <h1>#genruary2023</h1>
      <Canvas
        style={{
          margin: '0 auto',
          marginTop: '64px',
          width: '640px',
          height: '640px'
        }}>
        <color attach="background" args={['#171717']} />
        <DayOne />
      </Canvas>
    </div>
  )
}
