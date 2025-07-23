import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames'
import { StepIndicator } from './StepIndicator'
import { useMemo, useState, useEffect } from 'react'

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

// 한글 파일명을 올바르게 처리하는 함수
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

  // 한글 파일명 그대로 사용 + URL 인코딩
  const fileName =
    selectedParts
      .join('+')
      .replace(/\s+/g, '') // 공백만 제거
      .replace(/[\/\\]/g, '') + '.png' // 슬래시만 제거

  // URL 인코딩으로 한글 처리
  const encodedFileName = encodeURIComponent(fileName)
  const finalPath = `/flow/${encodedFileName}`

  console.log('Original filename:', fileName)
  console.log('Encoded path:', finalPath)

  return finalPath
}

// 여러 방식으로 한글 파일명을 시도하는 함수
const generateKoreanFallbackPaths = (
  currentStep: number,
  selectedFilters: Record<string, string | null>,
  currentActiveOption: string | null,
): string[] => {
  const filterKeys = ['형태', '재질', '시대', '용도']
  const selectedParts: string[] = []

  for (let i = 0; i <= currentStep; i++) {
    const filterKey = filterKeys[i]
    const value = i === currentStep ? currentActiveOption : selectedFilters[filterKey]
    if (value) {
      selectedParts.push(value)
    }
  }

  if (selectedParts.length === 0) {
    return ['/flow/default.png']
  }

  const baseFileName =
    selectedParts
      .join('+')
      .replace(/\s+/g, '')
      .replace(/[\/\\]/g, '') + '.png'

  return [
    // 1. URL 인코딩된 한글 (가장 표준적)
    `/flow/${encodeURIComponent(baseFileName)}`,

    // 2. 원본 한글 그대로 (일부 서버에서 작동)
    `/flow/${baseFileName}`,

    // 3. UTF-8 바이트 인코딩 시도
    `/flow/${encodeURI(baseFileName)}`,

    // 4. 기본 이미지
    '/flow/default.png',
  ]
}

// 파티클 컴포넌트
const Particle = ({ index, isLoading }: { index: number; isLoading: boolean }) => {
  const initialPosition = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
    }),
    [index],
  )

  const targetPosition = useMemo(() => {
    const angle = (index * 360) / 20
    const radius = 60 + (index % 3) * 20
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
        delay: index * 0.05,
      }}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

const ParticleSystem = ({ isLoading }: { isLoading: boolean }) => {
  const particles = Array.from({ length: 20 }, (_, i) => i)

  return (
    <motion.div className='absolute inset-0 pointer-events-none'>
      {particles.map((index) => (
        <Particle key={index} index={index} isLoading={isLoading} />
      ))}
    </motion.div>
  )
}

// 한글 이미지를 안전하게 로드하는 컴포넌트
const KoreanSafeImage = ({
  currentStep,
  selectedFilters,
  currentActiveOption,
  alt,
  className,
  style,
}: {
  currentStep: number
  selectedFilters: Record<string, string | null>
  currentActiveOption: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
}) => {
  const fallbackPaths = useMemo(
    () => generateKoreanFallbackPaths(currentStep, selectedFilters, currentActiveOption),
    [currentStep, selectedFilters, currentActiveOption],
  )

  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // 새로운 선택이 있을 때마다 초기화
  useEffect(() => {
    setCurrentPathIndex(0)
    setIsLoaded(false)
    setHasError(false)
  }, [currentStep, currentActiveOption])

  const handleError = () => {
    console.warn(`한글 이미지 로드 실패: ${fallbackPaths[currentPathIndex]}`)

    if (currentPathIndex < fallbackPaths.length - 1) {
      setCurrentPathIndex((prev) => prev + 1)
      setHasError(false) // 다음 시도를 위해 에러 상태 리셋
    } else {
      console.error('모든 한글 이미지 경로 시도 완료')
      setHasError(true)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
    console.log(`한글 이미지 로드 성공: ${fallbackPaths[currentPathIndex]}`)
  }

  return (
    <motion.img
      key={`korean-${currentStep}-${currentActiveOption}-${currentPathIndex}`}
      src={fallbackPaths[currentPathIndex]}
      alt={alt}
      style={style}
      className={className}
      loading='lazy'
      draggable='false'
      onError={handleError}
      onLoad={handleLoad}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{
        opacity: isLoaded && !hasError ? 1 : 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    />
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
                    <div className='text-sm opacity-50'>현재 선택된 옵션: {currentActiveOption}</div>
                  )}

                  {isSelecting && !isLoading && (
                    <div className='text-sm text-green-400 animate-bounce mt-2'>선택 완료!</div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <motion.div
            className='absolute inset-0 flex items-center justify-center text-white text-center z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className='flex flex-col items-center gap-4'>
              <div className='text-lg font-bold animate-pulse'>Generating...</div>
              <div className='text-sm text-gray-300 animate-pulse'>
                {currentFilterKey}: {currentActiveOption}
              </div>
            </div>
          </motion.div>
        )}

        {/* 생성된 콘텐츠 - 한글 이미지 */}
        <AnimatePresence>
          {showGeneratedContent && (
            <motion.div
              className='absolute inset-0 flex items-center justify-center overflow-hidden'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
            >
              {/* 완료 텍스트 */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 2.5,
                }}
                className='absolute z-10 bottom-4 left-1/2 -translate-x-1/2 w-fit h-fit flex flex-col p-4 backdrop-blur-sm bg-black/20 rounded-lg items-center justify-center'
              >
                <h3 className='text-xl font-bold mb-2 text-white'>생성 완료!</h3>
                <div className='text-sm opacity-80 text-nowrap text-white'>
                  AI가 생성한 {currentFilterKey} 결과입니다
                </div>
              </motion.div>

              {/* 한글 파일명을 안전하게 처리하는 이미지 */}
              <KoreanSafeImage
                currentStep={currentStep}
                selectedFilters={selectedFilters}
                currentActiveOption={currentActiveOption}
                alt={currentActiveOption || '생성된 이미지'}
                style={{ height: '100%', width: 'auto' }}
                className='object-cover w-full h-full rounded-2xl'
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
