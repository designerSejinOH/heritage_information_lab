'use client'

import { Loading } from '@/components'
import { Box, Html, OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
})

export default function Page() {
  return (
    <>
      <View perf className='h-dvh w-screen flex-col items-center justify-center'>
        <Box position={[0, 0, 0]} />
        <OrbitControls />
      </View>
    </>
  )
}
