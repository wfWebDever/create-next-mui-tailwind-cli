import { Button, Container, Typography } from '@mui/material'

export default function Home() {
  return (
    <Container className="min-h-screen py-8">
      <Typography variant="h1" className="text-3xl font-bold mb-4">
        Welcome to Next.js with MUI and Tailwind CSS
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
  )
} 