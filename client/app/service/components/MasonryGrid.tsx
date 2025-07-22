'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'

export const MasonryGrid = () => {
  const [imageData, setImageData] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // 실제 이미지 비율로 로드 (성능 최적화)
  useEffect(() => {
    const loadImages = async () => {
      const images = []
      const baseWidth = 280
      const batchSize = 5

      for (let batch = 0; batch < 10; batch++) {
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

  // 컬럼 분배 최적화 - gap 값을 정확히 계산
  const columns = useMemo(() => {
    if (!imagesLoaded) return [[], [], [], [], []]

    const distributeItems = (items, columnCount) => {
      const columns = Array.from({ length: columnCount }, () => [])
      const columnHeights = Array(columnCount).fill(0)

      // 정확한 gap과 마진 계산 (카드 마진 16px + gap 8px)
      const itemSpacing = 24

      items.forEach((item) => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
        columns[shortestColumnIndex].push(item)
        columnHeights[shortestColumnIndex] += item.height + itemSpacing
      })

      return columns
    }

    return distributeItems(imageData, 5)
  }, [imageData, imagesLoaded])

  // 컬럼 높이 계산 함수 수정
  const getColumnHeight = useCallback((columnItems) => {
    const itemSpacing = 24 // 카드 마진(16) + gap(8)
    return columnItems.reduce((total, item) => total + item.height + itemSpacing, 0)
  }, [])

  const MasonryColumn = ({ items, columnIndex }) => {
    const columnHeight = useMemo(() => getColumnHeight(items), [items, getColumnHeight])

    if (columnHeight === 0) return <div className='flex-1'></div>

    // 🔧 수정: 애니메이션 속도를 더 일정하게 만들고 키 안정성 보장
    const baseDuration = 60 // 기본 속도를 약간 늦춤
    const speedVariation = columnIndex * 2 // 변화량을 줄여서 속도 차이 감소

    return (
      <div className='flex-1 relative overflow-hidden' style={{ padding: '16px 0' }}>
        {/* 🔧 수정: 첫 번째 세트 - layoutId 추가로 안정성 보장 */}
        <motion.div
          className='flex flex-col gap-2'
          layoutId={`column-${columnIndex}-set1`}
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: baseDuration + speedVariation,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop', // 명시적 설정
          }}
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden', // 깜빡임 방지
          }}
        >
          {items.map((item) => (
            <ArtifactCard
              key={`col-${columnIndex}-set1-${item.id}`}
              item={item}
              animationKey={`col-${columnIndex}-set1-${item.id}`}
            />
          ))}
        </motion.div>

        {/* 🔧 수정: 두 번째 세트 - 정확한 위치 설정과 layoutId 추가 */}
        <motion.div
          className='flex flex-col gap-2 absolute top-0 left-0 right-0'
          layoutId={`column-${columnIndex}-set2`}
          style={{
            transform: `translateY(${columnHeight + 16}px) translateZ(0)`, // 초기 위치를 더 정확하게
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: baseDuration + speedVariation,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {items.map((item) => (
            <ArtifactCard
              key={`col-${columnIndex}-set2-${item.id}`}
              item={item}
              animationKey={`col-${columnIndex}-set2-${item.id}`}
            />
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
            <MasonryColumn key={`column-${index}`} items={columnItems} columnIndex={index} />
          ))}
        </div>
      )}
    </div>
  )
}

// 🔧 수정: 최적화된 파동 효과를 가진 카드 컴포넌트
const ArtifactCard = ({ item, animationKey }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      key={animationKey}
      className='relative cursor-pointer h-fit flex-shrink-0 rounded-lg shadow-lg bg-white/5 backdrop-blur-sm border border-white/10'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
        padding: '8px',
        margin: '8px',
        backfaceVisibility: 'hidden', // 깜빡임 방지
      }}
      // 🔧 추가: 레이아웃 시프트 방지
      layout={false}
    >
      {/* 호버 효과 최적화 - GPU 가속 활용 */}
      {isHovered && (
        <>
          {/* 메인 글로우 효과 - transform 대신 scale 사용 */}
          <motion.div
            className='absolute rounded-xl pointer-events-none'
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.04, 1.06, 1.04, 1],
              opacity: [0, 0.6, 0.8, 0.6, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              right: '-12px',
              bottom: '-12px',
              zIndex: -1,
              background:
                'radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, rgba(0, 191, 255, 0.3) 40%, rgba(59, 130, 246, 0.2) 70%, transparent 100%)',
              filter: 'blur(1px)',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
            }}
          />

          {/* 파동 링들 - 성능 최적화 */}
          {[
            { delay: 0, scale: [1, 1.03, 1.05, 1.03, 1], color: 'rgba(0, 255, 255, 0.8)', blur: '0 0 12px' },
            { delay: 0.15, scale: [1, 1.02, 1.03, 1.02, 1], color: 'rgba(34, 211, 238, 0.7)', blur: '0 0 10px' },
            { delay: 0.3, scale: [1, 1.01, 1.02, 1.01, 1], color: 'rgba(59, 130, 246, 0.6)', blur: '0 0 8px' },
          ].map((ring, index) => (
            <motion.div
              key={`ring-${index}`}
              className='absolute rounded-xl border-2 pointer-events-none'
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: ring.scale,
                opacity: [0, 0.8, 1, 0.8, 0],
              }}
              transition={{
                duration: 1.1 + index * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: ring.delay,
              }}
              style={{
                position: 'absolute',
                top: `-${4 + index * 2}px`,
                left: `-${4 + index * 2}px`,
                right: `-${4 + index * 2}px`,
                bottom: `-${4 + index * 2}px`,
                zIndex: -1,
                borderColor: ring.color,
                boxShadow: `${ring.blur} ${ring.color}`,
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
              }}
            />
          ))}
        </>
      )}

      <div className='relative overflow-hidden h-full'>
        <img
          src={item.src}
          alt={item.alt}
          className='w-full h-auto object-cover hover:opacity-80 transition-opacity duration-300'
          loading='lazy'
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden', // 깜빡임 방지
          }}
        />
      </div>
    </motion.div>
  )
}
