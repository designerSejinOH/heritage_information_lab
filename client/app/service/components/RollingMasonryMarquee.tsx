import classNames from 'classnames'
import { Marquee } from '@/components'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const RollingMasonryMarquee = () => {
  const images = Array.from({ length: 25 }, (_, i) => `img/masonry/img-${i + 1}.jpeg`)

  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  if (!isClient) return null

  // 이미지를 5개 칼럼으로 균등 분배
  const distributeImages = (imageArray, columns) => {
    const distributed = Array.from({ length: columns }, () => [])
    imageArray.forEach((img, index) => {
      distributed[index % columns].push(img)
    })
    return distributed
  }

  const columnImages = distributeImages(images, 5)
  return (
    <div className='relative flex h-full flex-row items-center justify-center overflow-hidden px-4'>
      <Marquee vertical className='[--duration:20s]'>
        {columnImages[0].map((img) => (
          <ArtifactCard key={img} item={img} />
        ))}
      </Marquee>
      <Marquee reverse vertical className='[--duration:20s]'>
        {columnImages[1].map((img) => (
          <ArtifactCard key={img} item={img} />
        ))}
      </Marquee>
      <Marquee vertical className='[--duration:20s]'>
        {columnImages[2].map((img) => (
          <ArtifactCard key={img} item={img} />
        ))}
      </Marquee>
      <Marquee reverse vertical className='[--duration:20s]'>
        {columnImages[3].map((img) => (
          <ArtifactCard key={img} item={img} />
        ))}
      </Marquee>
      <Marquee vertical className='[--duration:20s]'>
        {columnImages[4].map((img) => (
          <ArtifactCard key={img} item={img} />
        ))}
      </Marquee>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black dark:from-transparent'></div>
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black dark:from-transparent'></div>
    </div>
  )
}

// 🔧 수정: 최적화된 파동 효과를 가진 카드 컴포넌트
const ArtifactCard = ({ item, key }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      key={key}
      className='relative cursor-pointer h-fit flex-shrink-0 shadow-lg'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
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
            className='absolute pointer-events-none'
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
              className='absolute border-2 pointer-events-none'
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
          src={item}
          alt={item}
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
