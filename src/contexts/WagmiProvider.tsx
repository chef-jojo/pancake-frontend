import { Web3Provider } from '@ethersproject/providers'
import React, { createContext, useContext } from 'react'
import useSWRImmutable from 'swr/immutable'
import { client } from 'utils/wagmi'
import { useAccount, WagmiConfig } from 'wagmi'

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <WagmiConfig client={client}>
      <Web3LibraryProvider>{props.children}</Web3LibraryProvider>
    </WagmiConfig>
  )
}

const Web3LibraryContext = createContext<Web3Provider>(null)

export const useWeb3LibraryContext = () => {
  return useContext(Web3LibraryContext)
}

const Web3LibraryProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { connector } = useAccount()
  const { data: library } = useSWRImmutable(connector && ['web3-library', connector], async () => {
    const provider = await connector.getProvider()
    return new Web3Provider(provider)
  })

  return <Web3LibraryContext.Provider value={library}>{props.children}</Web3LibraryContext.Provider>
}
