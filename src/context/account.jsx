import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from 'ethers'
import info from '../constants/info.json'
import chainId from '../constants/chainId.json'

const accountContext = createContext()
export const useAccount = () => {
  return useContext(accountContext)
}

export const AccountContextProvider = ({children}) => {
  const [account, setAccount] = useState("");
  const [contractProvider, setContractProvider] = useState("");
  const [contractSigner, setContractSigner] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(true);

  useEffect(() => {
    // loader()
    isWalletConnected()
    // eslint-disable-next-line
  },[])

  const connectWallet = async() => {
    if(!window.ethereum) return setIsMetamaskInstalled(false)
    if( window.ethereum !== undefined &&  window.ethereum.request !== undefined){
      const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
      setAccount(accounts[0])
    }

    await getBasics()
  }

  const isWalletConnected = async() => {
    if(!window.ethereum) return setIsMetamaskInstalled(false)
    if( window.ethereum !== undefined &&  window.ethereum.request !== undefined){
      const accounts =  await window.ethereum.request({method:"eth_accounts"})
      setAccount(accounts[0])
    }
  
    window.ethereum.on("chainChanged", () => {
      window.location.reload()
    })

    window.ethereum.on("accountsChanged", async () => {
      await isWalletConnected()
    })

    await getBasics()
  }


  const getContract = (address, abi, providerOrSigner) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const option = {provider: provider, signer: signer}
    const contract = new ethers.Contract(address, abi, option[providerOrSigner])
    
    return contract
  }


  const getBasics = async() => {
    const networkName = await getNetwork()
    setNetworkName(networkName)

    if(info[networkName]){
      const address = info[networkName]["Nftizer"].address
      const abi = info[networkName]["Nftizer"].abi
      const contractProvider = getContract(address, abi, "provider")
      setContractProvider(contractProvider)
      // const contractSigner = getContract(address, abi, "provider")
      // setContractSigner(contractSigner)         

    }    
  }

  const getNetwork = async() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()

      checkNetwork(network.name)

      return network.name      
    } catch (error) {
      console.log(error)
    }
  }


  const checkNetwork = async(networkName) => {
    const defaultWorkingNetwork = "maticmum"

    if(!info[networkName]){
      try {
        await window.ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId: chainId[defaultWorkingNetwork]}]})
      } catch (error) {
        console.log(error)
      } 
    }
  }

  const data = {account, networkName, contractProvider, contractSigner, isMetamaskInstalled, connectWallet, getContract}
  return(
    <accountContext.Provider value = {data}>
      {children}
    </accountContext.Provider>
  )
}