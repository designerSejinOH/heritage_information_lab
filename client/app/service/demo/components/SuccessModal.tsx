interface SuccessModalProps {
  showModal: boolean
  handleCloseModal: () => void
  isGenerating: boolean
  generationComplete: boolean
  selectedFilters: Record<string, string>
}

export const SuccessModal = ({
  showModal,
  handleCloseModal,
  isGenerating,
  generationComplete,
  selectedFilters,
}: SuccessModalProps) => {
  return (
    <>
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-end justify-center bg-black/50'>
          <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full h-[calc(100vh-4rem)] border border-white/20'>
            <button
              onClick={handleCloseModal}
              className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            {/* 로딩 애니메이션 */}
            {isGenerating && (
              <>
                <div className='flex flex-col items-center gap-4 mb-6'>
                  <div className='relative'>
                    <div className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
                    <div className='absolute inset-0 w-16 h-16 border-4 border-transparent border-l-blue-400 rounded-full animate-spin animation-delay-150'></div>
                  </div>
                  <p className='text-white/80 animate-pulse'>AI가 당신만의 문화재를 생성하고 있습니다...</p>
                </div>
                {/* 선택된 필터 표시 */}
                <div className='mb-6 space-y-3'>
                  {Object.entries(selectedFilters).map(([key, value]) => (
                    <div key={key} className='flex justify-between items-center text-white'>
                      <span className='font-medium'>{key}:</span>
                      <span className='text-blue-300'>{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 생성 완료 메시지 */}
            {generationComplete && (
              <div className='w-full h-full flex flex-col gap-6 pt-6'>
                {/* Search Bar */}
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='유물을 검색해보세요...'
                    className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none'
                  />
                  <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  </button>
                </div>

                {/* Main 3D View */}
                <div className='w-full flex flex-col gap-6 w-full h-full'>
                  <div className='w-full h-[55%] flex flex-row gap-6'>
                    <main className='w-auto h-full aspect-square bg-gray-900/20 backdrop-blur-sm rounded-lg border border-gray-700 relative overflow-hidden'>
                      {/* 선택된 옵션 조합으로 되어있는 폴더에 이미지 접근 */}
                      <img
                        src={`/flow/${selectedFilters.형태}+${selectedFilters.재질}+${selectedFilters.시대}+${selectedFilters.용도}/result.jpeg`}
                        alt='Generated Artifact'
                        className='w-full h-full object-cover rounded-lg'
                      />
                    </main>

                    {/* Right Panel */}
                    <aside className='w-full bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 overflow-y-auto'>
                      <h2 className='text-white text-xl font-semibold mb-4'>정보</h2>

                      <div className='space-y-6'>
                        {/* 유물 기본 정보 */}
                        <div>
                          <h3 className='text-white text-lg mb-3'>생성된 유물 정보</h3>
                          <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>이름:</span>
                              <span className='text-white'>금제 관모</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>시대:</span>
                              <span className='text-white'>백제</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>재질:</span>
                              <span className='text-white'>금</span>
                            </div>
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>크기:</span>
                              <span className='text-white'>높이 15cm</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                  <div className='w-full h-[30%] flex flex-row items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6'>
                    {/* 더미 카드 좌우 스크롤 */}
                    <div className='w-[50vw] overflow-x-scroll flex items-center gap-4'>
                      {/* 카드 예시 */}
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 1</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 2</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 3</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 4</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 5</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 6</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                      <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                        <h3 className='text-white text-lg font-semibold'>유물 7</h3>
                        <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
                      </div>
                    </div>
                    <div className='flex-1 h-full flex justify-center items-center gap-4 p-4'></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
