'use client'

import { Loading as Spinner } from '@/components'

export default function Loading() {
  return (
    <>
      <div className='relative flex h-dvh w-screen flex-col items-center overflow-hidden '>
        <Spinner />
      </div>
    </>
  )
}
