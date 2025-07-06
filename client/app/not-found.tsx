export default function NotFound() {
  return (
    <div className='w-full h-[90vh] flex flex-col justify-center items-center  p-12'>
      <h1 className='text-8xl font-bold font-akzidenzGrotesk'>404 Error</h1>
      <p className='text-2xl mt-4'>페이지를 찾을 수 없습니다.</p>
      <p className='text-lg mt-2'>요청하신 페이지가 존재하지 않거나, 삭제되었을 수 있습니다.</p>
      <p className='text-lg mt-2'>
        다른 페이지로 이동하시거나,{' '}
        <a href='/' className='text-blue-500 hover:underline'>
          홈페이지로 돌아가기
        </a>
        를 시도해보세요.
      </p>
    </div>
  )
}
