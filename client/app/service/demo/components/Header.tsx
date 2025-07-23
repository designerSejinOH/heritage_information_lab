import { Icon } from '@/components'
import { TbRefresh, TbX } from 'react-icons/tb'

export const Header = ({
  children,
  onResetAll,
  onClearCurrentStep,
  currentStep,
  filterKeys,
}: {
  children?: React.ReactNode
  onResetAll?: () => void
  onClearCurrentStep?: () => void
  currentStep?: number
  filterKeys?: string[]
} = {}) => {
  return (
    <>
      {/* Header */}
      <header className='fixed top-0 z-50 left-0 w-full h-fit flex flex-row items-start justify-between p-4'>
        {/* Logo */}
        <div className='flex h-fit w-fit flex-row items-center justify-center gap-4'>
          <Icon icon='nmkwhite' size={100} className='' />
          <div className='w-px h-6 bg-white'></div>
          <span className='text-base font-medium text-white'>눈으로 보는 유물의 길</span>
        </div>

        {/* 중앙 컨텐츠 */}
        <div className='w-fit h-fit flex flex-col items-end justify-start gap-4'>
          <div className='flex-1 flex justify-center'>{children}</div>

          {/* 우측 컨트롤 버튼들 */}
          <div className='flex h-fit w-fit flex-row items-center justify-center gap-2'>
            {/* 현재 단계 초기화 버튼 */}
            {onClearCurrentStep && (
              <button
                onClick={onClearCurrentStep}
                className='w-fit h-fit flex items-center justify-center gap-2 px-3 py-2 bg-black hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-lg text-white text-sm font-medium transition-all duration-200'
                title={`${filterKeys?.[currentStep] || '현재'} 단계 초기화`}
              >
                <TbX size={16} />
                <span className='hidden sm:block'>현재 단계 초기화</span>
              </button>
            )}

            {/* 전체 초기화 버튼 */}
            {onResetAll && (
              <button
                onClick={onResetAll}
                className='w-fit h-fit flex items-center justify-center gap-2 px-3 py-2 bg-black hover:bg-white hover:text-black border border-white hover:border-white/70 rounded-lg text-white text-sm font-medium transition-all duration-200'
                title='전체 초기화'
              >
                <TbRefresh size={16} />
                <span className='hidden sm:block'>전체 초기화</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
