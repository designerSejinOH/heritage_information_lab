import classNames from 'classnames'
import { TbArrowLeft, TbArrowRight, TbCheck } from 'react-icons/tb'

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
    <div className={classNames('w-full flex flex-col justify-center items-center gap-3', className)}>
      <div className='w-fit  flex-1 h-fit flex items-center justify-center text-black text-2xl bg-white rounded-xl'>
        <div className='w-fit min-w-16 px-4 h-10 flex flex-row items-center font-medium text-base justify-center gap-2'>
          {isLoading ? (
            <div className='animate-pulse '>
              <span>AI Generating...</span>
            </div>
          ) : isSelecting ? (
            <div className='flex flex-row items-center gap-2'>
              <TbCheck />
              <div>{currentActiveOption} 선택됨</div>
            </div>
          ) : (
            <span className=''>{currentActiveOption || '-'}</span>
          )}
        </div>
      </div>

      <div className='w-fit h-fit flex flex-row items-center text-white justify-center gap-4 relative mb-6'>
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className={`w-fit h-fit flex items-center justify-center font-medium gap-2 text-xl border-[1.5px] border-white rounded-xl px-4 py-2 transition-all duration-300 ${
            currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:rounded-2xl'
          }`}
        >
          <TbArrowLeft />
          이전 단계
        </button>

        <button
          onClick={handleSelectComplete}
          disabled={!currentActiveOption || isSelecting || isLoading}
          className={`w-60 h-fit flex justify-center items-center font-medium bg-white text-black text-2xl border-[1.5px] border-white rounded-2xl px-4 py-2 transition-all duration-300 ${
            !currentActiveOption || isSelecting || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:rounded-[20px]'
          }`}
        >
          {isLoading ? '생성 중...' : '선택 완료'}
        </button>

        <button
          disabled={!showNextButton || isLoading}
          onClick={handleNextStep}
          className={`w-fit h-fit flex items-center justify-center gap-2 font-medium text-white text-xl border-[1.5px] border-white rounded-xl px-4 py-2 transition-all duration-300 ${
            showNextButton ? 'opacity-100 hover:rounded-2xl' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {currentStep === 3 ? '생성하기' : '다음으로'}
          <TbArrowRight />
        </button>
      </div>
    </div>
  )
}
