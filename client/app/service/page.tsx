'use client'

import { AliasButton } from '@/components'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const handleButtonClick = () => {
    router.push('/service/explore')
  }
  return (
    <>
      <div className='w-screen h-dvh flex flex-col items-center overflow-hidden relative justify-center'>
        <div className='w-full h-fit flex flex-col justify-end items-center p-12'>
          <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-40' />
          <h1 className='text-6xl font-bold mb-4'>눈으로 보는 유물의 길</h1>
          <AliasButton onClick={handleButtonClick} preset='black' text='어떤 유물을 찾아볼까?' />
        </div>
      </div>
    </>
  )
}
