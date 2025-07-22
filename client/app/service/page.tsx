'use client'

import { AliasButton, Button } from '@/components'
import { MasonryGrid, RollingMasonryMarquee } from './components'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Masonry } from '@webibee/easy-masonry-react'

export default function Page() {
  const router = useRouter()
  const handleButtonClick = useCallback(() => {
    router.push('/service/demo')
  }, [router])

  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden'>
        <motion.div className='absolute w-full inset-0 z-0 bg-black opacity-70'>
          <RollingMasonryMarquee />
        </motion.div>
        <div className='fixed top-1/2 left-1/2 pointer-events-none -translate-x-1/2 -translate-y-1/2 p-16 flex h-full w-full flex-col items-center justify-between'>
          <div className='w-fit flex flex-col items-center p-16'>
            <div className='mb-4 text-2xl font-medium  border-b-2 pb-2'>눈으로 보는 유물의 길</div>
            <div className='text-4xl  font-semibold w-full h-fit mb-6 pt-1 p-12 text-center leading-snug'>
              문화유산 디지털 표준 선도를 위한 <br />
              지능형 헤리티지 공유 플랫폼 기술 개발
            </div>
          </div>
          <div className='flex flex-col justify-end p-16 h-fit pointer-events-auto'>
            <Button
              preset='line'
              icon='arrowRight'
              clickToPage='/service/demo'
              text='어떤 유물을 찾아볼까?'
              className='mb-4 w-full max-w-md'
              motionDirection='horizontal'
            />
          </div>
          <div className='flex w-full h-fit flex-row items-end justify-between gap-4 p-16'>
            <div className='flex h-fit w-full flex-row items-center justify-center gap-12'>
              <div className='w-fit h-fit flex flex-col items-start gap-2'>
                <span className='text-base opacity-70 font-medium '></span>
                <Image
                  src='/img/전통대-워드타입B.png'
                  alt='한국전통문화대학교'
                  width={200}
                  height={200}
                  className='w-48'
                />
              </div>
              <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-48' />
              <Image
                src='/img/에트리-워드타입.png'
                alt='한국전자통신연구원'
                width={200}
                height={200}
                className='w-56'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
