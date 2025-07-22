'use client'

import { Button, Header, Loading } from '@/components'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden'>
        <div className='flex w-full h-1/3 flex-row items-start justify-between gap-4 p-12'>
          <div className='text-6xl w-full h-fit font-medium leading-tight px-4'>눈으로 보는 유물의 길</div>
          <div className='w-[1px] h-full bg-white/50'></div>
          <div className='text-2xl w-full h-fit font-medium pt-1 px-4'>
            문화유산 디지털 표준 선도를 위한 <br />
            지능형 헤리티지 공유 플랫폼 기술 개발
          </div>
        </div>

        <div className='flex w-fit h-1/3 flex-row items-end justify-center gap-4 p-12'>
          <Button preset='fill' clickToPage='/visual' text='데이터 시각화' />
          <Button preset='line' clickToPage='/service' text='서비스 데모' />
        </div>
        <div className='flex w-full h-1/3 flex-row items-end justify-between gap-4 p-12'>
          <div className='flex h-fit w-fit flex-row items-center justify-center gap-12 px-4'>
            <div className='w-fit h-fit flex flex-col items-start gap-2'>
              <span className='text-base opacity-70 font-medium '></span>
              <Image
                src='/img/전통대-워드타입B.png'
                alt='한국전통문화대학교'
                width={200}
                height={200}
                className='w-40'
              />
            </div>
            <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-40' />
            <Image src='/img/에트리-워드타입.png' alt='한국전자통신연구원' width={200} height={200} className='w-48' />
          </div>
        </div>
      </div>
    </>
  )
}
