import { useMemo, useState, useEffect } from 'react'
import { list } from '../list'
import { TbDots, TbArrowUpRight, TbSearch, TbX } from 'react-icons/tb'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface SuccessModalProps {
  showModal: boolean
  handleCloseModal: () => void
  isGenerating: boolean
  generationComplete: boolean
  selectedFilters: Record<string, string>
}

interface ImageModalData {
  src: string
  alt: string
  title: string
}

// 한글 파일명을 안전하게 처리하는 강화된 컴포넌트
const RobustKoreanImage = ({
  imageName,
  alt,
  className,
  onClick,
  basePath = '/img/source',
}: {
  imageName: string | undefined
  alt: string
  className?: string
  onClick?: () => void
  basePath?: string
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [attemptIndex, setAttemptIndex] = useState(0)

  // 여러 방식의 경로 생성
  const pathAttempts = useMemo(() => {
    if (!imageName) return [`${basePath}/default.png`]

    const attempts = []

    // 1. 원본 그대로 (가장 단순)
    attempts.push(`${basePath}/${imageName}`)

    // 2. 간단한 URL 컴포넌트별 인코딩
    try {
      const pathParts = imageName.split('/')
      const encodedParts = pathParts.map((part) => encodeURIComponent(part))
      attempts.push(`${basePath}/${encodedParts.join('/')}`)
    } catch (e) {
      // 인코딩 실패시 원본 사용
    }

    // 3. 전체 경로 인코딩
    try {
      attempts.push(`${basePath}/${encodeURI(imageName)}`)
    } catch (e) {
      // 인코딩 실패시 스킵
    }

    // 4. Fetch API로 확인 후 사용 (비동기이므로 마지막에)
    attempts.push(`${basePath}/default.png`)

    return attempts
  }, [imageName, basePath])

  // imageName이 변경되면 처음부터 다시 시도
  useEffect(() => {
    setAttemptIndex(0)
    setIsLoaded(false)
    if (pathAttempts.length > 0) {
      setCurrentSrc(pathAttempts[0])
    }
  }, [imageName, pathAttempts])

  // 현재 시도 중인 경로 설정
  useEffect(() => {
    if (pathAttempts[attemptIndex]) {
      setCurrentSrc(pathAttempts[attemptIndex])
    }
  }, [attemptIndex, pathAttempts])

  const handleError = () => {
    console.warn(`이미지 로드 실패 (시도 ${attemptIndex + 1}/${pathAttempts.length}): ${currentSrc}`)

    if (attemptIndex < pathAttempts.length - 1) {
      setAttemptIndex((prev) => prev + 1)
    } else {
      console.error(`모든 경로 시도 완료: ${imageName}`)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
    console.log(`이미지 로드 성공 (시도 ${attemptIndex + 1}): ${currentSrc}`)
  }

  return (
    <img
      key={`robust-${imageName}-${attemptIndex}`}
      src={currentSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        opacity: isLoaded ? 1 : 0.8,
        transition: 'opacity 0.3s ease',
      }}
    />
  )
}

// 네트워크 요청으로 이미지 존재 여부 확인하는 함수
const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.warn(`이미지 존재 확인 실패: ${url}`, error)
    return false
  }
}

// 가장 적합한 이미지 경로를 찾는 함수
const findBestImagePath = async (imageName: string | undefined, basePath: string = '/img/source'): Promise<string> => {
  if (!imageName) return `${basePath}/default.png`

  const candidates = [
    `${basePath}/${imageName}`, // 원본
    `${basePath}/${encodeURIComponent(imageName)}`, // URL 인코딩
    `${basePath}/${encodeURI(imageName)}`, // URI 인코딩
  ]

  // 각 후보를 순차적으로 확인
  for (const candidate of candidates) {
    try {
      const exists = await checkImageExists(candidate)
      if (exists) {
        console.log(`최적 경로 발견: ${candidate}`)
        return candidate
      }
    } catch (error) {
      continue
    }
  }

  console.warn(`모든 후보 실패, 기본 이미지 사용: ${imageName}`)
  return `${basePath}/default.png`
}

export const SuccessModal = ({
  showModal,
  handleCloseModal,
  isGenerating,
  generationComplete,
  selectedFilters,
}: SuccessModalProps) => {
  const [imageModal, setImageModal] = useState<ImageModalData | null>(null)

  const dataset = list
  const resultItem = dataset.find(
    (item) =>
      item.형태 === selectedFilters.형태 &&
      item.재질 === selectedFilters.재질 &&
      item.시대 === selectedFilters.시대 &&
      item.용도 === selectedFilters.용도,
  )

  const handleImageClick = (imageData: ImageModalData) => {
    setImageModal(imageData)
  }

  const handleImageModalClose = () => {
    setImageModal(null)
  }

  // 이미지 클릭 핸들러 - 비동기로 최적 경로 찾기
  const createAsyncImageClickHandler = (imageName: string | undefined, name: string) => {
    return async () => {
      const bestPath = await findBestImagePath(imageName, '/img/source')
      handleImageClick({
        src: bestPath,
        alt: name,
        title: name,
      })
    }
  }

  console.log('resultItem:', resultItem)
  console.log('selectedFilters:', selectedFilters)

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-50 flex items-end justify-center bg-black/50'
          >
            <div className='bg-white/10 backdrop-blur-md w-full h-full border border-white/20'>
              {!generationComplete && (
                <button
                  onClick={handleCloseModal}
                  className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              )}

              {/* 로딩 애니메이션 */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='w-full h-full relative flex flex-col justify-center items-center gap-4 mb-6'
                  >
                    <div className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
                    <p className='text-white/80 animate-pulse'>선택된 메타데이터를 통해 유물을 찾고 있습니다...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 생성 완료 메시지 */}
              <AnimatePresence>
                {generationComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='w-full h-full flex flex-col py-3'
                  >
                    {/* Search Bar */}
                    <div className='w-full h-[8vh] px-6 py-3 flex flex-row gap-6 mb-1'>
                      <div className='flex-shrink-0 h-full flex items-center justify-start'>
                        <h2 className='text-white text-4xl font-semibold'>눈으로 보는 유물의 길 </h2>
                      </div>
                      <div className='w-full relative text-2xl h-full border-[1.5px] border-white rounded-2xl flex items-center justify-start'>
                        <div className='h-full aspect-square w-auto flex items-center justify-center'>
                          <TbSearch />
                        </div>
                        <input
                          type='text'
                          placeholder='유물에 대한 상세 검색을 해보세요.'
                          className='w-full bg-transparent rounded-lg placeholder:opacity-70 text-white outline-none'
                        />
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className='w-auto h-full aspect-square text-2xl flex items-center justify-center border-[1.5px] border-white rounded-2xl bg-white text-black hover:bg-black hover:text-white transition-colors'
                      >
                        <TbX />
                      </button>
                    </div>

                    {/* content */}
                    <div className='w-full h-[48vh] flex flex-row gap-8 px-6 py-3'>
                      {/* Left Panel - 메인 유물 이미지 */}
                      <main className='w-3/5 h-full aspect-square rounded-3xl relative overflow-hidden'>
                        <span className='absolute top-6 left-6 text-white text-2xl font-semibold leading-tight z-10'>
                          당신이 찾는 유물이 맞나요?
                        </span>

                        {/* 한글 파일명을 완벽 지원하는 메인 이미지 */}
                        <RobustKoreanImage
                          imageName={resultItem?.image}
                          alt={resultItem?.명칭 || '유물 이미지'}
                          className='w-full h-full object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform'
                          onClick={createAsyncImageClickHandler(resultItem?.image, resultItem?.명칭 || '유물')}
                        />

                        {/* 디버깅 정보 */}
                        {resultItem && (
                          <div className='absolute bottom-2 left-2 text-xs text-white/50 bg-black/30 p-2 rounded'>
                            Debug: {resultItem.image || 'No image'}
                          </div>
                        )}
                      </main>

                      {/* Right Panel */}
                      <aside className='flex-1 overflow-y-auto p-6 rounded-3xl bg-black'>
                        <h2 className='text-white text-2xl font-semibold mb-6'>당신이 찾은 유물은 주로...</h2>

                        <div className='flex flex-col gap-4 justify-start items-start'>
                          <div className='flex flex-col justify-start gap-2'>
                            <span className='opacity-50 text-base'>유물 명칭</span>
                            <p className='w-full text-white break-keep text-base font-semibold'>
                              {resultItem?.명칭 || '생성된 유물이 없습니다.'}
                            </p>
                          </div>
                          <div className='flex flex-col justify-start gap-2'>
                            <span className='opacity-50 text-base'>유물 설명</span>
                            <p className='w-full text-white break-keep text-base'>
                              {resultItem?.description || '유물에 대한 설명이 없습니다.'}
                            </p>
                          </div>
                          <div className='flex flex-col justify-start gap-2'>
                            <span className='opacity-50 text-base'>유물 메타데이터</span>
                            <ul className='w-full text-white text-base'>
                              <li className='flex justify-start gap-4'>
                                <span className='opacity-70'>형태</span>
                                <span>{resultItem?.형태}</span>
                              </li>
                              <li className='flex justify-start gap-4'>
                                <span className='opacity-70'>재질</span>
                                <span>{resultItem?.재질}</span>
                              </li>
                              <li className='flex justify-start gap-4'>
                                <span className='opacity-70'>시대</span>
                                <span>{resultItem?.시대}</span>
                              </li>
                              <li className='flex justify-start gap-4'>
                                <span className='opacity-70'>용도</span>
                                <span>{resultItem?.용도}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </aside>
                    </div>

                    <div className='w-full h-[36vh] flex flex-row px-6 py-3 gap-8 items-center justify-between'>
                      {/* 추천 유물 섹션 */}
                      <div className='w-[70%] h-full flex flex-col items-start justify-start gap-3'>
                        <div className='text-2xl w-full font-semibold py-3 text-white'>이런 유물을 추천드려요</div>
                        <div className='w-full h-full flex flex-row items-start justify-start gap-6'>
                          {resultItem?.recommended_items?.length ? (
                            resultItem.recommended_items.map((item, index) => (
                              <div
                                className='w-1/3 h-full p-6 relative flex flex-col items-start justify-start gap-6 bg-black text-white rounded-3xl'
                                key={index}
                              >
                                <div
                                  className='w-auto h-[14vh] aspect-square cursor-pointer hover:scale-105 transition-transform'
                                  onClick={createAsyncImageClickHandler(item.image, item.name)}
                                >
                                  {/* 한글 파일명을 완벽 지원하는 추천 이미지 */}
                                  <RobustKoreanImage
                                    imageName={item.image}
                                    alt={item.name}
                                    className='w-full h-full object-cover rounded-xl'
                                  />
                                </div>
                                <span className='text-xl font-semibold break-keep'>{item.name}</span>
                                <button className='absolute bottom-4 right-4 text-xl rounded-2xl text-white border-[1.5px] border-white flex items-center justify-center p-2 bg-black/20 hover:bg-white hover:text-black transition-colors'>
                                  <TbDots />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className='w-full h-full flex items-center justify-center bg-black text-white rounded-3xl text-lg'>
                              추천할 수 있는 유물이 없습니다.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 관련 프로젝트 섹션 */}
                      <div className='flex-1 h-full flex flex-col items-start justify-start gap-3'>
                        <div className='text-2xl w-full font-semibold py-3 text-white'>관련된 프로젝트 및 전시</div>
                        <div className='w-full h-full flex flex-row items-start justify-start gap-6'>
                          {resultItem?.related_projects?.length ? (
                            resultItem.related_projects.map((project, index) => (
                              <div
                                key={index}
                                className='w-full relative h-full p-6 flex flex-col items-end justify-start gap-6 bg-black text-white rounded-3xl'
                              >
                                <div
                                  className='w-full h-[12vh] relative cursor-pointer hover:scale-105 transition-transform'
                                  onClick={createAsyncImageClickHandler(project.image, project.name)}
                                >
                                  {/* 한글 파일명을 완벽 지원하는 프로젝트 이미지 */}
                                  <RobustKoreanImage
                                    imageName={project.image}
                                    alt={project.name}
                                    className='w-full h-full object-contain rounded-xl bg-white aspect-square'
                                  />
                                </div>
                                <div className='w-full h-full text-white text-base font-semibold break-keep'>
                                  {project.name}
                                </div>
                                <button className='absolute bottom-4 right-4 text-xl rounded-2xl text-white border-[1.5px] border-white flex items-center justify-center p-2 bg-black/20 hover:bg-white hover:text-black transition-colors'>
                                  <TbArrowUpRight />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className='w-full h-full flex items-center justify-center bg-black text-white rounded-3xl text-lg'>
                              관련된 프로젝트가 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className='flex w-full h-fit flex-row items-center justify-between gap-4 px-8 py-3'>
                      <div className='flex h-fit w-fit flex-row items-center justify-center gap-6'>
                        <Image
                          src='/img/전통대-워드타입B.png'
                          alt='한국전통문화대학교'
                          width={200}
                          height={200}
                          className='w-24'
                        />
                        <Image
                          src='/img/중앙박물관-화이트.png'
                          alt='국립중앙박물관'
                          width={200}
                          height={200}
                          className='w-24'
                        />
                        <Image
                          src='/img/에트리-워드타입.png'
                          alt='한국전자통신연구원'
                          width={200}
                          height={200}
                          className='w-28'
                        />
                      </div>
                      <div className='flex-shrink-0 text-sm text-gray-500'>
                        © {new Date().getFullYear()} Heritage Information Lab. All rights reserved.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {imageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm'
            onClick={handleImageModalClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl'
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={handleImageModalClose}
                className='absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors'
              >
                <TbX className='w-6 h-6' />
              </button>

              {/* 확대된 이미지 - 다중 fallback 처리 */}
              <div className='relative'>
                <img
                  src={imageModal.src}
                  alt={imageModal.alt}
                  className='w-full h-auto max-h-[70vh] object-contain'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    console.warn(`확대 이미지 로드 실패: ${target.src}`)

                    // 원본 URL에서 다른 인코딩 방식 시도
                    const originalSrc = target.src
                    if (originalSrc.includes('img/source/')) {
                      const imagePath = originalSrc.split('img/source/')[1]
                      try {
                        // URL 디코딩 후 다시 시도
                        const decodedPath = decodeURIComponent(imagePath)
                        target.src = `/img/source/${decodedPath}`
                      } catch (decodeError) {
                        target.src = '/img/source/default.png'
                      }
                    } else {
                      target.src = '/img/source/default.png'
                    }
                  }}
                />
              </div>

              {/* 정보 패널 */}
              <div className='p-6 bg-white'>
                <h3 className='text-2xl font-bold text-black mb-2'>{imageModal.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
