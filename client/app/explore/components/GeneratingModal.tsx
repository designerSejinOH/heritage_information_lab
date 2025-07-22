import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface GeneratingModalProps {
  showGenerateModal: boolean
  setShowGenerateModal: (show: boolean) => void
}

export const GeneratingModal = ({ showGenerateModal, setShowGenerateModal }: GeneratingModalProps) => {
  const router = useRouter()
  const [animationPhase, setAnimationPhase] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (showGenerateModal) {
      setAnimationPhase(0)
      setIsCompleted(false)

      // 첫 번째 애니메이션 시작
      const timer1 = setTimeout(() => {
        setAnimationPhase(1)
      }, 500)

      // 2.5초 후 완료 상태로 변경
      const timer2 = setTimeout(() => {
        setIsCompleted(true)
      }, 2500)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [showGenerateModal])

  // 결과 페이지로 이동
  const handleGoToResult = () => {
    setShowGenerateModal(false)
    // 실제 결과 페이지 경로로 변경해주세요
    router.push('/service/explore/result')
  }

  // 모달 닫기
  const handleClose = () => {
    setShowGenerateModal(false)
    setAnimationPhase(0)
    setIsCompleted(false)
  }

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
          onClick={!isCompleted ? undefined : () => setShowGenerateModal(false)}
        >
          <motion.div
            className='bg-white/10 backdrop-blur-xl text-white rounded-lg p-8 w-3/4 h-auto aspect-[4/3] max-w-xl shadow-lg relative overflow-hidden'
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className='flex flex-col items-center justify-center h-full'>
              {!isCompleted ? (
                // 로딩 애니메이션
                <>
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
                          x:
                            animationPhase === 1 ? 32 : index === 0 ? -120 : index === 1 ? -40 : index === 2 ? 40 : 120,
                          y: 32,
                          rotateZ:
                            animationPhase === 1 ? 0 : index === 0 ? -15 : index === 1 ? -5 : index === 2 ? 5 : 15,
                          rotateY:
                            animationPhase === 1 ? 0 : index === 0 ? -30 : index === 1 ? -10 : index === 2 ? 10 : 30,
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
                  <div className='w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4'>
                    <motion.div
                      className='h-full bg-blue-500 rounded-full'
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
                    className='text-white text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    레이어를 합성하는 중입니다...
                  </motion.p>
                </>
              ) : (
                // 완료 화면
                <motion.div
                  className='flex flex-col items-center gap-6'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* 성공 아이콘 */}
                  <motion.div
                    className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 10,
                      delay: 0.2,
                    }}
                  >
                    <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                    </svg>
                  </motion.div>

                  {/* 완료 텍스트 */}
                  <div className='text-center'>
                    <motion.h3
                      className='text-2xl font-semibold text-white mb-2'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      생성이 완료되었습니다!
                    </motion.h3>
                    <motion.p
                      className='text-gray-300 text-sm'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      새로운 유물이 성공적으로 만들어졌어요
                    </motion.p>
                  </div>

                  {/* 버튼들 */}
                  <motion.div
                    className='flex gap-4 w-full max-w-xs'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      onClick={handleClose}
                      className='flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200'
                    >
                      닫기
                    </button>
                    <button
                      onClick={handleGoToResult}
                      className='flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-green-500/25'
                    >
                      결과 보기
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
