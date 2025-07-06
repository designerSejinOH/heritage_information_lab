'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { Header } from './Header'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

interface LayoutProps {
  children: React.ReactNode
  header?: boolean
}

const Layout = ({ children, header = false }: LayoutProps) => {
  const ref = useRef(null)

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {header ? (
        <>
          <Header height={72} />
          <div style={{ marginTop: 72, width: '100%' }}>{children}</div>
        </>
      ) : (
        <div style={{ width: '100%' }}>{children}</div>
      )}

      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref}
        eventPrefix='client'
      />
    </div>
  )
}

export { Layout }
