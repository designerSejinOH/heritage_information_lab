'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Icon, Loading } from '@/components'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Box, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), { ssr: false })

export default function Page() {
  const router = useRouter()

  return (
    <section className='h-screen w-screen bg-black p-6 flex flex-col gap-6'>
      {/* Header - 상단 전체 */}
      <header className='flex flex-row items-center justify-between p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700'>
        {/* Logo */}
        <div className='flex h-full w-fit flex-col items-start justify-center gap-1'>
          <Icon icon='nmkwhite' size={120} className='' />
          <span className='text-2xl font-medium text-white'>눈으로 보는 유물의 길</span>
        </div>

        {/* Search Bar */}
        <div className='flex-1 max-w-2xl mx-8'>
          <div className='relative'>
            <input
              type='text'
              placeholder='유물을 검색해보세요...'
              className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none'
            />
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className='w-full h-full flex flex-row gap-6'>
        {/* Left Panel */}
        <aside className='w-2/5 flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 overflow-y-auto'>
          {/* 선택되었던 단계 */}
          <h2 className='text-white text-xl font-semibold mb-4'>선택된 단계</h2>
          <div className='space-y-4'>
            {['형태', '재질_분류', '시대', '용도'].map((step, index) => (
              <div
                key={index}
                className='flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer'
              >
                <div className='w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full'>
                  <span className='text-white text-lg font-semibold'>{index + 1}</span>
                </div>
                <span className='text-white text-lg'>OOO {step}</span>
                <span className='text-gray-400 text-sm'>선택됨</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main 3D View */}
        <div className='w-full flex flex-col gap-6 w-full h-full'>
          <div className='w-full h-full flex flex-row gap-6'>
            <main className='w-full h-full bg-gray-900/20 backdrop-blur-sm rounded-lg border border-gray-700 relative overflow-hidden'>
              <View className='w-full h-full'>
                <Box position={[0, 0, 0]} args={[1, 1, 1]}>
                  <meshStandardMaterial color='orange' />
                </Box>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
              </View>
            </main>

            {/* Right Panel */}
            <aside className='w-full bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 overflow-y-auto'>
              <h2 className='text-white text-xl font-semibold mb-4'>정보</h2>

              <div className='space-y-6'>
                {/* 유물 기본 정보 */}
                <div>
                  <h3 className='text-white text-lg mb-3'>생성된 유물 정보</h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>이름:</span>
                      <span className='text-white'>금제 관모</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>시대:</span>
                      <span className='text-white'>백제</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>재질:</span>
                      <span className='text-white'>금</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>크기:</span>
                      <span className='text-white'>높이 15cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
          <div className='w-full h-2/5 flex flex-row items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6'>
            {/* 더미 카드 좌우 스크롤 */}
            <div className='w-[50vw] overflow-x-scroll flex items-center gap-4'>
              {/* 카드 예시 */}
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 1</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 2</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 3</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 4</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 5</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 6</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
              <div className='min-w-[200px] bg-gray-800 p-4 rounded-lg shadow-lg'>
                <h3 className='text-white text-lg font-semibold'>유물 7</h3>
                <p className='text-gray-400'>간단한 설명이 들어갑니다.</p>
              </div>
            </div>
            <div className='flex-1 h-full flex justify-center items-center gap-4 p-4'>
              <button
                onClick={() => router.push('/service/explore')}
                className='w-full h-full bg-black/50 border border-gray-400 text-white rounded-lg hover:text-black hover:bg-white transition-colors'
              >
                다시 유물 탐색하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
