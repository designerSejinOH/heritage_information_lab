import classNames from 'classnames'
import { TbArrowLeft, TbArrowRight, TbCheck, TbX } from 'react-icons/tb'
import { useState } from 'react'

interface ControlsProps {
  className?: string
  isLoading: boolean
  isSelecting: boolean
  currentActiveOption: string | null
  currentStep: number
  handlePrevStep: () => void
  handleNextStep: () => void
  handleSelectComplete: () => void
  handleClearCurrentStep?: () => void
  showNextButton: boolean
  progress: number
  currentFilterKey?: string
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
  handleClearCurrentStep,
  showNextButton,
  progress,
  currentFilterKey,
}: ControlsProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // 해제 가능한 조건: 선택이 완료된 상태에서만
  const canClear = isSelecting

  return (
    <div className={classNames('w-full flex flex-col justify-center items-center gap-3 z-10', className)}>
      {/* 현재 선택 표시 & 해제 버튼 */}
      {canClear ? (
        // 선택 완료 후 - 클릭 가능한 버튼
        <button
          onClick={handleClearCurrentStep}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-fit flex-1 h-fit flex items-center justify-center text-black text-2xl bg-white rounded-xl transition-all duration-300 ${
            isHovered ? 'bg-red-50 text-red-600 rounded-2xl' : ''
          }`}
          title={`${currentFilterKey} 선택 해제`}
        >
          <div className='w-fit min-w-16 px-4 h-10 flex flex-row items-center font-medium text-base justify-center gap-2'>
            <TbCheck />
            <div>{currentActiveOption} 선택됨</div>
            <TbX className='ml-2 text-red-500' size={16} />
          </div>
        </button>
      ) : (
        // 선택 전이나 로딩 중 - 단순 표시
        <div className='w-fit flex-1 h-fit flex items-center justify-center text-black text-2xl bg-white rounded-xl'>
          <div className='w-fit min-w-16 px-4 h-10 flex flex-row items-center font-medium text-base justify-center gap-2'>
            {isLoading ? (
              <div className='animate-pulse'>
                <span>AI Generating...</span>
              </div>
            ) : (
              <span>{currentActiveOption || '-'}</span>
            )}
          </div>
        </div>
      )}

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
            !currentActiveOption || isSelecting || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:rounded-[20px] hover:bg-black hover:text-white'
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
