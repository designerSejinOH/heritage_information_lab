'use client'

import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import { Bloom, Depth, DepthOfField, EffectComposer, Noise } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize, Resolution, BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// ─────────────────────────────────────────
// 개별 점 (가짜 유물)
// ─────────────────────────────────────────
function Point({ pointId, shouldGather, targetPos, originalPos, hasActiveFilters, isFiltered, pointColor }) {
  const mesh = useRef<THREE.Mesh>(null)

  // spring 애니메이션
  const { pos, scl, opacity } = useSpring({
    pos: shouldGather ? targetPos : originalPos,
    scl: !hasActiveFilters ? 1 : shouldGather ? 1.2 : 1,
    opacity: !hasActiveFilters ? 0.8 : shouldGather ? 1 : 0.2,
    config: { mass: 1, tension: 170, friction: 26 },
  })

  // 회전
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.5
      mesh.current.rotation.y += delta * 0.3
    }
  })

  // 각 점마다 고유한 색상 사용
  const color = pointColor

  return (
    <a.mesh ref={mesh} position={pos} scale={scl} castShadow receiveShadow>
      <sphereGeometry args={[0.04, 16, 16]} />
      <a.meshStandardMaterial
        color={color}
        emissiveIntensity={shouldGather ? 1.2 : 0.5}
        emissive={color}
        transparent
        opacity={opacity}
        metalness={0.7}
        roughness={0.1}
      />
    </a.mesh>
  )
}

// ─────────────────────────────────────────
// 가짜 포인트 시스템
// ─────────────────────────────────────────
function FakePointSystem({ currentStep, selectedFilters }) {
  // HSB 기반 색상 생성 함수
  const hsbToHex = (h, s, b) => {
    s /= 100
    b /= 100
    const c = b * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = b - c
    let r = 0,
      g = 0,
      blue = 0

    if (0 <= h && h < 60) {
      r = c
      g = x
      blue = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      blue = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      blue = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      blue = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      blue = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      blue = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    blue = Math.round((blue + m) * 255)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
  }

  // 고정된 100개의 가짜 점들 (HSB 기반 색상)
  const fakePoints = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const seed = i * 123.456

      // 시드 기반으로 HUE 값 생성 (0-360도)
      const hue = ((Math.sin(seed) * 0.5 + 0.5) * 360) % 360

      // 채도와 밝기는 적당히 높은 값으로 고정 (생생한 색상을 위해)
      const saturation = 70 + (Math.sin(seed * 1.234) * 0.5 + 0.5) * 30 // 70-100%
      const brightness = 80 + (Math.sin(seed * 5.678) * 0.5 + 0.5) * 20 // 80-100%

      return {
        id: i,
        // 각 점이 어느 단계까지 살아남을지 미리 정의
        surviveUntilStep: Math.floor(Math.random() * 4), // 0~3
        // 랜덤 시드로 일관된 위치 생성
        seed: seed,
        // HSB 기반 색상 생성
        color: hsbToHex(hue, saturation, brightness),
      }
    })
  }, [])

  // 단계별 색상 정의 (제거)
  // const stepColors = [
  //   '#ff6b6b', // 형태
  //   '#4ecdc4', // 재질
  //   '#45b7d1', // 시대
  //   '#96ceb4'  // 용도
  // ]

  // 현재 단계에서 활성 필터가 있는지
  const hasActiveFilters = useMemo(() => Object.values(selectedFilters).some(Boolean), [selectedFilters])

  // 현재 단계에서 살아남을 점들 계산
  const survivingPoints = useMemo(() => {
    if (!hasActiveFilters) return []

    return fakePoints.filter((point) => {
      // 각 단계마다 점진적으로 줄어듦
      let surviveChance = 1

      // 단계별로 생존 확률 감소
      for (let step = 0; step <= currentStep; step++) {
        if (selectedFilters[Object.keys(selectedFilters)[step]]) {
          // 각 단계마다 약 60-80% 정도만 생존
          const stepSurvivalRate = 0.7 - step * 0.1
          surviveChance *= stepSurvivalRate
        }
      }

      // 점의 시드를 기반으로 일관된 생존 여부 결정
      const pointSurvivalScore = Math.sin(point.seed) * 0.5 + 0.5
      return pointSurvivalScore < surviveChance
    })
  }, [fakePoints, currentStep, selectedFilters, hasActiveFilters])

  // 좌표 계산
  const { originalPosArr, spherePosArr } = useMemo(() => {
    const ori = []
    const sph = []

    // 원본 위치 (모든 점에 대해)
    fakePoints.forEach((point) => {
      const seed = point.seed
      const rand = (n) => ((((Math.sin(seed * n) % 1) + 1) % 1) - 0.5) * 25
      ori.push([rand(12.9898), rand(78.233), rand(39.346)])
    })

    // 모인 위치 (살아남은 점들에 대해서만)
    const cnt = survivingPoints.length
    survivingPoints.forEach((_, i) => {
      const phi = Math.acos(1 - (2 * i) / cnt)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = Math.max(2, Math.cbrt(cnt) * 0.5)
      sph.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)])
    })

    return { originalPosArr: ori, spherePosArr: sph }
  }, [fakePoints, survivingPoints])

  return (
    <>
      {fakePoints.map((point, idx) => {
        const survivorIndex = survivingPoints.findIndex((s) => s.id === point.id)
        const shouldGather = survivorIndex !== -1
        const targetPos = shouldGather ? spherePosArr[survivorIndex] : originalPosArr[idx]

        return (
          <Point
            key={point.id}
            pointId={point.id}
            shouldGather={shouldGather}
            targetPos={targetPos}
            originalPos={originalPosArr[idx]}
            hasActiveFilters={hasActiveFilters}
            isFiltered={!shouldGather && hasActiveFilters}
            pointColor={point.color}
          />
        )
      })}

      {/* 조명 & 컨트롤 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      <OrbitControls
        maxDistance={25}
        minDistance={3}
        enableZoom={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

// ─────────────────────────────────────────
// Foo (캔버스 래퍼) - Demo용
// ─────────────────────────────────────────
export function Foo({ className, currentStep, selectedFilters }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 10, 0], fov: 40 }} shadows className='size-full'>
        <Suspense
          fallback={
            <Html center className='text-white text-lg'>
              Loading...
            </Html>
          }
        >
          <FakePointSystem currentStep={currentStep} selectedFilters={selectedFilters} />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.1}
              intensity={0.5}
              mipmapBlur={true}
              kernelSize={KernelSize.LARGE}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
