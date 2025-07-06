'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped

  return (
    <Canvas
      {...props}
      flat
      camera={{ fov: 18, position: [20, 20, 20] }}
      shadows
      gl={{
        alpha: true,
        antialias: true,
      }}
      raycaster={{
        params: {
          Line: { threshold: 0.1 },
          Mesh: undefined,
          LOD: undefined,
          Points: {
            threshold: 0,
          },
          Sprite: undefined,
        },
      }}
      onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}
    >
      {/* @ts-ignore */}
      <r3f.Out />
      <Preload all />
    </Canvas>
  )
}
