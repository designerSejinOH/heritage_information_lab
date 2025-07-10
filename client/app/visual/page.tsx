'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { list } from './list' // list.ts 파일에서 데이터 import

// 실제 유물 데이터 (전체 데이터 사용)
const artifactData = list

// 카테고리 정의 (실제 데이터에서 동적으로 추출)
const extractCategories = (data) => {
  return {
    //@ts-ignore
    형태: [...new Set(data.map((item) => item.형태))],
    //@ts-ignore
    재질_분류: [...new Set(data.map((item) => item.재질_분류))],
    //@ts-ignore
    시대: [...new Set(data.map((item) => item.시대))],
    //@ts-ignore
    용도: [...new Set(data.map((item) => item.용도))],
  }
}

const layerColors = ['#ff6b35', '#4ecdc4', '#45b7d1', '#f9ca24']
const layerNames = ['형태', '재질_분류', '시대', '용도']
const layerKeys = ['형태', '재질_분류', '시대', '용도']

// 색상 매핑 함수
function getColorForCategory(layerIndex, categoryValue, categories) {
  const baseColor = new THREE.Color(layerColors[layerIndex])
  const categoryList = categories[layerKeys[layerIndex]]
  const categoryIndex = categoryList.indexOf(categoryValue)

  if (categoryIndex === -1) return baseColor

  const hue = (categoryIndex / categoryList.length) * 360
  return new THREE.Color().setHSL(hue / 360, 0.7, 0.6)
}

// 레이어 컴포넌트
function Layer({ index, visible, name, color, categories }) {
  const layerRef = useRef()
  const layerZ = index * 12 - 18 // 레이어 간격 증가

  return (
    <group visible={visible}>
      {/* 레이어 배경 */}
      <mesh ref={layerRef} position={[0, 0, layerZ]}>
        <planeGeometry args={[20, 15]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* 레이어 테두리 */}
      <lineSegments position={[0, 0, layerZ]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(20, 15)]} />
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>

      {/* 레이어 라벨 */}
      <Text position={[0, 8, layerZ]} fontSize={1.2} color={color} anchorX='center' anchorY='middle'>
        Layer {index}: {name}
      </Text>

      {/* 카테고리 허브들 */}
      <CategoryHubs layerIndex={index} layerZ={layerZ} color={color} categories={categories} />
    </group>
  )
}

// 카테고리 허브 컴포넌트
function CategoryHubs({ layerIndex, layerZ, color, categories }) {
  const categoriesList = categories[layerKeys[layerIndex]]

  return (
    <group>
      {categoriesList.map((category, index) => {
        // 더 많은 카테고리를 위한 격자 배치
        const cols = Math.ceil(Math.sqrt(categoriesList.length))
        const rows = Math.ceil(categoriesList.length / cols)

        const col = index % cols
        const row = Math.floor(index / cols)

        const x = (col - (cols - 1) / 2) * 3
        const y = (row - (rows - 1) / 2) * 2.5

        const categoryColor = getColorForCategory(layerIndex, category, categories)

        return (
          <group key={category} position={[x, y, layerZ]}>
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshLambertMaterial color={categoryColor} transparent opacity={0.8} />
            </mesh>
            <Text position={[0, 0.8, 0]} fontSize={0.25} color='white' anchorX='center' anchorY='middle' maxWidth={2}>
              {category}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// 유물 컴포넌트
function Artifact({ data, onClick, index, categories, pathCurve }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const { camera } = useThree()

  // 유물별 색상
  const artifactColor = useMemo(() => {
    return getColorForCategory(0, data.형태, categories)
  }, [data.형태, categories])

  // 나중에 텍스처 로딩을 위한 준비
  const textureMap = useMemo(() => {
    // 텍스처가 있는 경우 여기서 로드
    if (data.thumbnail && data.thumbnail !== '') {
      // 향후 텍스처 로더 구현 예정
      // const loader = new THREE.TextureLoader();
      // return loader.load(data.thumbnail);
    }
    return null
  }, [data.thumbnail])

  useFrame((state) => {
    if (meshRef.current && groupRef.current && pathCurve) {
      // 회전 애니메이션 (plane이 카메라를 향하도록)
      const camera = state.camera
      //@ts-ignore
      meshRef.current.lookAt(camera.position)

      // 경로를 따라 이동 (각 유물마다 다른 속도와 오프셋)
      const speed = 0.005 + index * 0.001 // 유물마다 약간 다른 속도
      const offset = (index * 0.1) % 1 // 시작 오프셋
      const t = (state.clock.elapsedTime * speed + offset) % 1
      const point = pathCurve.getPoint(t)
      //@ts-ignore
      groupRef.current.position.copy(point)
    }
  })

  return (
    <group ref={groupRef}>
      {/* 유물 정사각형 평면 */}
      <mesh ref={meshRef} onClick={() => onClick(data)}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshLambertMaterial
          map={textureMap}
          color={textureMap ? '#ffffff' : artifactColor}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 유물 ID 텍스트 */}
      <Text position={[0, 0.6, 0]} fontSize={0.12} color='white' anchorX='center' anchorY='middle'>
        {data.id}
      </Text>
    </group>
  )
}

// 경로 컴포넌트 (고정된 궤적)
function ArtifactPath({ pathCurve, color }) {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={pathCurve.getPoints(100).length}
          array={new Float32Array(pathCurve.getPoints(100).flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.3} linewidth={1} />
    </line>
  )
}

// 메인 3D 씬 컴포넌트
function Scene({ layerVisibility, onArtifactClick, categories }) {
  // 모든 경로 계산
  const artifactPaths = useMemo(() => {
    return artifactData.map((data) => {
      const positions = []

      // 시작 위치 (랜덤)
      positions.push(new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, -25))

      // 각 레이어의 해당 카테고리 위치 계산
      layerKeys.forEach((key, layerIndex) => {
        const categoryValue = data[key]
        const categoriesList = categories[key]
        const categoryIndex = categoriesList.indexOf(categoryValue)

        if (categoryIndex !== -1) {
          const cols = Math.ceil(Math.sqrt(categoriesList.length))
          const rows = Math.ceil(categoriesList.length / cols)

          const col = categoryIndex % cols
          const row = Math.floor(categoryIndex / cols)

          const x = (col - (cols - 1) / 2) * 3
          const y = (row - (rows - 1) / 2) * 2.5
          const z = layerIndex * 12 - 18

          positions.push(new THREE.Vector3(x, y, z))
        }
      })

      return {
        curve: new THREE.CatmullRomCurve3(positions),
        color: getColorForCategory(0, data.형태, categories),
        id: data.id,
      }
    })
  }, [categories])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 15, 8]} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* 고정된 경로들 */}
      {artifactPaths.map((path, index) => (
        <ArtifactPath key={`path-${index}`} pathCurve={path.curve} color={path.color} />
      ))}

      {/* 레이어들 */}
      {layerNames.map((name, index) => (
        <Layer
          key={index}
          index={index}
          visible={layerVisibility[index]}
          name={name}
          color={layerColors[index]}
          categories={categories}
        />
      ))}

      {/* 유물들 */}
      {artifactData.map((data, index) => (
        <Artifact
          key={data.id}
          data={data}
          index={index}
          onClick={onArtifactClick}
          categories={categories}
          pathCurve={artifactPaths[index]?.curve}
        />
      ))}

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={50} minDistance={5} />
    </>
  )
}

// 컨트롤 패널 컴포넌트
function Controls({ layerVisibility, setLayerVisibility }) {
  const toggleLayer = (index) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className='absolute top-5 left-5 z-50 bg-black bg-opacity-90 p-5 rounded-lg border border-gray-600 max-w-xs'>
      <h3 className='text-white text-sm font-bold mb-3 mt-0'>레이어 제어</h3>
      {layerNames.map((name, index) => (
        <div key={index} className='flex items-center gap-2 mb-2'>
          <div className='text-white text-xs w-24'>
            Layer {index}: {name}
          </div>
          <button
            className={`px-2 py-1 text-xs border border-gray-500 rounded cursor-pointer transition-colors ${
              layerVisibility[index]
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            onClick={() => toggleLayer(index)}
          >
            {layerVisibility[index] ? '표시' : '숨김'}
          </button>
        </div>
      ))}
    </div>
  )
}

// 범례 컴포넌트
function Legend({ categories }) {
  return (
    <div className='absolute top-5 right-5 z-50 bg-black bg-opacity-90 p-4 rounded-lg border border-gray-600'>
      <h3 className='text-white text-sm font-bold mb-3 mt-0'>범례</h3>
      {layerNames.map((name, index) => (
        <div key={index} className='flex items-center gap-2 mb-1'>
          <div className='w-4 h-4 rounded' style={{ backgroundColor: layerColors[index] }}></div>
          <span className='text-white text-xs'>
            Layer {index}: {name}
          </span>
        </div>
      ))}
      <div className='mt-3 pt-3 border-t border-gray-600'>
        <div className='text-white text-xs mb-1'>
          <strong>총 유물:</strong> {artifactData.length}개
        </div>
        <div className='text-white text-xs'>
          <strong>카테고리:</strong>
          <div className='ml-2 text-gray-300'>
            {layerKeys.map((key, index) => (
              <div key={key}>
                • {key}: {categories[key]?.length || 0}개
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 유물 상세 정보 모달
function ArtifactDetail({ artifact, onClose }) {
  if (!artifact) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-black bg-opacity-95 p-6 rounded-2xl border border-gray-500 max-w-md text-center relative'>
        <button
          className='absolute top-2 right-4 text-white text-2xl bg-transparent border-none cursor-pointer p-1 hover:text-gray-300'
          onClick={onClose}
        >
          ×
        </button>

        <h3 className='text-white text-lg font-bold mb-4'>{artifact.id}</h3>

        <div className='grid grid-cols-1 gap-3 text-sm'>
          <div className='text-gray-300 p-2 bg-gray-800 rounded'>
            <strong>형태:</strong> {artifact.형태}
          </div>
          <div className='text-gray-300 p-2 bg-gray-800 rounded'>
            <strong>재질분류:</strong> {artifact.재질_분류}
          </div>
          <div className='text-gray-300 p-2 bg-gray-800 rounded'>
            <strong>시대:</strong> {artifact.시대}
          </div>
          <div className='text-gray-300 p-2 bg-gray-800 rounded'>
            <strong>용도:</strong> {artifact.용도}
          </div>
        </div>
      </div>
    </div>
  )
}

// 정보 패널 컴포넌트
function InfoPanel() {
  return (
    <div className='absolute bottom-5 left-5 z-50 bg-black bg-opacity-90 p-3 rounded text-white text-xs max-w-xs'>
      <strong>사용법:</strong>
      <br />
      • 마우스 드래그: 화면 회전
      <br />
      • 마우스 휠: 확대/축소
      <br />
      • 우클릭+드래그: 화면 이동
      <br />
      • 유물 클릭: 상세 정보 표시
      <br />• 각 유물은 4개 레이어를 순차 통과합니다
    </div>
  )
}

// 메인 앱 컴포넌트
export default function ArtifactVisualization() {
  const [layerVisibility, setLayerVisibility] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
  })
  const [selectedArtifact, setSelectedArtifact] = useState(null)

  // 카테고리 정의 (실제 데이터에서 동적으로 추출)
  const categories = useMemo(() => extractCategories(artifactData), [])

  const handleArtifactClick = (artifact) => {
    setSelectedArtifact(artifact)
  }

  const closeArtifactDetail = () => {
    setSelectedArtifact(null)
  }

  return (
    <div className='w-full h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden'>
      <Canvas camera={{ position: [0, 8, 25], fov: 75 }} shadows className='w-full h-full'>
        <Scene layerVisibility={layerVisibility} onArtifactClick={handleArtifactClick} categories={categories} />
      </Canvas>

      <Controls layerVisibility={layerVisibility} setLayerVisibility={setLayerVisibility} />

      <Legend categories={categories} />
      <InfoPanel />

      <ArtifactDetail artifact={selectedArtifact} onClose={closeArtifactDetail} />
    </div>
  )
}
