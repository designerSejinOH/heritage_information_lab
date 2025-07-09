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
      className={`p-4 border-2 rounded-lg transition-all duration-300 ${
        isActive ? 'border-blue-500 bg-blue-50' : selected ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-3 ${
          isActive ? 'text-blue-700' : selected ? 'text-green-700' : 'text-gray-700'
        }`}
      >
        {stepNames[filterType]}
      </h3>
      <div className='h-fit checking'>
        <div className='space-y-2'>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
                selected === option ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {option}
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
  const [loading, setLoading] = useState(true)
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
        setLoading(true)
        const response = await fetch('/data/list.json')
        const data = await response.json()

        // 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          setArtifacts(data)
        } else {
          console.error('Data is not an array:', data)
          setArtifacts([])
        }
      } catch (error) {
        console.error('Failed to load artifacts:', error)
        setArtifacts([])
      } finally {
        setLoading(false)
      }
    }

    loadArtifacts()
  }, [])

  // 누적 필터링된 아티팩트 계산 (모든 선택된 조건을 만족하는 것들만)
  const filteredArtifacts = useMemo(() => {
    // artifacts가 배열이 아니거나 없는 경우 빈 배열 반환
    if (!Array.isArray(artifacts) || artifacts.length === 0) {
      return []
    }

    return artifacts.filter((artifact) => {
      // artifact가 객체가 아닌 경우 제외
      if (!artifact || typeof artifact !== 'object') {
        return false
      }

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

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <div className='h-screen w-screen bg-black flex items-center justify-center'>
        <div className='text-white text-xl'>데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className='h-screen w-screen bg-black p-6 grid grid-rows-[auto_1fr] grid-cols-[2fr_1fr] gap-6'>
      {/* Header - spans both columns */}
      <header className='col-span-2 grid grid-cols-[auto_1fr] gap-6 items-center'>
        {/* Logo */}
        <div className='flex items-center gap-4'>
          <Icon icon='nmkwhite' size={180} className='' />
          <span className='text-4xl font-medium text-white whitespace-nowrap'>눈으로 보는 유물의 길</span>
        </div>

        {/* Step Progress */}
        <div className='grid justify-items-end gap-2'>
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
            진행률: {progress.toFixed(0)}% | {filteredArtifacts?.length || 0}개 유물 발견
          </div>
          <div className='w-48 h-2 bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-500 transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Left Section - 3D View and Info */}
      <div className='grid grid-rows-[1fr_auto] gap-6 bg-white/5 backdrop-blur-sm rounded-xl p-6'>
        {/* 3D View */}
        <div className='bg-black rounded-lg overflow-hidden'>
          <Foo
            className='w-full h-full flex flex-col items-center justify-center'
            artifacts={artifacts}
            selectedFilters={selectedFilters}
          />
        </div>

        {/* Info Bar */}
        <div className='grid grid-cols-[1fr_auto] gap-4 items-center bg-white/10 backdrop-blur-sm rounded-lg p-4'>
          <div className='text-white'>
            <h3 className='text-lg font-semibold'>필터링 결과</h3>
            <p className='text-sm opacity-80'>
              총 {artifacts?.length || 0}개 중 {filteredArtifacts?.length || 0}개 유물이 모든 조건에 맞습니다
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

      {/* Right Section - Filter Panel */}
      <div className='grid grid-rows-[auto_1fr] gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6'>
        {/* 선택된 필터들 요약 */}
        {Object.entries(selectedFilters).some(([_, value]) => value) && (
          <div className='p-4 bg-white rounded-lg shadow-lg'>
            <h3 className='font-semibold text-gray-700 mb-2'>선택된 필터:</h3>
            <div className='grid gap-1'>
              {Object.entries(selectedFilters).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className='grid grid-cols-[auto_1fr] gap-4 items-center'>
                      <span className='text-sm text-gray-600'>{key === '재질_분류' ? '재질' : key}:</span>
                      <span className='font-medium text-sm justify-self-end'>{value}</span>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {/* 필터 단계들 */}
        <div className='overflow-y-auto grid gap-4 content-start pr-2'>
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
      </div>
    </div>
  )
}
