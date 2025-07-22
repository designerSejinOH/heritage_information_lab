'use client'

import { Controls, Header, StepSection, SuccessModal, StepIndicator, Foo, ListSwiper } from './components'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { list } from './list'
import { filterOptions, filterKeys } from './filterOptions'
import classNames from 'classnames'

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
    <div className='relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden'>
      <Header>
        <div className='w-[20vw] h-fit grid grid-cols-2 gap-4 bg-white/10 p-4 rounded-xl'>
          {filterKeys.map((key) => (
            <div key={key} className='w-full h-fit flex  items-center gap-2'>
              <span className=' pr-4 text-sm font-medium text-white'>{key}</span>
              <span className='text-sm text-gray-300'>{selectedFilters[key] || '-'}</span>
            </div>
          ))}
        </div>
      </Header>
      <Foo
        className='absolute top-0 left-0 w-full h-full pointer-events-none bg-black/10'
        artifacts={list}
        selectedFilters={{}}
      />

      {/* 상단 컨텐츠 영역 */}
      <StepSection
        className='h-[64vh] p-6'
        filterKeys={filterKeys}
        currentStep={currentStep}
        currentFilterKey={currentFilterKey}
        currentActiveOption={currentActiveOption}
        isSelecting={isSelecting}
        isLoading={isLoading}
        showGeneratedContent={showGeneratedContent}
      />

      {/* 하단 스와이퍼 영역 */}
      <ListSwiper
        type={currentFilterKey}
        className='h-[20vh] p-6'
        items={filterOptions[currentFilterKey]?.map((item, index) => ({
          id: index,
          text: item,
          src: `/images/${item.toLowerCase()}.jpg`,
          alt: item,
        }))}
        setActiveOption={setCurrentActiveOption}
        selectedOption={selectedFilters[currentFilterKey]}
        onSwiperReselect={handleSwiperReselect}
        currentActiveOption={currentActiveOption}
      />

      {/* 하단 버튼 영역 */}
      <Controls
        className='h-[16vh] p-6'
        isLoading={isLoading}
        isSelecting={isSelecting}
        currentActiveOption={currentActiveOption}
        currentStep={currentStep}
        handlePrevStep={handlePrevStep}
        handleNextStep={handleNextStep}
        handleSelectComplete={handleSelectComplete}
        showNextButton={showNextButton}
        progress={progress}
      />

      <div className='fixed bottom-0 left-0 z-10 w-full h-1 bg-white/20 overflow-hidden'>
        <div className='h-full bg-white transition-all duration-300' style={{ width: `${progress}%` }}></div>
      </div>

      {/* 생성 모달 */}
      <SuccessModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        isGenerating={isGenerating}
        generationComplete={generationComplete}
        selectedFilters={selectedFilters}
      />
    </div>
  )
}
