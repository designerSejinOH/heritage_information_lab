'use client'

import { Loading } from '@/components'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center justify-between overflow-hidden '>
        <div className='flex size-full flex-col items-center justify-end p-12'>
          <h1 className='mb-4 text-5xl font-bold'>유물 메타데이터 관계 시각화</h1>
          <p className='mb-8 text-lg'>문화유산 디지털 표준 선도를 위한 지능형 헤리티지 공유 플랫폼 기술 개발</p>
          <div className='flex h-fit w-full flex-row items-center justify-center gap-4'>
            <Image src='/img/전통대-워드타입B.png' alt='한국전통문화대학교' width={200} height={200} className='w-40' />
            <div className='h-full w-px bg-gray-300'></div>
            <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-40' />
            <div className='h-full w-px bg-gray-300'></div>
            <Image src='/img/에트리-워드타입.png' alt='한국전자통신연구원' width={200} height={200} className='w-48' />
          </div>
        </div>
        <div className='flex size-full flex-row items-start justify-center gap-4 p-12'>
          <button
            onClick={() => router.push('/visual')}
            className='inline-flex items-center gap-4 rounded-full bg-white py-4 pl-6 pr-10 text-xl font-medium text-black backdrop-blur-sm transition-all duration-300 hover:bg-white/50 active:scale-95'
          >
            <GoArrowLeft />
            데이터 시각화
          </button>
          <button
            onClick={() => router.push('/service')}
            className='inline-flex items-center gap-4 rounded-full bg-white py-4 pl-10 pr-6 text-xl font-medium text-black backdrop-blur-sm transition-all duration-300 hover:bg-white/50 active:scale-95'
          >
            서비스 데모
            <GoArrowRight />
          </button>
        </div>
      </div>
    </>
  )
}
