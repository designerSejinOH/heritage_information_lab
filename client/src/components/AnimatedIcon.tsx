'use client'
import { motion } from 'framer-motion'
import { Icon } from '@/components'
import classNames from 'classnames'
import { useState } from 'react'

interface AnimatedIconProps {
  hover?: boolean
  className?: string
  iconColor?: string
  fillColor?: string
  size?: number
  padding?: number
  fillMotion?: boolean
  blendMode?: boolean
  onClick?: () => void
}

export const AnimatedIcon = ({
  hover,
  className,
  size = 22,
  padding = size > 20 ? 6 : 4,
  fillColor,
  iconColor,
  fillMotion = true,
  blendMode = false,
  onClick,
}: AnimatedIconProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const realHover = hover || isHovered

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        width: size + padding * 2,
        height: size + padding * 2,
        padding: padding,
      }}
      className={classNames('relative', className)}
    >
      <motion.div
        initial={false}
        animate={{
          scale: fillMotion && realHover ? 1 : fillMotion && !realHover ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          mass: 1,
        }}
        style={{
          width: size + padding * 2,
          height: size + padding * 2,
        }}
        className={classNames('absolute z-0 top-0 left-0 rounded-full', `bg-${fillColor ? fillColor : 'primary'}`)}
      />
      <motion.div
        onClick={onClick}
        style={{
          width: size,
          height: size,
        }}
        className={classNames(
          'z-10 overflow-hidden rounded-full',
          `text-${iconColor ? iconColor : 'black'}`,
          blendMode ? 'mix-blend-difference' : '',
        )}
      >
        <motion.div
          animate={{
            x: realHover ? 0 : -size + 0,
          }}
          style={{
            willChange: 'transform',
          }}
          transition={{
            //gentle animation
            type: 'spring',
            stiffness: 100,
            damping: 15,
            mass: 1,
          }}
          className='w-fit h-fit flex flex-row gap-0 '
        >
          {/* left */}
          <Icon motion={false} icon='arrowRight' size={size} />
          {/* right */}
          <Icon motion={false} icon='arrowRight' size={size} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
