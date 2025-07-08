'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@/components'
import classNames from 'classnames'

interface HeaderProps {
  className?: string
  height: number
}

export const Header = ({ className, height = 80 }: HeaderProps) => {
  const router = useRouter()

  return (
    <div
      className={classNames(
        ' w-full bg-black text-white px-4 md:px-6 flex flex-row justify-between items-center',
        className,
      )}
      style={{ height }}
    >
      <div
        onClick={() => router.refresh()}
        className='w-fit h-fit md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
      >
        <Icon icon='nmkLogo' size={200} className='' />
      </div>
      <div className='w-fit h-fit flex flex-row gap-4 text-lg'>눈으로 보는 유물의 길</div>
    </div>
  )
}
