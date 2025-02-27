import { Box } from '@mui/material'

const Layout = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <Box className={`layout w-full ${className || ''}`}>{children}</Box>
}

export default Layout
