'use client'

import { Header } from './components'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

import { list } from './list'

// 필터 옵션들
const filterOptions = {
  형태: ['원형', '원기둥형', '삼각형', '사각형', '인물형', '기하학형', '동물형'],
  재질: ['금속', '흙', '도자기', '돌', '옥/유리', '지류', '나무', '칠기', '복합재질', '합성재질'],
  시대: [
    '구석기',
    '신석기',
    '청동기',
    '철기',
    '초기철기',
    '원삼국',
    '낙랑',
    '고구려',
    '백제',
    '신라',
    '가야',
    '통일신라',
    '발해',
    '고려',
    '조선',
    '대한제국',
    '일제강점',
    '광복이후',
  ],
  용도: [
    '의생활',
    '식생활',
    '주생활',
    '산업/생업',
    '교통/통신',
    '전통과학',
    '사회생활',
    '종교신앙',
    '문화예술',
    '군사',
    '보건의료',
    '과학기술',
    '미디어',
    '기타',
  ],
}

const filterKeys = Object.keys(filterOptions)

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState({
    형태: null,
    재질: null,
    시대: null,
    용도: null,
  })
  const [currentActiveOption, setCurrentActiveOption] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)

  // 새로 추가된 상태들
  const [isLoading, setIsLoading] = useState(false)
  const [showGeneratedContent, setShowGeneratedContent] = useState(false)

  // 진행률 계산
  const selectedCount = Object.values(selectedFilters).filter((v) => v !== null).length
  const progress = (selectedCount / 4) * 100

  // 현재 단계의 필터 키
  const currentFilterKey = filterKeys[currentStep]

  // **수정: currentActiveOption 초기값 설정**
  // 현재 단계가 변경될 때 이미 선택된 옵션이 있다면 설정
  useEffect(() => {
    const currentSelected = selectedFilters[currentFilterKey]
    if (currentSelected && currentActiveOption !== currentSelected) {
      setCurrentActiveOption(currentSelected)
    } else if (!currentSelected && currentActiveOption) {
      // 현재 단계에 선택된 값이 없으면 null로 설정
      setCurrentActiveOption(null)
    }
  }, [currentStep, currentFilterKey, selectedFilters])

  // 선택 완료 처리
  const handleSelectComplete = () => {
    if (!currentActiveOption) return

    // 로딩 상태 시작
    setIsLoading(true)
    setShowGeneratedContent(false)

    // 현재 선택된 옵션을 필터 상태에 저장
    setSelectedFilters((prev) => ({
      ...prev,
      [currentFilterKey]: currentActiveOption,
    }))

    // 로딩 모션 시뮬레이션 (1.5초)
    setTimeout(() => {
      setIsLoading(false)
      setShowGeneratedContent(true)
      setIsSelecting(true)

      // 생성된 콘텐츠 표시 후 다음 단계 버튼 표시 (0.5초 후)
      setTimeout(() => {
        setShowNextButton(true)
      }, 500)
    }, 1500)
  }

  // 다음 단계로 이동
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
      // **수정: 다음 단계의 이미 선택된 값이 있다면 설정, 없으면 null**
      const nextFilterKey = filterKeys[currentStep + 1]
      setCurrentActiveOption(selectedFilters[nextFilterKey] || null)
      setIsSelecting(false)
      setShowNextButton(false)
      setShowGeneratedContent(false)
      setIsLoading(false)
    } else {
      // 마지막 단계에서는 생성 모달 표시
      setShowModal(true)
      setIsGenerating(true)
      setGenerationComplete(false)

      // 3초 후 생성 완료
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationComplete(true)
      }, 3000)
    }
  }

  // 스와이퍼 재선택 시 상태 초기화
  const handleSwiperReselect = () => {
    if (isSelecting || showNextButton) {
      setIsSelecting(false)
      setShowNextButton(false)
      setShowGeneratedContent(false)
      setIsLoading(false)
      // 현재 단계의 필터 값도 초기화
      setSelectedFilters((prev) => ({
        ...prev,
        [currentFilterKey]: null,
      }))
    }
  }

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false)
    setIsGenerating(false)
    setGenerationComplete(false)
  }

  // 이전 단계로 이동
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      // **수정: 이전 단계의 선택된 값으로 설정**
      const prevFilterKey = filterKeys[currentStep - 1]
      setCurrentActiveOption(selectedFilters[prevFilterKey] || null)
      setIsSelecting(false)
      setShowNextButton(false)
      setShowGeneratedContent(false)
      setIsLoading(false)
    }
  }

  return (
    <div className='relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden gap-8'>
      <Header />

      <div className='w-fit h-[10vh] flex flex-col items-center justify-center gap-4 pt-10'>
        {/* 단계 표시 */}
        <div className='w-fit h-fit flex flex-row items-center justify-center bg-white rounded-full relative'>
          <div
            className='absolute z-0 left-0 top-0 w-1/4 h-full p-2 transition-all duration-500'
            style={{ transform: `translateX(${currentStep * 100}%)` }}
          >
            <div className='w-full h-full bg-black rounded-full flex items-center justify-center'></div>
          </div>

          {filterKeys.map((filter, i) => (
            <div
              key={i}
              className={`w-1/4 z-20 p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                i === currentStep ? 'text-white' : 'text-black'
              }`}
              style={{ mixBlendMode: i === currentStep ? 'difference' : 'normal' }}
            >
              <span className='text-sm min-w-16 text-center font-bold'>{filter}</span>
            </div>
          ))}
        </div>
      </div>

      <StepSection
        currentStep={currentStep}
        currentFilterKey={currentFilterKey}
        currentActiveOption={currentActiveOption}
        setCurrentActiveOption={setCurrentActiveOption}
        isSelecting={isSelecting}
        selectedFilters={selectedFilters} // **수정: 필터링 제거, 기본 selectedFilters만 전달**
        onSwiperReselect={handleSwiperReselect}
        isLoading={isLoading}
        showGeneratedContent={showGeneratedContent}
      />

      {/* 하단 버튼 영역 */}
      <div className='w-fit min-w-[70vw] px-12 py-8 h-[24vh] flex flex-col justify-center items-center p-4 gap-4 bg-white/10 rounded-t-lg'>
        <div className='w-full flex-1 h-fit flex items-center justify-center text-white text-2xl font-bold'>
          <div className='w-60 h-12 flex flex-row items-center justify-center gap-2'>
            {isLoading ? (
              <div className='animate-pulse text-blue-400'>
                <span>AI Generating...</span>
              </div>
            ) : isSelecting ? (
              <div className='animate-pulse'>
                <span className='text-green-400'>✓</span> {currentActiveOption} 선택됨
              </div>
            ) : (
              <span className='text-gray-400'>{currentActiveOption || '없음'}</span>
            )}
          </div>
        </div>

        <div className='w-fit h-fit flex flex-row items-center justify-center gap-4 relative'>
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className={`w-fit h-fit flex text-white text-lg border border-white/50 rounded-lg px-4 py-2 transition-all duration-300 ${
              currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            이전 단계
          </button>

          <button
            onClick={handleSelectComplete}
            disabled={!currentActiveOption || isSelecting || isLoading}
            className={`w-60 h-fit flex justify-center items-center text-white text-3xl border border-white/50 rounded-lg px-4 py-2 transition-all duration-300 ${
              !currentActiveOption || isSelecting || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            {isLoading ? '생성 중...' : '선택 완료'}
          </button>

          <button
            onClick={handleNextStep}
            className={`w-fit h-fit flex text-white text-lg border border-white/50 rounded-lg px-4 py-2 transition-all duration-300 ${
              showNextButton ? 'opacity-100 hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {currentStep === 3 ? '생성하기' : '다음으로'}
          </button>
        </div>
        <div className='w-40 h-1 bg-white/20 overflow-hidden'>
          <div className='h-full bg-white transition-all duration-300' style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* 생성 모달 */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-end justify-center bg-black/50'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full h-[calc(100vh-4rem)] border border-white/20'>
            <button
              onClick={handleCloseModal}
              className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            {/* 로딩 애니메이션 */}
            {isGenerating && (
              <>
                <div className='flex flex-col items-center gap-4 mb-6'>
                  <div className='relative'>
                    <div className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
                    <div className='absolute inset-0 w-16 h-16 border-4 border-transparent border-l-blue-400 rounded-full animate-spin animation-delay-150'></div>
                  </div>
                  <p className='text-white/80 animate-pulse'>AI가 당신만의 문화재를 생성하고 있습니다...</p>
                </div>
                {/* 선택된 필터 표시 */}
                <div className='mb-6 space-y-3'>
                  {Object.entries(selectedFilters).map(([key, value]) => (
                    <div key={key} className='flex justify-between items-center text-white'>
                      <span className='font-medium'>{key}:</span>
                      <span className='text-blue-300'>{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 생성 완료 메시지 */}
            {generationComplete && (
              <div className='w-full h-full flex flex-col gap-6 pt-6'>
                {/* Search Bar */}
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='유물을 검색해보세요...'
                    className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none'
                  />
                  <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  </button>
                </div>

                {/* Main 3D View */}
                <div className='w-full flex flex-col gap-6 w-full h-full'>
                  <div className='w-full h-[55%] flex flex-row gap-6'>
                    <main className='w-auto h-full aspect-square bg-gray-900/20 backdrop-blur-sm rounded-lg border border-gray-700 relative overflow-hidden'>
                      {/* 선택된 옵션 조합으로 되어있는 폴더에 이미지 접근 */}
                      <img
                        src={`/flow/${selectedFilters.형태}+${selectedFilters.재질}+${selectedFilters.시대}+${selectedFilters.용도}/result.jpeg`}
                        alt='Generated Artifact'
                        className='w-full h-full object-cover rounded-lg'
                      />
                    </main>

                    {/* Right Panel */}
                    <aside className='w-full bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 overflow-y-auto'>
                      <h2 className='text-white text-xl font-semibold mb-4'>정보</h2>

                      <div className='space-y-6'>
                        {/* 유물 기본 정보 */}
                        <div>
                          <h3 className='text-white text-lg mb-3'>생성된 유물 정보</h3>
                          <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>이름:</span>
                              <span className='text-white'>금제 관모</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>시대:</span>
                              <span className='text-white'>백제</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>재질:</span>
                              <span className='text-white'>금</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>크기:</span>
                              <span className='text-white'>높이 15cm</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                  <div className='w-full h-[30%] flex flex-row items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6'>
                    {/* 더미 카드 좌우 스크롤 */}
                    <div className='w-[50vw] overflow-x-scroll flex items-center gap-4'>
                      {/* 카드 예시 */}
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 1</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 2</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 3</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 4</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 5</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 6</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 7</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                    </div>
                    <div className='flex-1 h-full flex justify-center items-center gap-4 p-4'></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const Foo = dynamic(() => import('./components/Foo').then((mod) => mod.Foo), { ssr: false })

const StepSection = ({
  currentStep,
  currentFilterKey,
  currentActiveOption,
  setCurrentActiveOption,
  isSelecting,
  selectedFilters,
  onSwiperReselect,
  isLoading,
  showGeneratedContent,
}) => {
  const artifacts = list

  return (
    <div className='w-full h-[70vh] flex flex-col items-center justify-between gap-10'>
      {/* 상단 컨텐츠 영역 */}
      <div className='w-auto h-full aspect-square relative overflow-hidden bg-white/10 rounded-lg flex items-center justify-center'>
        {/* 로딩 상태 */}
        {isLoading && (
          <div className='text-white text-center'>
            <div className='flex flex-col items-center gap-4'>
              {/* AI 로딩 애니메이션 */}
              <div className='relative'>
                <div className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
                <div
                  className='absolute inset-0 w-16 h-16 border-4 border-transparent border-l-blue-400 rounded-full animate-spin'
                  style={{ animationDelay: '0.15s' }}
                ></div>
                <div
                  className='absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400 rounded-full animate-spin'
                  style={{ animationDelay: '0.3s' }}
                ></div>
              </div>
              <div className='text-lg font-bold animate-pulse'>Generating...</div>
              <div className='text-sm text-gray-300 animate-pulse'>
                {currentFilterKey}: {currentActiveOption}
              </div>
            </div>
          </div>
        )}

        {/* 생성된 콘텐츠 */}
        {showGeneratedContent && (
          <>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
              className='absolute z-10 bottom-4 left-1/2 -translate-x-1/2 w-fit  h-fit flex flex-col p-4 backdrop-blur-sm bg-black/20 rounded-lg flex items-center justify-center'
            >
              <h3 className='text-xl font-bold mb-2'>생성 완료!</h3>
              <div className='text-sm opacity-80 text-nowrap'>AI가 생성한 {currentFilterKey} 결과입니다</div>
            </motion.div>
            <img
              src={`/flow/${currentActiveOption}.jpeg`}
              alt={currentActiveOption}
              className='w-full h-full object-cover rounded-lg'
            />
          </>
        )}

        {/* 기본 상태 - Foo 컴포넌트 (필터링 없이 초기 상태만) */}
        {!isLoading && !showGeneratedContent && (
          <div
            className={`w-full h-full text-white text-center transition-all duration-1000 ${
              isSelecting ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
            }`}
          >
            {/* **수정: 필터링 제거, 초기 상태만 표시** */}
            <Foo className='w-full h-full' artifacts={artifacts} selectedFilters={{}} />

            {/* 현재 활성화된 옵션 */}
            {currentActiveOption && (
              <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-blue-400'>
                현재 선택된 옵션: {currentActiveOption}
              </div>
            )}

            {isSelecting && (
              <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-green-400 animate-bounce'>
                선택 완료!
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 스와이퍼 영역 */}
      <div className='w-full h-32 flex flex-col mb-10 items-center justify-center gap-5'>
        <ListSwiper
          items={filterOptions[currentFilterKey]?.map((item, index) => ({
            id: index,
            text: item,
            src: `/images/${item.toLowerCase()}.jpg`,
            alt: item,
          }))}
          setActiveOption={setCurrentActiveOption}
          selectedOption={selectedFilters[currentFilterKey]}
          onSwiperReselect={onSwiperReselect}
          currentActiveOption={currentActiveOption}
        />
      </div>
    </div>
  )
}

const ListSwiper = ({ items, setActiveOption, selectedOption, onSwiperReselect, currentActiveOption }) => {
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
    <div className='relative w-full h-full overflow-visible'>
      <Swiper
        loop={true}
        centeredSlides={true}
        slidesPerView={5}
        spaceBetween={20}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => onSlideChange(swiper)}
        style={{
          width: '100%',
          height: '100%',
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
              w-full aspect-video border h-full relative rounded-lg overflow-hidden
              cursor-pointer transition-all duration-500
              ${index === activeIndex ? 'border-white border-2 shadow-lg' : 'border-gray-500'}
            `}
            >
              <div className='w-full h-full flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>{item.text}</span>
              </div>
              <span className='absolute top-2 left-2 z-10 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm'>
                {item.text}
              </span>
              {item.text === selectedOption && (
                <div className='absolute top-2 right-2 z-10 text-green-400 bg-black bg-opacity-50 px-2 py-1 rounded text-sm'>
                  ✓
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
