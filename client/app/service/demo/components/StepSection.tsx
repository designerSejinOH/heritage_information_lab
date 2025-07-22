import { motion } from 'framer-motion'
import classNames from 'classnames'
import { StepIndicator } from './StepIndicator'

interface StepSectionProps {
  className?: string
  filterKeys: string[]
  currentStep: number
  currentFilterKey: string
  currentActiveOption: string | null
  isSelecting: boolean
  isLoading: boolean
  showGeneratedContent: boolean
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
}: StepSectionProps) => {
  return (
    <div className={classNames('w-full flex flex-col items-center justify-center gap-10', className)}>
      <StepIndicator className='w-fit h-fit' currentStep={currentStep} filterKeys={filterKeys} />
      <div
        className={`w-auto h-full aspect-square relative overflow-hidden bg-white/10 rounded-2xl flex items-center justify-center `}
      >
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
    </div>
  )
}
