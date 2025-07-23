import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames'
import { StepIndicator } from './StepIndicator'
import { useMemo } from 'react'

interface StepSectionProps {
  className?: string
  filterKeys: string[]
  currentStep: number
  currentFilterKey: string
  currentActiveOption: string | null
  isSelecting: boolean
  isLoading: boolean
  showGeneratedContent: boolean
  selectedFilters: Record<string, string | null>
}

// 현재 단계까지의 선택된 필터들로 이미지 경로 생성
const generateImagePath = (
  currentStep: number,
  selectedFilters: Record<string, string | null>,
  currentActiveOption: string | null,
): string => {
  const filterKeys = ['형태', '재질', '시대', '용도']
  const selectedParts: string[] = []

  // 현재 단계까지의 선택된 옵션들 수집
  for (let i = 0; i <= currentStep; i++) {
    const filterKey = filterKeys[i]
    const value = i === currentStep ? currentActiveOption : selectedFilters[filterKey]
    if (value) {
      selectedParts.push(value)
    }
  }

  // 아무것도 선택되지 않았으면 기본 이미지
  if (selectedParts.length === 0) {
    return '/flow/default.png'
  }

  // 파일명 생성 (공백 제거, 특수문자 처리)
  const fileName =
    selectedParts
      .join('+')
      .replace(/\s+/g, '')
      .replace(/[\/\\]/g, '') + '.png'
  return `/flow/${fileName}`
}

// 파티클 컴포넌트
const Particle = ({ index, isLoading }: { index: number; isLoading: boolean }) => {
  // 초기 랜덤 위치 생성 (고정값으로 유지)
  const initialPosition = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
    }),
    [index],
  )

  // 최종 집합 위치 (원형, 삼각형, 사각형 등의 패턴)
  const targetPosition = useMemo(() => {
    const angle = (index * 360) / 20 // 20개 파티클 기준
    const radius = 60 + (index % 3) * 20 // 다양한 반지름
    return {
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius,
    }
  }, [index])

  return (
    <motion.div
      className='absolute w-2 h-2 bg-white rounded-full opacity-80'
      initial={{
        x: initialPosition.x,
        y: initialPosition.y,
        scale: 0.5,
      }}
      animate={
        isLoading
          ? {
              x: targetPosition.x,
              y: targetPosition.y,
              scale: 1,
              opacity: 1,
            }
          : {
              x: initialPosition.x,
              y: initialPosition.y,
              scale: 0.5,
              opacity: 0.6,
            }
      }
      transition={{
        duration: 1.5,
        ease: 'easeInOut',
        delay: index * 0.05, // 순차적으로 움직임
      }}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

// 파티클 시스템 컴포넌트
const ParticleSystem = ({ isLoading }: { isLoading: boolean }) => {
  const particles = Array.from({ length: 25 }, (_, i) => i)

  return (
    <div className='absolute inset-0 pointer-events-none'>
      {particles.map((index) => (
        <Particle key={index} index={index} isLoading={isLoading} />
      ))}
    </div>
  )
}

export const StepSection = ({
  className = '',
  filterKeys,
  currentStep,
  currentFilterKey,
  currentActiveOption,
  isSelecting,
  isLoading,
  showGeneratedContent,
  selectedFilters,
}: StepSectionProps) => {
  // 이미지 경로 생성
  const imagePath = generateImagePath(currentStep, selectedFilters, currentActiveOption)

  return (
    <div className={classNames('w-full flex flex-col items-center justify-center gap-10', className)}>
      <StepIndicator className='w-fit h-fit' currentStep={currentStep} filterKeys={filterKeys} />
      <div
        className={`w-auto h-full aspect-square relative overflow-hidden bg-[#000] rounded-2xl flex items-center justify-center `}
      >
        {/* 기본 상태 - 파티클 시스템 */}
        {!showGeneratedContent && (
          <AnimatePresence>
            <motion.div
              className='absolute inset-0'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ParticleSystem isLoading={isLoading} />

              {/* 중앙 텍스트 */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div
                  className={`text-white text-center transition-all duration-1000 ${
                    isSelecting ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
                  }`}
                >
                  {currentActiveOption && !isLoading && (
                    <div className='text-sm text-blue-400'>현재 선택된 옵션: {currentActiveOption}</div>
                  )}

                  {isSelecting && !isLoading && (
                    <div className='text-sm text-green-400 animate-bounce mt-2'>선택 완료!</div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* 로딩 상태 - 간단한 텍스트만 */}
        {isLoading && (
          <motion.div
            className='absolute inset-0 flex items-center justify-center text-white text-center z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }} // 파티클이 모인 후 텍스트 표시
          >
            <div className='flex flex-col items-center gap-4'>
              <div className='text-lg font-bold animate-pulse'>Generating...</div>
              <div className='text-sm text-gray-300 animate-pulse'>
                {currentFilterKey}: {currentActiveOption}
              </div>
            </div>
          </motion.div>
        )}

        {/* 생성된 콘텐츠 */}
        <AnimatePresence>
          {showGeneratedContent && (
            <motion.div
              className='absolute inset-0'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              {/* 완료 텍스트 (잠시 표시 후 사라짐) */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 2.5, // 2.5초 후 사라짐
                }}
                className='absolute z-10 bottom-4 left-1/2 -translate-x-1/2 w-fit h-fit flex flex-col p-4 backdrop-blur-sm bg-black/20 rounded-lg items-center justify-center'
              >
                <h3 className='text-xl font-bold mb-2 text-white'>생성 완료!</h3>
                <div className='text-sm opacity-80 text-nowrap text-white'>
                  AI가 생성한 {currentFilterKey} 결과입니다
                </div>
              </motion.div>

              {/* 생성된 이미지 */}
              <motion.img
                src={imagePath}
                alt={currentActiveOption || '생성된 이미지'}
                style={{ height: '100%', width: 'auto' }}
                loading='lazy'
                draggable='false'
                className='object-cover w-full h-full rounded-2xl'
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/flow/default.png'
                  console.log(`이미지를 찾을 수 없습니다: ${imagePath}`)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
