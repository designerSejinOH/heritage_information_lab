'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { Html, OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import { Loading } from '@/components'
interface ViewProps {
  children: React.ReactNode
  perf?: boolean // perf 속성 추가
  className?: string // className 속성 추가
}

const View = forwardRef(({ children, perf = false, ...props }: ViewProps, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          <Suspense
            fallback={
              <Html center>
                <div className='w-full bg-black text-white h-full flex items-center justify-center'>
                  <Loading text='Loading 3D Scene...' />
                </div>
              </Html>
            }
          >
            {children}
            {perf && <Perf position='bottom-right' />}
          </Suspense>
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
