import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-screen w-full bg-slate-700 flex items-center justify-center'>
        {children}
    </div>
  )
}

export default layout