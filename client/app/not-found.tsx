export default function NotFound() {
  return (
    <div className='flex h-[90vh] w-full flex-col items-center justify-center  p-12'>
      <h1 className='font-akzidenzGrotesk text-8xl font-bold'>404 Error</h1>
      <p className='mt-4 text-2xl'>페이지를 찾을 수 없습니다.</p>
      <p className='mt-2 text-lg'>요청하신 페이지가 존재하지 않거나, 삭제되었을 수 있습니다.</p>
      <p className='mt-2 text-lg'>
        다른 페이지로 이동하시거나,{' '}
        <a href='/' className='text-blue-500 hover:underline'>
          홈페이지로 돌아가기
        </a>
        를 시도해보세요.
      </p>
    </div>
  )
}
