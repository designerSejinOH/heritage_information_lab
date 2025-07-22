'use client'
import { useState, useEffect, useRef } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'

import { TbCheck } from 'react-icons/tb'

interface ListSwiperProps {
  type: string
  className?: string
  items: { id: number; text: string }[]
  setActiveOption?: (option: string) => void
  selectedOption?: string
  onSwiperReselect?: () => void
  currentActiveOption?: string
}

export const ListSwiper = ({
  type,
  className = '',
  items,
  setActiveOption,
  selectedOption,
  onSwiperReselect,
  currentActiveOption,
}: ListSwiperProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef(null)

  // **수정: currentActiveOption이 변경될 때 스와이퍼 인덱스 동기화**
  useEffect(() => {
    if (currentActiveOption && items) {
      const optionIndex = items.findIndex((item) => item.text === currentActiveOption)
      if (optionIndex !== -1 && optionIndex !== activeIndex) {
        setActiveIndex(optionIndex)
        if (swiperRef.current) {
          swiperRef.current.slideToLoop(optionIndex, 500)
        }
      }
    }
  }, [currentActiveOption, items])

  const handleSlideClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index, 1000)
      setActiveIndex(index)
    }
  }

  // 각 슬라이드의 위치에 따른 스타일 계산
  const getSlideStyle = (slideIndex, activeIndex, totalSlides) => {
    let relativePosition = slideIndex - activeIndex

    if (relativePosition > totalSlides / 2) {
      relativePosition -= totalSlides
    } else if (relativePosition < -totalSlides / 2) {
      relativePosition += totalSlides
    }

    const step = Math.abs(relativePosition)
    const translateY = step * 20
    const scale = Math.max(0.7, 1 - step * 0.1)
    const opacity = Math.max(0.3, 1 - step * 0.2)
    const zIndex = Math.max(0, 10 - step)

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  }

  const onSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex)
    if (setActiveOption && items[swiper.realIndex]) {
      setActiveOption(items[swiper.realIndex].text)
    }
    // 선택 완료 후 스와이퍼 움직일 때 재선택 상태로 변경
    if (onSwiperReselect) {
      onSwiperReselect()
    }
  }

  return (
    <div className={`w-full relative overflow-visible ${className}`}>
      <Swiper
        loop={true}
        centeredSlides={true}
        slidesPerView={5}
        spaceBetween={20}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => onSlideChange(swiper)}
        style={{
          width: '100%',
          height: '90%',
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          overflow: 'visible',
        }}
        className='cursor-grab overflow-visible'
        wrapperClass='overflow-visible'
      >
        {items?.map((item, index) => (
          <SwiperSlide
            key={`${item.id}-${index}`}
            onClick={() => handleSlideClick(index)}
            style={{
              ...getSlideStyle(index, activeIndex, items.length),
              height: 'auto',
            }}
            className='overflow-visible'
          >
            <div
              className={`
              w-full aspect-[2/1] border-[1.5px] border-white bg-black text-white h-full relative rounded-2xl overflow-hidden
              cursor-pointer transition-all duration-500
              p-6
              hover:rounded-3xl hover:bg-white hover:text-black transition-all group
              ${index === activeIndex ? 'border-white border-2 shadow-lg' : 'border-gray-500'}
            `}
            >
              <div className='flex flex-col items-start justify-center gap-3 w-full h-full'>
                <span className=' font-medium opacity-70 text-base'>{type}</span>
                <span className=' font-semibold text-2xl'>{item.text}</span>
              </div>
              {item.text === selectedOption && (
                <div className='absolute bottom-4 right-4 z-10 w-auto h-fit p-1 aspect-square text-2xl flex items-center justify-center border-2 border-white group-hover:border-black text-white group-hover:text-black rounded-xl'>
                  <TbCheck />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
