'use client'

import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { a, useSpring } from '@react-spring/three'
import { Bloom, Depth, DepthOfField, EffectComposer, Noise } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize, Resolution, BlendFunction } from 'postprocessing'

// ─────────────────────────────────────────
// 개별 점 (포인트로 변경)
// ─────────────────────────────────────────
import * as THREE from 'three'

function Point({ artifact, shouldGather, targetPos, originalPos, hasActiveFilters }) {
  const mesh = useRef<THREE.Mesh>(null)
  // spring 애니메이션
  const { pos, scl } = useSpring({
    pos: shouldGather ? targetPos : originalPos,
    scl: !hasActiveFilters ? 1 : shouldGather ? 2 : 0.5,
    opacity: !hasActiveFilters ? 1 : shouldGather ? 1 : 0.8,
    config: { mass: 1, tension: 170, friction: 26 },
  })

  // 회전
  useFrame((_, d) => {
    if (mesh.current) {
      mesh.current.rotation.x += d * 0.5
      mesh.current.rotation.y += d * 0.3
    }
  })

  // 색상 매핑
  const colorMap = {
    원형: '#ff6b6b',
    원기둥형: '#4ecdc4',
    사각형: '#45b7d1',
    삼각형: '#96ceb4',
    인물형: '#feca57',
    기하학형: '#ff9ff3',
    동물형: '#54a0ff',
  }
  const col = colorMap[artifact.형태] || '#74c0fc'

  // 투명도 계산: 필터가 없으면 모두 1, 있으면 선택된 것만 1
  const opacity = !hasActiveFilters ? 1 : shouldGather ? 1 : 0.8

  return (
    <a.mesh ref={mesh} position={pos} scale={scl} castShadow receiveShadow>
      {/* point */}
      <sphereGeometry args={[0.08, 32, 32]} />
      {/* material */}
      <meshStandardMaterial
        color={col}
        emissiveIntensity={1}
        emissive={col}
        transparent
        opacity={opacity}
        metalness={0.7}
        roughness={0.1}
      />
    </a.mesh>
  )
}

// ─────────────────────────────────────────
// 포인트 시스템
// ─────────────────────────────────────────
function PointSystem({ artifacts, selectedFilters }) {
  // 1) 필터가 하나라도 켜졌는지
  const hasActiveFilters = useMemo(() => Object.values(selectedFilters).some(Boolean), [selectedFilters])

  // 2) 모일 대상
  const gatheredArtifacts = useMemo(() => {
    if (!hasActiveFilters) return []

    return artifacts.filter((artifact) =>
      Object.entries(selectedFilters).every(([key, val]) => {
        if (!val) return true
        if (key === '형태' && artifact[key]?.includes(',')) {
          return artifact[key]
            .split(',')
            .map((s) => s.trim())
            .includes(val)
        }
        return artifact[key] === val
      }),
    )
  }, [artifacts, selectedFilters, hasActiveFilters])

  // 3) 좌표 계산
  const { originalPosArr, spherePosArr } = useMemo(() => {
    const ori = []
    const sph = []

    artifacts.forEach((a, i) => {
      const idStr = a.id || `artifact_${i}`
      const seed = idStr.split('').reduce((s, c) => s + c.charCodeAt(0), 0) + i
      const rand = (n) => ((((Math.sin(seed * n) % 1) + 1) % 1) - 0.5) * 30
      ori.push([rand(12.9898), rand(78.233), rand(39.346)])
    })

    const cnt = gatheredArtifacts.length
    gatheredArtifacts.forEach((_, i) => {
      const phi = Math.acos(1 - (2 * i) / cnt)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = Math.max(1.5, Math.cbrt(cnt) * 0.4)
      sph.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)])
    })

    return { originalPosArr: ori, spherePosArr: sph }
  }, [artifacts, gatheredArtifacts])

  return (
    <>
      {artifacts.map((artifact, idx) => {
        const gi = gatheredArtifacts.findIndex((g) => g.id === artifact.id)
        const gather = gi !== -1
        const target = gather ? spherePosArr[gi] : originalPosArr[idx]

        return (
          <Point
            key={artifact.id}
            artifact={artifact}
            shouldGather={gather}
            targetPos={target}
            originalPos={originalPosArr[idx]}
            hasActiveFilters={hasActiveFilters}
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
// Foo (캔버스 래퍼)
// ─────────────────────────────────────────
export function Foo({ className, artifacts, selectedFilters }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 10, 0], fov: 30 }} shadows className='size-full'>
        <Suspense
          fallback={
            <Html center className='text-white text-lg'>
              Loading...
            </Html>
          }
        >
          <PointSystem artifacts={artifacts} selectedFilters={selectedFilters} />
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
