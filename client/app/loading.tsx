'use client'

export default function Loading() {
  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center overflow-hidden '>
        {/* loading spinner */}
        <div className='flex h-fit w-full flex-col items-center justify-center p-12'>
          <div className='animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500'></div>
          <h1 className='mt-4 text-2xl font-bold text-white'>로딩 중...</h1>
          <p className='text-gray-400'>잠시만 기다려 주세요.</p>
        </div>
      </div>
    </>
  )
}
