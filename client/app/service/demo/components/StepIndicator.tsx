import classNames from 'classnames'

export const StepIndicator = ({ currentStep, filterKeys, className }) => {
  return (
    <>
      <div className={classNames('flex flex-col items-center justify-center gap-4', className)}>
        {/* 단계 표시 */}
        <div className='w-fit h-fit flex flex-row items-center justify-center gap-2 relative'>
          <div
            className='absolute z-0 left-0 top-0 w-1/4 h-full transition-all duration-500'
            style={{ transform: `translateX(${currentStep * 100}%)` }}
          >
            <div className='w-full h-full bg-white rounded-xl flex items-center justify-center'></div>
          </div>

          {filterKeys.map((filter, i) => (
            <div
              key={i}
              className={`w-1/4 z-20 py-1.5 flex flex-col border-[1.5px] border-white rounded-xl items-center justify-center cursor-pointer transition-all duration-300 ${
                i === currentStep ? 'text-black' : 'text-white'
              }`}
              // style={{ mixBlendMode: i === currentStep ? 'difference' : 'normal' }}
            >
              <span className='text-sm min-w-14 text-center font-medium'>{filter}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
