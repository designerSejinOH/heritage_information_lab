import React from 'react'
import classNames from 'classnames'
import type { HTMLAttributes } from 'react'
import { createElement } from 'react'
import logo from '@/svgs/logo.svg'
import arrowLeft from '@/svgs/arrowLeft.svg'
import arrowRight from '@/svgs/arrowRight.svg'
import nmkLogo from '@/svgs/nmk-logo.svg'
import nmkwhite from '@/svgs/nmk-white.svg'

export const icons = {
  logo,
  arrowLeft,
  arrowRight,
  nmkLogo,
  nmkwhite,
}

interface IconProps {
  icon: string
  color?: string
  size?: number
  className?: string
  motion?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Icon = ({ icon, color, size = 24, className, onClick, motion = true, ...rest }: IconProps) => {
  const baseIconClasses = ' flex items-center justify-center cursor-pointer '

  if (!icons[icon]) return null

  return (
    <div
      aria-label={icon}
      className={classNames(
        baseIconClasses,
        motion ? 'transition-all duration-200 ease-in-out focus:opacity-50 active:opacity-50 active:scale-90' : '',
      )}
      onClick={onClick}
      {...rest}
    >
      {createElement(icons[icon], {
        style: {
          width: size.toString(),
        },
        className: className,
      })}
    </div>
  )
}
