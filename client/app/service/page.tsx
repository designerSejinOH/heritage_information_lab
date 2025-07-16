'use client'

import { AliasButton } from '@/components'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState, useMemo, useCallback } from 'react'

export default function Page() {
  const router = useRouter()
  const handleButtonClick = useCallback(() => {
    router.push('/service/demo')
  }, [router])

  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden'>
        <motion.div className='absolute w-full px-4 inset-0 z-0 bg-black opacity-50'>
          <MasonryMarqueeGrid />
        </motion.div>
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-fit w-fit flex-col items-center justify-end p-12'>
          <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-40' />
          <h1 className='mb-4 text-6xl font-bold text-white'>눈으로 보는 유물의 길</h1>
          <AliasButton onClick={handleButtonClick} preset='black' text='어떤 유물을 찾아볼까?' />
        </div>
      </div>
    </>
  )
}

// 최적화된 파동 효과를 가진 카드 컴포넌트
const ArtifactCard = ({ item, animationKey }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      key={animationKey}
      className='relative cursor-pointer h-fit flex-shrink-0 rounded-lg shadow-lg bg-white/5 backdrop-blur-sm border border-white/10'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: 'translateZ(0)', // 하드웨어 가속
        willChange: 'transform',
        padding: '8px', // 글로우 효과가 잘리지 않도록 패딩 추가
        margin: '8px', // 주변 여백 확보
      }}
    >
      {/* 최적화된 파동 효과 - 핵심 효과만 유지 */}
      {isHovered && (
        <>
          {/* 메인 글로우 효과 */}
          <motion.div
            className='absolute rounded-xl pointer-events-none'
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.06, 1.1, 1.06, 1],
              opacity: [0, 0.7, 0.9, 0.7, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: '-16px',
              left: '-16px',
              right: '-16px',
              bottom: '-16px',
              zIndex: -1,
              background:
                'radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, rgba(0, 191, 255, 0.4) 40%, rgba(59, 130, 246, 0.3) 70%, transparent 100%)',
              filter: 'blur(1px)',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
            }}
          />

          {/* 첫 번째 파동 링 */}
          <motion.div
            className='absolute rounded-xl border-2 pointer-events-none'
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.04, 1.08, 1.04, 1],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              zIndex: -1,
              borderColor: 'rgba(0, 255, 255, 0.9)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
            }}
          />

          {/* 두 번째 파동 링 */}
          <motion.div
            className='absolute rounded-xl border-2 pointer-events-none'
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.02, 1.04, 1.02, 1],
              opacity: [0, 0.8, 0.9, 0.8, 0],
            }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            style={{
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              zIndex: -1,
              borderColor: 'rgba(34, 211, 238, 0.8)',

              boxShadow: '0 0 12px rgba(34, 211, 238, 0.7)',
            }}
          />

          {/* 세 번째 파동 링 */}
          <motion.div
            className='absolute rounded-lg border pointer-events-none'
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.01, 1.02, 1.01, 1],
              opacity: [0, 0.7, 0.8, 0.7, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            style={{
              top: '0px',
              left: '0px',
              right: '0px',
              bottom: '0px',
              zIndex: -1,
              borderColor: 'rgba(59, 130, 246, 0.7)',
              borderWidth: '4px',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)',
            }}
          />
        </>
      )}

      <div className='relative overflow-hidden rounded-lg h-full'>
        <img
          src={item.src}
          alt={item.alt}
          className='w-full h-auto object-cover hover:opacity-80 transition-opacity duration-300'
          loading='lazy'
          style={{
            transform: 'translateZ(0)',
          }}
        />
      </div>
    </motion.div>
  )
}

const MasonryMarqueeGrid = () => {
  const [imageData, setImageData] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // 실제 이미지 비율로 로드 (성능 최적화)
  useEffect(() => {
    const loadImages = async () => {
      const images = []
      const baseWidth = 280
      const batchSize = 5 // 배치로 로드하여 성능 개선

      // 이미지를 배치로 나누어 로드
      for (let batch = 0; batch < 10; batch++) {
        // 총 50개를 10배치로
        const batchPromises = []

        for (let i = 1; i <= batchSize; i++) {
          const imageIndex = batch * batchSize + i
          if (imageIndex > 50) break

          const imagePath = `/img/masonry/img-${imageIndex}.jpeg`

          const promise = new Promise((resolve) => {
            if (typeof window !== 'undefined') {
              const img = new window.Image()
              img.onload = () => {
                const aspectRatio = img.naturalHeight / img.naturalWidth
                const calculatedHeight = baseWidth * aspectRatio

                resolve({
                  id: imageIndex,
                  src: imagePath,
                  width: baseWidth,
                  height: calculatedHeight,
                  aspectRatio,
                  alt: `유물 ${imageIndex}`,
                })
              }
              img.onerror = () => {
                // 에러 시 기본 비율 사용
                const defaultRatio = 1.2
                resolve({
                  id: imageIndex,
                  src: imagePath,
                  width: baseWidth,
                  height: baseWidth * defaultRatio,
                  aspectRatio: defaultRatio,
                  alt: `유물 ${imageIndex}`,
                })
              }
              img.src = imagePath
            } else {
              resolve(null)
            }
          })

          batchPromises.push(promise)
        }

        const batchResults = await Promise.all(batchPromises)
        images.push(...batchResults.filter(Boolean))
      }

      setImageData(images)
      setImagesLoaded(true)
    }

    loadImages()
  }, [])

  // 컬럼 분배 최적화
  const columns = useMemo(() => {
    if (!imagesLoaded) return [[], [], [], [], []]

    const distributeItems = (items, columnCount) => {
      const columns = Array.from({ length: columnCount }, () => [])
      const columnHeights = Array(columnCount).fill(0)

      items.forEach((item) => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
        columns[shortestColumnIndex].push(item)
        columnHeights[shortestColumnIndex] += item.height + 18 // 카드 마진 + gap
      })

      return columns
    }

    return distributeItems(imageData, 5)
  }, [imageData, imagesLoaded])

  const getColumnHeight = useCallback((columnItems) => {
    return columnItems.reduce((total, item) => total + item.height + 18, 0) // 카드 마진(8*2) + gap(2) = 18
  }, [])

  const MasonryColumn = ({ items, columnIndex }) => {
    const columnHeight = useMemo(() => getColumnHeight(items), [items, getColumnHeight])

    if (columnHeight === 0) return <div className='flex-1'></div>

    // 애니메이션 속도 최적화
    const baseDuration = 50
    const speedVariation = columnIndex * 4

    return (
      <div className='flex-1 relative overflow-visible' style={{ padding: '16px 0' }}>
        {/* 첫 번째 세트 */}
        <motion.div
          className='flex flex-col gap-2'
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: baseDuration + speedVariation,
            ease: 'linear',
            repeat: Infinity,
          }}
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          {items.map((item) => (
            <ArtifactCard key={`set1-${item.id}`} item={item} animationKey={`set1-${item.id}`} />
          ))}
        </motion.div>

        {/* 두 번째 세트 */}
        <motion.div
          className='flex flex-col gap-2 absolute'
          style={{
            top: `${columnHeight}px`,
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: baseDuration + speedVariation,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {items.map((item) => (
            <ArtifactCard key={`set2-${item.id}`} item={item} animationKey={`set2-${item.id}`} />
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className='w-full mx-auto'>
      {!imagesLoaded ? (
        <div className='flex justify-center items-center h-dvh'>
          <div className='text-white text-xl'>유물 데이터 로딩 중...</div>
        </div>
      ) : (
        <div className='flex gap-5 h-screen overflow-hidden px-2'>
          {columns.map((columnItems, index) => (
            <MasonryColumn key={index} items={columnItems} columnIndex={index} />
          ))}
        </div>
      )}
    </div>
  )
}
