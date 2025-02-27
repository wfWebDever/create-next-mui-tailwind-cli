import { useMemo } from 'react'
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

import { getIp } from './getIp'
import { omitDeep } from './omitDeep'

const abortController = new AbortController()

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_URI,
  credentials: 'same-origin',
  fetchOptions: {
    signal: abortController.signal // overwrite the default abort signal
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach(({ extensions = {} }) => {
      const { errorType = '', response = null } = extensions
      if (['PERMISSION_DENIED'].includes(errorType)) {
        // window.location.href = '/login'
        // console.error(errorType)
        // new Notification('GraphQL Error', { body: `${errorType}: ${message}` })
      }
      // Login invalid case
      const { status = 0 } = response || {}
      if (status === 401) {
      }
    })
  }

  if (networkError) {
    console.error('networkError', networkError)
    // new Notification('Network Error', { body: (networkError || '').toString() })
  }
})

const createApolloClient = (req: null, params: { utmData?: any }) => {
  const { utmData = null } = params || {}

  const authMiddleware = new ApolloLink((operation, forward) => {
    // The authentication token from local storage will be changed by login-in or login-out
    // So, Get the authentication token from local storage before send the request

    if (operation.variables) {
      operation.variables = omitDeep(operation.variables, '__typename')
    }
    const token = process.env.TOKEN
    let clientIpInfo = {}

    if (req) {
      clientIpInfo = {
        'X-Forwarded-For': getIp(req)
      }
    }
    // After initialization, the utmData passed in by props is no longer changed
    // if this page not transform utmData from server side, then utmData will be null
    // but in fact the utmData in client's cookie
    // so we need to be retrieved from the cookie
    const utmDataValues = utmData
    operation.setContext(({ headers: headerData = {} }) => ({
      headers: {
        ...headerData,
        ...clientIpInfo,
        Authorization: `Bearer ${token || ''}`,
        ...utmDataValues
      }
    }))

    return forward(operation)
  })
  const link = from([authMiddleware, errorLink, httpLink])

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {}
        }
      }
    })
  })
}

const initializeApollo = (req = null, initialState = null, params: { utmData?: any } = {}) => {
  const apolloClientTmp = apolloClient ?? createApolloClient(req, params)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = apolloClientTmp.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s)))
      ]
    })

    // Restore the cache with the merged data
    apolloClientTmp.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return apolloClientTmp
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = apolloClientTmp

  return apolloClientTmp
}

const addApolloState = (client: { cache: { extract: () => any } }, pageProps: { props: any }) => {
  if (pageProps?.props) {
    const { props } = pageProps
    props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

const useApollo = (pageProps: { [x: string]: any; utmData: any }, params: object = {}) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(
    () => initializeApollo(null, state, { ...params, utmData: pageProps?.utmData }),
    [state]
  )

  return store
}

export { initializeApollo, addApolloState, useApollo }
