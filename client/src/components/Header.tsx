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
        className={classNames(
          'flex flex-row items-center gap-2 cursor-pointer',
          'w-fit h-fit md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
        )}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 62 60'
          fill='currentColor'
          className='w-8 h-auto aspect-square'
        >
          <path d='M17.6893 9.64329C22.5142 5.49499 28.7866 2.96393 35.6621 2.90381C41.3856 2.85571 46.7171 4.52705 51.1681 7.43086C45.7461 2.8016 38.7017 0 31.006 0C13.8776 0 0 13.8397 0 30.9078C0 35.5371 1.01926 39.9319 2.85272 43.8758C7.0323 52.9178 16.2056 59.2004 26.8506 59.2004C37.4955 59.2004 46.6387 52.6413 50.384 43.3527C51.0716 41.6333 51.4455 39.7635 51.4455 37.8036C51.4455 31.7435 46.5181 26.8317 40.4387 26.8317C36.5305 26.8317 33.0928 28.8637 31.1387 31.9299C29.1907 34.99 25.7589 37.022 21.8447 37.022C17.9305 37.022 14.2154 34.8577 12.2372 31.4068C11.4893 30.1082 11.0611 28.7255 10.8802 27.0902C10.7957 26.4168 10.7595 25.7014 10.7475 24.9379C10.6932 18.8357 13.3891 13.3527 17.6893 9.6493' />
          <path d='M35.9877 4.49098C49.208 4.49098 62 14.7715 62 30.8657C62 44.2665 53.4599 55.7134 41.4942 60C50.7881 55.4008 57.1751 45.8477 57.1751 34.8036C57.1751 20.7295 45.728 9.32465 31.6152 9.32465C25.5056 9.32465 19.9268 11.5972 15.687 15.3367C15.2045 15.7635 14.7461 16.2265 14.3239 16.7194C15.4698 14.3747 17.0982 12.3066 19.0765 10.6413C23.636 6.80561 29.5405 4.49098 35.9877 4.49098Z' />
        </svg>
        <div className='text-2xl flex flex-row items-center w-fit h-12 border-2 rounded-2xl px-3 font-medium'>
          Heritage Lab
        </div>
      </div>
      <div className='w-fit h-fit flex flex-row gap-4 text-lg'>눈으로 보는 유물의 길</div>
    </div>
  )
}
