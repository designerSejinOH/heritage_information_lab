'use client'

import { AliasButton, Header } from '@/components'
import Image from 'next/image'

export default function Page() {
  return (
    <>
      <Header height={80} />
      <div className='w-screen h-dvh flex flex-col items-center overflow-hidden relative justify-center'>
        <div className='w-full h-fit flex flex-col justify-end items-center p-12'>
          <h1 className='text-6xl font-bold mb-4'>눈으로 보는 유물의 길</h1>
        </div>
      </div>
    </>
  )
}
