'use client'

import { AliasButton } from '@/components'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const handleButtonClick = () => {
    router.push('/service/explore')
  }
  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden'>
        <motion.div className='absolute w-full px-5 inset-0 z-0 bg-black opacity-50'>
          <MasonryMarqueeGrid />
        </motion.div>
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-fit w-fit flex-col items-center justify-end p-12'>
          <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-40' />
          <h1 className='mb-4 text-6xl font-bold'>눈으로 보는 유물의 길</h1>
          <AliasButton onClick={handleButtonClick} preset='black' text='어떤 유물을 찾아볼까?' />
        </div>
      </div>
    </>
  )
}

const MasonryMarqueeGrid = () => {
  const [imageData, setImageData] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // 이미지 로드 및 비율 계산
  useEffect(() => {
    const loadImages = async () => {
      const images = []
      const baseWidth = 320 // 기본 너비 설정

      for (let i = 1; i <= 50; i++) {
        const img = typeof window !== 'undefined' ? new window.Image() : null
        const imagePath = `/img/masonry/img-${i}.jpeg`

        try {
          await new Promise((resolve, reject) => {
            if (!img) return reject()
            img.onload = resolve
            img.onerror = reject
            img.src = imagePath
          })

          // 이미지 비율에 맞게 높이 계산
          const aspectRatio = img.naturalHeight / img.naturalWidth
          const calculatedHeight = baseWidth * aspectRatio

          images.push({
            id: i,
            src: imagePath,
            width: baseWidth,
            height: calculatedHeight,
            aspectRatio,
            alt: `Image ${i}`,
          })
        } catch (error) {
          console.log(`Image ${i} not found, skipping...`)
        }
      }

      setImageData(images)
      setImagesLoaded(true)
    }

    loadImages()
  }, [])

  // 컬럼별로 아이템 분배 (이미지 높이 기반)
  const distributeItems = (items, columnCount) => {
    const columns = Array.from({ length: columnCount }, () => [])
    const columnHeights = Array(columnCount).fill(0)

    items.forEach((item) => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
      columns[shortestColumnIndex].push(item)
      columnHeights[shortestColumnIndex] += item.height + 16 // gap 고려
    })

    return columns
  }

  const columns = imagesLoaded ? distributeItems(imageData, 4) : [[], [], [], []]

  // 각 컬럼의 총 높이 계산
  const getColumnHeight = (columnItems) => {
    return columnItems.reduce((total, item) => total + item.height + 16, 0)
  }

  const MasonryColumn = ({ items, columnIndex }) => {
    const columnHeight = getColumnHeight(items)

    if (columnHeight === 0) return <div className='flex-1'></div>

    return (
      <div className='flex-1 relative overflow-hidden'>
        {/* 첫 번째 세트 */}
        <motion.div
          className='flex flex-col gap-5'
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: 60 + columnIndex * 8, // 기존 30에서 60으로, 4에서 8로 증가
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {items.map((item) => (
            <motion.div
              key={`set1-${item.id}`}
              className='relative overflow-hidden h-fit flex-shrink-0'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img src={item.src} alt={item.alt} className='w-full h-auto object-cover' />
            </motion.div>
          ))}
        </motion.div>

        {/* 두 번째 세트 */}
        <motion.div
          className='flex flex-col gap-5'
          style={{ position: 'absolute', top: `${columnHeight}px` }}
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: 60 + columnIndex * 8, // 동일한 속도로 수정
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {items.map((item) => (
            <motion.div
              key={`set2-${item.id}`}
              className='relative overflow-hidden h-fit flex-shrink-0'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img src={item.src} alt={item.alt} className='w-full h-auto object-cover' />
            </motion.div>
          ))}
        </motion.div>

        {/* 세 번째 세트 */}
        <motion.div
          className='flex flex-col gap-5'
          style={{ position: 'absolute', top: `${columnHeight * 2}px` }}
          animate={{
            y: [0, -columnHeight],
          }}
          transition={{
            duration: 60 + columnIndex * 8, // 동일한 속도로 수정
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {items.map((item) => (
            <motion.div
              key={`set3-${item.id}`}
              className='relative overflow-hidden h-fit flex-shrink-0'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img src={item.src} alt={item.alt} className='w-full h-auto object-cover' />
            </motion.div>
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
        <div className='flex gap-6 h-screen overflow-hidden'>
          {columns.map((columnItems, index) => (
            <MasonryColumn key={index} items={columnItems} columnIndex={index} />
          ))}
        </div>
      )}
    </div>
  )
}
