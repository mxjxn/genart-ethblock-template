import React, { useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import CustomStyle from './YourStyle'

export default function App() {
  return (
    <div>
      <Canvas
        style={{
          border: '1px solid red',
          margin: '0 auto',
          marginTop: '64px',
          width: '640px',
          height: '640px'
        }}>
        <CustomStyle />
      </Canvas>
    </div>
  )
}
