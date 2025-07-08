'use client'

import { AliasButton, Header, Icon } from '@/components'
import { Box, OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Foo } from './components'

export default function Page() {
  return (
    <section className='flex h-screen w-screen flex-col items-center justify-start gap-6 bg-black p-6'>
      <div className='flex h-fit w-full flex-row items-center justify-between gap-6'>
        {/* Logo */}
        <div className='flex h-24 w-fit flex-col items-start justify-center gap-1 '>
          <Icon icon='nmkwhite' size={180} className='' />
          <span className='size-fit text-nowrap text-4xl font-medium text-white'>눈으로 보는 유물의 길</span>
        </div>
        {/* Step UI */}
        <div className='flex h-24 w-full flex-row items-center justify-end gap-4 bg-white'></div>
      </div>
      <div className='flex size-full flex-row items-center justify-center gap-6'>
        {/* 3D View */}
        <div className='flex h-full w-3/5 flex-col items-center justify-start gap-6'>
          <Foo className='size-full flex-col items-center justify-center' />
          <div className='flex h-24 w-full flex-row items-center justify-between gap-6 bg-white'></div>
        </div>
        {/* Filter List */}
        <div className='flex h-full w-2/5 flex-col items-center justify-start gap-6 bg-white'></div>
      </div>
    </section>
  )
}
