'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import classNames from 'classnames'
import { AnimatedIcon } from '@/components'

export const AliasButton = ({
  type = 'button',
  text,
  textSize,
  preset = 'white',
  onClick,
}: {
  type?: 'button' | 'submit'
  text: string
  textSize?: string
  preset?: 'white' | 'black'
  onClick?: () => void
}) => {
  const [hover, setHover] = useState(false)

  const size = textSize === 'lg' ? 22 : textSize === 'xl' ? 24 : 22

  return (
    <motion.button
      type={type}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onClick}
      className={classNames(
        'w-fit h-fit flex flex-row gap-2 lg:gap-4 justify-center items-center pl-4 pr-2 lg:pl-6 lg:pr-2 py-1 lg:py-2 rounded-full',
        preset === 'white' ? 'bg-white text-black' : 'bg-black text-white border border-white',
        'relative overflow-hidden',
        'cursor-pointer',
      )}
    >
      <motion.span
        className={classNames(
          'text-base lg:text-lg leading-9 z-10 font-semibold',
          textSize === 'lg'
            ? 'text-base lg:text-lg'
            : textSize === 'xl'
              ? 'text-lg lg:text-xl'
              : 'text-base lg:text-lg',
        )}
      >
        {text}
      </motion.span>
      <AnimatedIcon
        hover={hover}
        size={size - 6}
        className='lg:hidden block'
        fillColor={preset === 'white' ? 'primary' : 'white'}
        iconColor={preset === 'white' ? 'black' : 'white'}
        blendMode={preset === 'black'}
      />
      <AnimatedIcon
        hover={hover}
        size={size}
        className='lg:block hidden'
        fillColor={preset === 'white' ? 'primary' : 'white'}
        iconColor={preset === 'white' ? 'black' : 'white'}
        blendMode={preset === 'black'}
      />
    </motion.button>
  )
}
