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
      <div className='relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden'>
        <div className='flex h-fit w-full flex-col items-center justify-end p-12'>
          <Image src='/img/중앙박물관-화이트.png' alt='국립중앙박물관' width={200} height={200} className='w-40' />
          <h1 className='mb-4 text-6xl font-bold'>눈으로 보는 유물의 길</h1>
          <AliasButton onClick={handleButtonClick} preset='black' text='어떤 유물을 찾아볼까?' />
        </div>
      </div>
    </>
  )
}
