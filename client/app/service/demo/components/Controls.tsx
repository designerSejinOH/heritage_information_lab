import classNames from 'classnames'

interface ControlsProps {
  className?: string
  isLoading: boolean
  isSelecting: boolean
  currentActiveOption: string | null
  currentStep: number
  handlePrevStep: () => void
  handleNextStep: () => void
  handleSelectComplete: () => void
  showNextButton: boolean
  progress: number
}

export const Controls = ({
  className,
  isLoading,
  isSelecting,
  currentActiveOption,
  currentStep,
  handlePrevStep,
  handleNextStep,
  handleSelectComplete,
  showNextButton,
  progress,
}: ControlsProps) => {
  return (
    <div className={classNames('w-full flex flex-col justify-center items-center', className)}>
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
  )
}
