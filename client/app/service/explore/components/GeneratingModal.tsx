import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface GeneratingModalProps {
  showGenerateModal: boolean
  setShowGenerateModal: (show: boolean) => void
}

export const GeneratingModal = ({ showGenerateModal, setShowGenerateModal }: GeneratingModalProps) => {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (showGenerateModal) {
      setAnimationPhase(0)
      const timer = setTimeout(() => {
        setAnimationPhase(1)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [showGenerateModal])

  const layers = [
    { color: 'bg-blue-500', delay: 0 },
    { color: 'bg-green-500', delay: 0.2 },
    { color: 'bg-purple-500', delay: 0.4 },
    { color: 'bg-orange-500', delay: 0.6 },
  ]

  return (
    <AnimatePresence>
      {showGenerateModal && (
        <motion.div
          className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowGenerateModal(false)}
        >
          <motion.div
            className='bg-white/10 backdrop-blur-xl text-white rounded-lg p-8 w-3/4 h-auto aspect-[4/3] max-w-xl shadow-lg relative overflow-hidden'
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className='flex flex-col items-center justify-center h-full'>
              {/* 카드 레이어 컨테이너 */}
              <div className='relative w-48 h-48 mb-8' style={{ perspective: '1000px' }}>
                {layers.map((layer, index) => (
                  <motion.div
                    key={index}
                    className={`absolute w-32 h-32 border bg-black/50 backdrop-blur-md rounded-lg shadow-lg`}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                    initial={{
                      x: index === 0 ? -120 : index === 1 ? -40 : index === 2 ? 40 : 120,
                      y: 32,
                      rotateZ: index === 0 ? -15 : index === 1 ? -5 : index === 2 ? 5 : 15,
                      rotateY: index === 0 ? -30 : index === 1 ? -10 : index === 2 ? 10 : 30,
                      scale: 0.9,
                      zIndex: index,
                    }}
                    animate={{
                      x: animationPhase === 1 ? 32 : index === 0 ? -120 : index === 1 ? -40 : index === 2 ? 40 : 120,
                      y: 32,
                      rotateZ: animationPhase === 1 ? 0 : index === 0 ? -15 : index === 1 ? -5 : index === 2 ? 5 : 15,
                      rotateY: animationPhase === 1 ? 0 : index === 0 ? -30 : index === 1 ? -10 : index === 2 ? 10 : 30,
                      scale: animationPhase === 1 ? 1 : 0.9,
                      zIndex: animationPhase === 1 ? 10 - index : index,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeInOut',
                      delay: layer.delay,
                    }}
                  />
                ))}

                {/* 최종 합성된 카드 */}
                <motion.div
                  className='absolute w-32 h-32 border bg-black/50 backdrop-blur-md rounded-lg shadow-xl'
                  style={{
                    x: 32,
                    y: 32,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    zIndex: 20,
                  }}
                  animate={{
                    opacity: animationPhase === 1 ? 1 : 0,
                    scale: animationPhase === 1 ? 1 : 0.5,
                    zIndex: 20,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                    delay: 1.2,
                  }}
                >
                  <div className='w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-lg' />
                </motion.div>
              </div>

              {/* 프로그레스 바 */}
              <div className='w-64 h-2 bg-gray-200 overflow-hidden'>
                <motion.div
                  className='h-full bg-'
                  initial={{ width: '0%' }}
                  animate={{ width: animationPhase === 1 ? '100%' : '0%' }}
                  transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />
              </div>

              {/* 로딩 텍스트 */}
              <motion.p
                className='text-white mt-4 text-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                레이어를 합성하는 중입니다...
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
