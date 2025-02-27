import { gql } from '@apollo/client'
import { Button, Container, Typography } from '@mui/material'

import { ALL_DATA } from '@/graphqls/queries'
import { initializeApollo } from '@/lib/apolloClient'

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

const getServerSideProps = async ({ req }: any) => {
  const apolloClient = initializeApollo(req)
  let data = null

  try {
    data = await apolloClient.query({
      query: gql`
        ${ALL_DATA}
      `
    })
  } catch (error) {
    console.error('error data', error)
    data = {}
  }

  return {
    props: {
      data
    }
  }
}

export { getServerSideProps }
