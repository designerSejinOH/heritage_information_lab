'use client'

import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import classNames from 'classnames'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
})

// 개별 점 컴포넌트
function Point({ position, targetPosition, isGathering, index }) {
  const meshRef = useRef()
  const [currentPos, setCurrentPos] = useState(position)

  useFrame((state, delta) => {
    if (meshRef.current) {
      const target = isGathering ? targetPosition : position

      // 부드러운 애니메이션을 위한 lerp
      meshRef.current.position.lerp(new THREE.Vector3(target[0], target[1], target[2]), delta * 2)

      // 약간의 회전 애니메이션
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color={isGathering ? '#ff6b6b' : '#74c0fc'}
        emissive={isGathering ? '#ff3333' : '#4dabf7'}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

// 메인 포인트 스피어 컴포넌트
function PointSphere() {
  const [isGathering, setIsGathering] = useState(false)
  const pointCount = 100

  // 점들의 초기 위치와 구형 위치를 미리 계산
  const points = useMemo(() => {
    const initialPoints = []
    const spherePoints = []

    for (let i = 0; i < pointCount; i++) {
      // 초기 위치: 넓은 범위에 랜덤하게 분산
      const initialPos = [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]

      // 구형 위치: 피보나치 스피어 분포 사용
      const phi = Math.acos(1 - (2 * i) / pointCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const radius = 2

      const spherePos = [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      ]

      initialPoints.push(initialPos)
      spherePoints.push(spherePos)
    }

    return { initialPoints, spherePoints }
  }, [pointCount])

  return (
    <>
      {/* 점들 렌더링 */}
      {points.initialPoints.map((pos, index) => (
        <Point
          key={index}
          position={pos}
          targetPosition={points.spherePoints[index]}
          isGathering={isGathering}
          index={index}
        />
      ))}

      {/* 배경 조명 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />

      {/* 카메라 컨트롤 */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}

// 메인 앱 컴포넌트
export function Foo({ className }: { className?: string }) {
  return (
    <View className={className}>
      <PointSphere />
    </View>
  )
}
