import { Icon } from '@/components'

export const Header = ({
  children,
}: {
  children?: React.ReactNode
} = {}) => {
  return (
    <>
      {/* Header */}
      <header className='fixed top-0 z-50 left-0 w-full h-fit flex flex-row items-start justify-between p-4'>
        {/* Logo */}
        <div className='flex h-fit w-fit flex-row items-center justify-center gap-4'>
          <Icon icon='nmkwhite' size={100} className='' />
          <div className='w-px h-6 bg-white'></div>
          <span className='text-base font-medium text-white'>눈으로 보는 유물의 길</span>
        </div>
        {children}
      </header>
    </>
  )
}
