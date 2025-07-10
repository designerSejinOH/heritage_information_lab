'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Icon, Loading } from '@/components'
import { list } from './list'
import { useRouter } from 'next/navigation'

// 필터 옵션들
const filterOptions = {
  형태: ['원형', '원기둥형', '삼각형', '사각형', '인물형', '기하학형', '동물형'],
  재질_분류: ['금속', '흙', '도자기', '돌', '옥/유리', '지류', '나무', '칠기', '복합재질', '합성재질'],
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

// 로딩 스피너 컴포넌트
function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>
        <div className='w-8 h-8 border-4 border-blue-200 rounded-full animate-spin'></div>
        <div className='absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-blue-500 rounded-full animate-spin'></div>
      </div>
    </div>
  )
}

// 스크롤 인디케이터 컴포넌트
function ScrollIndicator({ scrollContainerRef }) {
  const [scrollState, setScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
    scrollPercentage: 0,
  })

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const canScrollUp = scrollTop > 0
      const canScrollDown = scrollTop < scrollHeight - clientHeight
      const scrollPercentage = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0

      setScrollState({
        canScrollUp,
        canScrollDown,
        scrollPercentage,
      })
    }

    // 초기 상태 설정
    updateScrollState()

    // 스크롤 이벤트 리스너 추가
    container.addEventListener('scroll', updateScrollState)

    // ResizeObserver로 컨텐츠 크기 변화 감지
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [scrollContainerRef])

  return (
    <>
      {/* 상단 그라데이션 오버레이 */}
      {scrollState.canScrollUp && (
        <div className='absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10 rounded-t-lg'>
          <div className='absolute top-2 left-1/2 transform -translate-x-1/2 text-white/60 text-xs animate-bounce'>
            ↑ 위로 스크롤
          </div>
        </div>
      )}

      {/* 하단 그라데이션 오버레이 */}
      {scrollState.canScrollDown && (
        <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10 rounded-b-lg'>
          <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/60 text-xs animate-bounce'>
            ↓ 아래로 스크롤
          </div>
        </div>
      )}

      {/* 사이드 스크롤바 인디케이터 */}
      {(scrollState.canScrollUp || scrollState.canScrollDown) && (
        <div className='absolute right-2 top-4 bottom-4 w-1 bg-gray-700/50 rounded-full'>
          <div
            className='w-full bg-blue-500 rounded-full transition-all duration-300'
            style={{
              height: '20%',
              transform: `translateY(${scrollState.scrollPercentage * 4}%)`,
            }}
          />
        </div>
      )}

      {/* 전체 진행률 표시 */}
      {(scrollState.canScrollUp || scrollState.canScrollDown) && (
        <div className='absolute top-2 right-8 text-xs text-white/60'>{Math.round(scrollState.scrollPercentage)}%</div>
      )}
    </>
  )
}

// 필터 단계 컴포넌트 - 로딩 제거
function FilterStep({ step, options, selected, onSelect, filterType, stepRef }) {
  const stepNames = {
    형태: '형태',
    재질_분류: '재질',
    시대: '시대',
    용도: '용도',
  }

  return (
    <div
      ref={stepRef}
      className='p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 transition-all duration-300 snap-start'
    >
      <h3 className='text-lg font-semibold mb-3 text-white'>
        {step + 1}. {stepNames[filterType]} 필터링
      </h3>
      <div className='h-fit'>
        <div className='space-y-2'>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className='w-full flex flex-row justify-between items-center text-left px-3 py-2 transition-colors duration-200 text-sm hover:bg-white/10'
            >
              {option}
              <input
                type='checkbox'
                checked={selected === option}
                onChange={() => onSelect(option)}
                className='ml-2 h-4 w-4 accent-blue-500'
              />
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <div className='mt-3 p-2 bg-green-100 rounded text-xs text-green-800'>
          선택됨: <span className='font-medium'>{selected}</span>
        </div>
      )}
    </div>
  )
}

// AI 생성 이미지 레이어 섹션
function AIGenerationSection({ selectedFilters, loadingFilters }) {
  const isAnyLoading = loadingFilters.size > 0

  // AI 로딩 모션 컴포넌트 - 3D 구체 애니메이션
  const AILoadingMotion = () => (
    <div className='flex flex-col items-center justify-center h-fit gap-4'>
      <div className='relative'>
        <Loading />
      </div>

      <div className='text-center'>
        <div className='text-white font-medium mb-1'>AI가 이미지를 생성중입니다</div>
        <div className='text-blue-300 text-sm animate-pulse'>
          {loadingFilters.size > 0 && (
            <div className='space-y-1'>
              {Array.from(loadingFilters).map((filterType) => (
                <div key={filterType as string}>
                  {(filterType === '재질_분류' ? '재질' : String(filterType)) + ' 필터를 분석하고 있습니다...'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // 완료된 필터 레이어
  const CompletedLayer = ({ filterType, value, index }) => {
    const stepNames = {
      형태: '형태',
      재질_분류: '재질',
      시대: '시대',
      용도: '용도',
    }

    const isCurrentlyLoading = loadingFilters.has(filterType)

    return (
      <motion.div
        className={`w-full h-fit transform transition-all duration-500 ${isCurrentlyLoading ? 'opacity-50' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        key={filterType}
      >
        <div className='flex items-center gap-3 text-xs mb-3'>
          <span className='text-white font-medium'>{stepNames[filterType]}</span>
          {isCurrentlyLoading && (
            <div className='w-4 h-4'>
              <LoadingSpinner />
            </div>
          )}
        </div>

        <div
          className={`relative overflow-hidden rounded-lg mb-2 bg-gray-700 ${
            isCurrentlyLoading ? 'border border-blue-500/50' : 'border border-green-500/50'
          }`}
        >
          <div className='w-full h-auto aspect-square flex items-center justify-center'>
            <div className='text-center'>
              {isCurrentlyLoading ? (
                <span className='text-blue-400'>처리 중...</span>
              ) : (
                <span className='text-green-400'>{value}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className='w-full p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'>
      <h2 className='text-xl font-medium text-white mb-6 flex items-center gap-3'>
        <div className='w-3 h-3 bg-white rounded-full animate-pulse'></div>
        Layers
      </h2>

      {/* 현재 처리 중인 필터 표시 */}
      {isAnyLoading && (
        <div className='mb-4 p-3 bg-blue-900/30 rounded-lg'>
          <div className='text-blue-300 text-sm'>
            처리 중인 필터:{' '}
            {Array.from(loadingFilters)
              .map((f) => (f === '재질_분류' ? '재질' : f))
              .join(', ')}
          </div>
        </div>
      )}

      {/* 로딩 중일 때 AI 모션 표시 */}
      {isAnyLoading ? (
        <AILoadingMotion />
      ) : (
        <>
          {/* 선택된 필터가 없을 때 */}
          {Object.values(selectedFilters).every((v) => !v) && (
            <div className='flex flex-col items-center justify-center h-48 text-gray-400'>
              <div className='w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4'>
                none
              </div>
            </div>
          )}

          {/* 완료된 레이어들 */}
          <div className='grid grid-cols-4 gap-4'>
            {Object.entries(selectedFilters).map(
              ([filterType, value], index) =>
                value && <CompletedLayer key={filterType} filterType={filterType} value={value} index={index} />,
            )}
          </div>
        </>
      )}
    </div>
  )
}

import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { View } from '@react-three/drei'
import { GeneratingModal } from './components'

const Foo = dynamic(() => import('./components/Foo').then((mod) => mod.Foo), { ssr: false })

export default function Page() {
  const router = useRouter()
  const artifacts = list
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState({
    형태: null,
    재질_분류: null,
    시대: null,
    용도: null,
  })

  // 로딩 상태 관리 - AI 레이어에서만 사용
  const [loadingFilters, setLoadingFilters] = useState(new Set())

  //생성하기 클릭시 생성되는 모달
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  // 각 필터 단계의 ref 생성
  const filterStepRefs = useRef({
    형태: null,
    재질_분류: null,
    시대: null,
    용도: null,
  })

  // 필터 패널 컨테이너 ref
  const filterPanelRef = useRef(null)

  // 누적 필터링된 아티팩트 계산 (모든 선택된 조건을 만족하는 것들만)
  const filteredArtifacts = useMemo(() => {
    return artifacts.filter((artifact) => {
      // 선택된 모든 필터 조건을 확인
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value) return true // 필터가 선택되지 않은 경우는 무시

        // 형태가 여러개인 경우 처리 (예: "사각형, 원형")
        if (key === '형태' && artifact[key]?.includes(',')) {
          return artifact[key]
            .split(',')
            .map((s) => s.trim())
            .includes(value)
        }

        return artifact[key] === value
      })
    })
  }, [artifacts, selectedFilters])

  // 다음 단계로 스크롤하는 함수
  const scrollToNextStep = (currentFilterType) => {
    const filterOrder = ['형태', '재질_분류', '시대', '용도']
    const currentIndex = filterOrder.indexOf(currentFilterType)
    const nextIndex = currentIndex + 1

    if (nextIndex < filterOrder.length) {
      const nextFilterType = filterOrder[nextIndex]
      const nextStepRef = filterStepRefs.current[nextFilterType]

      if (nextStepRef && filterPanelRef.current) {
        // 스크롤을 부드럽게 다음 단계로 이동
        setTimeout(() => {
          nextStepRef.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          })
        }, 300) // 딜레이 단축
      }
    }
  }

  // 필터 선택 핸들러 - 즉시 반응, AI 레이어에서만 로딩
  const handleFilterSelect = (filterType, value) => {
    // 이전에 선택되지 않았던 필터를 선택하는 경우에만 다음 단계로 스크롤
    const wasNotSelected = !selectedFilters[filterType]
    const isSelecting = selectedFilters[filterType] !== value

    // 필터 즉시 업데이트 (로딩 없음)
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }))

    // 새로 선택하는 경우에만 다음 단계로 스크롤
    if (wasNotSelected && isSelecting) {
      scrollToNextStep(filterType)
    }

    // AI 레이어에서만 로딩 시뮬레이션
    if (selectedFilters[filterType] !== value) {
      setLoadingFilters((prev) => new Set([...Array.from(prev), filterType]))

      setTimeout(() => {
        setLoadingFilters((prev) => {
          const newSet = new Set(prev)
          newSet.delete(filterType)
          return newSet
        })
      }, 1500)
    }
  }

  // 결과 페이지로 이동
  const handleGenerate = () => {
    setShowGenerateModal(true)
  }

  // 필터 초기화
  const resetFilters = () => {
    setSelectedFilters({
      형태: null,
      재질_분류: null,
      시대: null,
      용도: null,
    })
    setLoadingFilters(new Set())

    // 첫 번째 필터로 스크롤
    const firstStepRef = filterStepRefs.current['형태']
    if (firstStepRef && filterPanelRef.current) {
      setTimeout(() => {
        firstStepRef.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      }, 100)
    }
  }

  // 진행률 계산
  const selectedCount = Object.values(selectedFilters).filter((v) => v !== null).length
  const progress = (selectedCount / 4) * 100

  // 생성하기 버튼 활성화 조건
  const canGenerate = selectedCount > 0

  return (
    <section className='h-screen w-screen bg-black p-6 flex flex-col gap-6'>
      {/* Header */}
      <header className='flex flex-row items-center justify-between p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'>
        {/* Logo */}
        <div className='flex h-full w-fit flex-col items-start justify-center gap-1'>
          <Icon icon='nmkwhite' size={120} className='' />
          <span className='text-2xl font-medium text-white'>눈으로 보는 유물의 길</span>
        </div>

        {/* Search Bar */}
        <div className='flex-1 max-w-2xl flex h-full w-full flex-col items-end justify-center gap-2'>
          <div className='flex space-x-2'>
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  step < selectedCount ? 'bg-blue-500' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
          <div className='text-white text-sm'>
            진행률: {progress.toFixed(0)}% | {filteredArtifacts.length}개 유물 발견
          </div>
          <div className='w-48 h-2 bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-500 transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className='w-full flex flex-row gap-6 min-h-0'>
        {/* 3D View */}
        <div className='flex-1 flex flex-col gap-6 min-h-0'>
          <Foo className='flex-1 min-h-0' artifacts={artifacts} selectedFilters={selectedFilters} />

          {/* Info Bar with Generation Button */}
          <div className='flex h-24 w-full flex-row items-center justify-between gap-4  p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'>
            <div className='text-white'>
              <h3 className='text-lg font-semibold'>필터링 결과</h3>
              <p className='text-sm opacity-80'>
                총 {artifacts.length}개 중 {filteredArtifacts.length}개 유물이 모든 조건에 맞습니다
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={resetFilters}
                className='px-4 py-2 rounded-lg transition-colors duration-200 bg-red-500 text-white hover:bg-red-600'
              >
                필터 초기화
              </button>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  canGenerate
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                생성하기
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <aside className='w-2/5 max-w-md flex flex-col gap-4 overflow-hidden'>
          {/* AI 이미지 생성 섹션 */}
          <AIGenerationSection selectedFilters={selectedFilters} loadingFilters={loadingFilters} />

          {/* 선택된 필터들 요약 */}
          {Object.entries(selectedFilters).some(([_, value]) => value) && (
            <div className='w-full mb-4 p-4  bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'>
              <h3 className='font-semibold text-white mb-2'>선택된 필터:</h3>
              <div className='flex flex-wrap gap-4'>
                {Object.entries(selectedFilters).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className='w-fit h-fit flex justify-center items-center gap-2'>
                        <span className='text-sm text-white/70'>{key === '재질_분류' ? '재질' : key}:</span>
                        <span className='font-medium text-sm text-green-400'>{value}</span>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* 필터 단계들 - 스크롤 인디케이터 추가 */}
          <div className='relative flex-1 overflow-hidden rounded-lg'>
            <ScrollIndicator scrollContainerRef={filterPanelRef} />
            <div
              ref={filterPanelRef}
              className='w-full h-full overflow-y-scroll snap-y flex flex-col justify-start gap-4 p-1'
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {['형태', '재질_분류', '시대', '용도'].map((filterType, index) => (
                <FilterStep
                  key={filterType}
                  step={index}
                  filterType={filterType}
                  options={filterOptions[filterType]}
                  selected={selectedFilters[filterType]}
                  onSelect={(value) => handleFilterSelect(filterType, value)}
                  stepRef={(el) => (filterStepRefs.current[filterType] = el)}
                />
              ))}
            </div>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </aside>
      </div>
      {/* 생성하기 모달 */}
      <GeneratingModal showGenerateModal={showGenerateModal} setShowGenerateModal={setShowGenerateModal} />
    </section>
  )
}
