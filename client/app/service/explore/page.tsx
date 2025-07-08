'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Foo } from './components'
import { Icon } from '@/components'

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

// 필터 단계 컴포넌트
function FilterStep({ step, options, selected, onSelect, isActive, filterType }) {
  const stepNames = {
    형태: '형태',
    재질_분류: '재질',
    시대: '시대',
    용도: '용도',
  }

  return (
    <div
      className={`p-4 border rounded-lg transition-all duration-300 snap-start  ${
        isActive ? ' border-blue-50' : selected ? ' border-green-50' : ' border-white'
      }`}
    >
      <h3 className={`text-lg font-semibold mb-3 text-white`}>
        {isActive ? `✸` : selected ? `✔` : `➤`} {step + 1}. {stepNames[filterType]} 필터링
      </h3>
      <div className='h-fit'>
        <div className='space-y-2'>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full flex flex-row justify-between items-center text-left px-3 py-2 transition-colors duration-200 text-sm $`}
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
        <div className='mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600'>
          선택됨: <span className='font-medium'>{selected}</span>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  const [artifacts, setArtifacts] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState({
    형태: null,
    재질_분류: null,
    시대: null,
    용도: null,
  })

  // list.json 데이터 로드
  useEffect(() => {
    const loadArtifacts = async () => {
      try {
        const response = await fetch('/data/list.json')
        const data = await response.json()
        setArtifacts(data)
      } catch (error) {
        console.error('Failed to load artifacts:', error)
      }
    }

    loadArtifacts()
  }, [])

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

  // 필터 선택 핸들러
  const handleFilterSelect = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }))

    // 다음 단계로 이동 (선택이 있을 때만)
    if (value && currentStep < 3) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    }
  }

  // 진행률 계산
  const selectedCount = Object.values(selectedFilters).filter((v) => v !== null).length
  const progress = (selectedCount / 4) * 100

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
                  step <= currentStep ? 'bg-blue-500' : 'bg-gray-500'
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

      <div className='w-full flex flex-row gap-6 px-6 pb-6 min-h-0'>
        {/* 3D View */}
        <div className='flex-1 flex flex-col gap-6 min-h-0'>
          <Foo className='flex-1 min-h-0' artifacts={artifacts} selectedFilters={selectedFilters} />

          {/* Info Bar */}
          <div className='flex h-24 w-full flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4'>
            <div className='text-white'>
              <h3 className='text-lg font-semibold'>필터링 결과</h3>
              <p className='text-sm opacity-80'>
                총 {artifacts.length}개 중 {filteredArtifacts.length}개 유물이 모든 조건에 맞습니다
              </p>
              <p className='text-xs opacity-60'>가운데 구형으로 모인 점들이 선택된 유물들입니다</p>
            </div>
            <button
              onClick={() => {
                setSelectedFilters({
                  형태: null,
                  재질_분류: null,
                  시대: null,
                  용도: null,
                })
                setCurrentStep(0)
              }}
              className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200'
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <aside className='w-2/5 max-w-md flex flex-col gap-4 overflow-y-auto'>
          {/* 선택된 필터들 요약 */}
          {Object.entries(selectedFilters).some(([_, value]) => value) && (
            <div className='w-full mb-4 p-4 border rounded-lg'>
              <h3 className='font-semibold text-white mb-2'>선택된 필터:</h3>
              <div className='space-y-1'>
                {Object.entries(selectedFilters).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className='flex justify-between items-center'>
                        <span className='text-sm text-white/70'>{key === '재질_분류' ? '재질' : key}:</span>
                        <span className='font-medium text-sm'>{value}</span>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* 필터 단계들 */}
          <div className='w-full h-full overflow-y-scroll snap-y rounded-lg flex flex-col justify-start gap-4'>
            {['형태', '재질_분류', '시대', '용도'].map((filterType, index) => (
              <FilterStep
                key={filterType}
                step={index}
                filterType={filterType}
                options={filterOptions[filterType]}
                selected={selectedFilters[filterType]}
                onSelect={(value) => handleFilterSelect(filterType, value)}
                isActive={index === currentStep}
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
