import React from 'react'
import { SessionProvider } from 'next-auth/react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <div>
        {children}
      </div>
    </SessionProvider>
  )
}

export default Layout
