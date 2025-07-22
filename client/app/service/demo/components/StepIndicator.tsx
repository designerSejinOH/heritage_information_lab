import classNames from 'classnames'

export const StepIndicator = ({ currentStep, filterKeys, className }) => {
  return (
    <>
      <div className={classNames('flex flex-col items-center justify-center gap-4', className)}>
        {/* 단계 표시 */}
        <div className='w-fit h-fit flex flex-row items-center justify-center bg-white rounded-full relative'>
          <div
            className='absolute z-0 left-0 top-0 w-1/4 h-full p-2 transition-all duration-500'
            style={{ transform: `translateX(${currentStep * 100}%)` }}
          >
            <div className='w-full h-full bg-black rounded-full flex items-center justify-center'></div>
          </div>

          {filterKeys.map((filter, i) => (
            <div
              key={i}
              className={`w-1/4 z-20 p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                i === currentStep ? 'text-white' : 'text-black'
              }`}
              style={{ mixBlendMode: i === currentStep ? 'difference' : 'normal' }}
            >
              <span className='text-sm min-w-16 text-center font-bold'>{filter}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
