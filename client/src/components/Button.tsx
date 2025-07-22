'use client'

import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { TbArrowRight } from 'react-icons/tb'
import { TbArrowUpRight } from 'react-icons/tb'
import { motion } from 'framer-motion'

interface ButtonProps {
  text?: string
  children?: React.ReactNode
  preset?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className?: string
  disabled?: boolean
  clickToPage?: string
  icon?: string
  motionDirection?: 'vertical' | 'horizontal'
}

export const Button = ({
  children,
  text,
  onClick,
  className = '',
  disabled = false,
  clickToPage,
  icon,
  preset = 'fill',
  motionDirection = 'vertical',
}: ButtonProps) => {
  const router = useRouter()

  // 모션 방향에 따른 variants 설정
  const getMotionVariants = () => {
    if (motionDirection === 'horizontal') {
      return {
        first: {
          rest: { x: 0 },
          hover: { x: 24 }, // 우에서 좌로 이동
        },
        second: {
          rest: { x: -24 }, // 좌측에서 대기
          hover: { x: 0 }, // 중앙으로 이동
        },
      }
    } else {
      return {
        first: {
          rest: { y: 0 },
          hover: { y: -24 },
        },
        second: {
          rest: { y: 24 },
          hover: { y: 0 },
        },
      }
    }
  }

  const motionVariants = getMotionVariants()

  return (
    <motion.button
      onClick={() => {
        if (clickToPage) router.push(clickToPage || '')
        onClick && onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>)
      }}
      className={classNames(
        'w-fit h-14 inline-flex items-center',
        'gap-2 rounded-2xl border-2',
        'py-4 text-xl font-medium transition-all duration-300 active:scale-95',
        clickToPage ? 'pl-4 pr-3' : 'px-4',
        preset == 'fill'
          ? 'bg-white border-white text-black'
          : preset == 'line'
            ? 'bg-black/10 border-white text-white backdrop-blur-md '
            : preset == 'reverse'
              ? 'bg-black border-black text-white hover:bg-transparent hover:text-black'
              : 'bg-transparent text-white ',
        'hover:rounded-3xl active:rounded-3xl',
      )}
      initial='rest'
      whileHover='hover'
    >
      {children ? children : text}
      {clickToPage && (
        <div className='relative overflow-hidden h-6 w-6 flex items-center justify-center'>
          <motion.div
            variants={motionVariants.first}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            {icon == 'arrowRight' ? <TbArrowRight /> : <TbArrowUpRight />}
          </motion.div>
          <motion.div
            className='absolute'
            variants={motionVariants.second}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            {icon == 'arrowRight' ? <TbArrowRight /> : <TbArrowUpRight />}
          </motion.div>
        </div>
      )}
    </motion.button>
  )
}
