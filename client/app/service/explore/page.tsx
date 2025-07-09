'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Icon } from '@/components'
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

// 필터 단계 컴포넌트
function FilterStep({ step, options, selected, onSelect, filterType, loadingFilters }) {
  const stepNames = {
    형태: '형태',
    재질_분류: '재질',
    시대: '시대',
    용도: '용도',
  }

  const isLoading = loadingFilters.has(filterType)
  const isAnyLoading = loadingFilters.size > 0

  return (
    <div
      className={`p-4 border rounded-lg transition-all duration-300 snap-start relative ${
        selected ? ' border-green-50' : ' border-white'
      } ${isAnyLoading && !isLoading ? 'opacity-50' : ''}`}
    >
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className='absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10'>
          <div className='flex flex-col items-center gap-3'>
            <LoadingSpinner />
            <span className='text-white text-sm'>필터링 중...</span>
          </div>
        </div>
      )}

      <h3 className={`text-lg font-semibold mb-3 text-white`}>
        {selected ? `✔` : `➤`} {step + 1}. {stepNames[filterType]} 필터링
      </h3>
      <div className='h-fit'>
        <div className='space-y-2'>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              disabled={isAnyLoading}
              className={`w-full flex flex-row justify-between items-center text-left px-3 py-2 transition-colors duration-200 text-sm ${
                isAnyLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
              }`}
            >
              {option}

              <input
                type='checkbox'
                checked={selected === option}
                onChange={() => onSelect(option)}
                disabled={isAnyLoading}
                className='ml-2 h-4 w-4 accent-blue-500'
              />
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <div className='mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600'>
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
    <div className='flex flex-col items-center justify-center h-48 gap-4'>
      <div className='relative'>
        {/* 3D AI 비주얼 애니메이션 */}
        <div className='ai-visual-container'>
          <div className='ai-visual c1 ani'>
            <div className='ai-box'>
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className='ai-circle'
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    opacity: i * 0.04 + 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
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

      {/* 진행 바 */}
      <div className='w-48 h-1 bg-gray-700 rounded-full overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse'></div>
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
      <div
        className={`w-full h-fit transform transition-all duration-500 ${isCurrentlyLoading ? 'opacity-50' : ''}`}
        style={{
          animationDelay: `${index * 0.2}s`,
          animation: 'fadeInUp 0.6s ease-out forwards',
        }}
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
          <div className='w-full h-32 flex items-center justify-center'>
            <div className='text-center'>
              {isCurrentlyLoading ? (
                <span className='text-blue-400'>처리 중...</span>
              ) : (
                <span className='text-green-400'>✓ {value}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'>
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
          <div className='flex flex-row w-full h-fit gap-4'>
            {Object.entries(selectedFilters).map(
              ([filterType, value], index) =>
                value && <CompletedLayer key={filterType} filterType={filterType} value={value} index={index} />,
            )}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 3D AI 비주얼 애니메이션 스타일 */
        .ai-visual-container {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        .ai-visual {
          position: relative;
          width: 100px;
          height: 100px;
          transform-style: preserve-3d;
        }

        .ai-box {
          position: relative;
          width: 100%;
          height: 100%;
          animation: ai-box-rotate 5s linear infinite;
        }

        .ai-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid #0ff;
          border-radius: 115% 140% 145% 110%/125% 140% 110% 125%;
          animation: ai-circle-move 1s linear infinite alternate;
        }

        .ai-circle:nth-child(odd) {
          border-color: #f0f;
        }

        .ai-circle:nth-child(3n) {
          border-color: #0f0;
        }

        .ai-circle:nth-child(5n) {
          border-color: #ff0;
        }

        @keyframes ai-box-rotate {
          to {
            transform: rotateZ(360deg);
          }
        }

        @keyframes ai-circle-move {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: rotateX(0deg) rotateY(25deg);
          }
          100% {
            transform: rotateX(25deg) rotateY(0deg);
          }
        }
      `}</style>
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

  // 로딩 상태 관리 - 여러 필터 동시 로딩 지원
  const [loadingFilters, setLoadingFilters] = useState(new Set())

  //생성하기 클릭시 생성되는 모달
  const [showGenerateModal, setShowGenerateModal] = useState(false)

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

  // 필터 선택 핸들러 - 다중 로딩 지원
  const handleFilterSelect = (filterType, value) => {
    // 해당 필터가 이미 로딩 중이면 무시
    if (loadingFilters.has(filterType)) return

    // 로딩 시작
    setLoadingFilters((prev) => new Set([...Array.from(prev), filterType]))

    // 필터 업데이트
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }))

    // 개별 필터 로딩 종료
    setTimeout(() => {
      setLoadingFilters((prev) => {
        const newSet = new Set(prev)
        newSet.delete(filterType)
        return newSet
      })
    }, 1500)
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
  }

  // 진행률 계산
  const selectedCount = Object.values(selectedFilters).filter((v) => v !== null).length
  const progress = (selectedCount / 4) * 100

  // 생성하기 버튼 활성화 조건
  const canGenerate = selectedCount > 0 && loadingFilters.size === 0

  return (
    <section className='flex h-screen w-screen flex-col items-center justify-start gap-6 bg-black p-6'>
      {/* Header */}
      <header className='w-full flex items-center justify-between gap-6 px-6 h-24'>
        {/* Logo */}
        <div className='flex h-full w-fit flex-col items-start justify-center gap-1'>
          <Icon icon='nmkwhite' size={180} className='' />
          <span className='size-fit text-nowrap text-4xl font-medium text-white'>눈으로 보는 유물의 길</span>
        </div>

        {/* Step Progress */}
        <div className='flex h-full w-full flex-col items-end justify-center gap-2'>
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
            {loadingFilters.size > 0 && <span className='ml-2 text-blue-300'>({loadingFilters.size}개 처리 중)</span>}
          </div>
          <div className='w-48 h-2 bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-500 transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className='w-full flex flex-row gap-6 px-6 pb-6 min-h-0'>
        {/* 3D View */}
        <div className='flex-1 flex flex-col gap-6 min-h-0'>
          <Foo className='flex-1 min-h-0' artifacts={artifacts} selectedFilters={selectedFilters} />

          {/* Info Bar with Generation Button */}
          <div className='flex h-24 w-full flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4'>
            <div className='text-white'>
              <h3 className='text-lg font-semibold'>필터링 결과</h3>
              <p className='text-sm opacity-80'>
                총 {artifacts.length}개 중 {filteredArtifacts.length}개 유물이 모든 조건에 맞습니다
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={resetFilters}
                disabled={loadingFilters.size > 0}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  loadingFilters.size > 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
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
                {loadingFilters.size > 0 ? (
                  <div className='flex items-center gap-2'>
                    <LoadingSpinner />
                    처리 중...
                  </div>
                ) : (
                  `생성하기`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <aside className='w-2/5 max-w-md flex flex-col gap-4 overflow-y-auto'>
          {/* AI 이미지 생성 섹션 */}
          <AIGenerationSection selectedFilters={selectedFilters} loadingFilters={loadingFilters} />

          {/* 선택된 필터들 요약 */}
          {Object.entries(selectedFilters).some(([_, value]) => value) && (
            <div className='w-full mb-4 p-4 border rounded-lg bg-gray-900/30'>
              <h3 className='font-semibold text-white mb-2'>선택된 필터:</h3>
              <div className='flex flex-wrap gap-4'>
                {Object.entries(selectedFilters).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className='w-fit h-fit flex justify-center items-center gap-2'>
                        <span className='text-sm text-white/70'>{key === '재질_분류' ? '재질' : key}:</span>
                        <span
                          className={`font-medium text-sm ${
                            loadingFilters.has(key) ? 'text-blue-400' : 'text-green-400'
                          }`}
                        >
                          {value}
                          {loadingFilters.has(key) && <span className='ml-1'>⏳</span>}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* 기존 필터 단계들 */}
          <div className='w-full h-full overflow-y-scroll snap-y rounded-lg flex flex-col justify-start gap-4'>
            {['형태', '재질_분류', '시대', '용도'].map((filterType, index) => (
              <FilterStep
                key={filterType}
                step={index}
                filterType={filterType}
                options={filterOptions[filterType]}
                selected={selectedFilters[filterType]}
                onSelect={(value) => handleFilterSelect(filterType, value)}
                loadingFilters={loadingFilters}
              />
            ))}
          </div>
        </aside>
      </div>
      {/* 생성하기 모달 */}
      <GeneratingModal showGenerateModal={showGenerateModal} setShowGenerateModal={setShowGenerateModal} />
    </section>
  )
}
