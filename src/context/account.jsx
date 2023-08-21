import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from 'ethers'
import info from '../constants/info.json'
import chainId from '../constants/chainId.json'
import axios from 'axios'
import { usePinataContext } from "../constants/pinataContext";

const accountContext = createContext()
export const useAccount = () => {
  return useContext(accountContext)
}

export const AccountContextProvider = ({children}) => {
  const { readHeader, getHeader, filter } = usePinataContext()

  const [account, setAccount] = useState("");
  const [contractProvider, setContractProvider] = useState("");
  const [contractSigner, setContractSigner] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(true);
  const [propertiesFromContext, setPropertiesFromContext] = useState([]);

  useEffect(() => {
    // loader()
    isWalletConnected()
    // eslint-disable-next-line
  },[])

  useEffect(() => {
    readFileFromIPFS()
    // eslint-disable-next-line
  },[])

  // useEffect(() => {
  //   console.log("propertiesFromContext: ", propertiesFromContext)
  // },[propertiesFromContext])

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


  // GET LISTINGS FROM PINATA
  const getImageCIDFromIPFS = async() => {
    try {
      const queryFilter = "metadata[name]=" + filter
      const url = "https://api.pinata.cloud/data/pinList?" + queryFilter
      const fetchFile = await axios.get(url, getHeader)

      const response = fetchFile.data.rows
      const output = response.map((value) => {
        let getCid = value.ipfs_pin_hash
        return getCid
      })
      return output
    } catch (error) {
      console.log(error)
    }

  }


  const readFileFromIPFS = async() => {
    try {
      const output = await getImageCIDFromIPFS()
      const listArray = []
      for (let i = 0; i < output.length; i++) {
        const value = output[i];
        const ipfsPath = "https://" + process.env.REACT_APP_IPFSGATEWAY + "/ipfs/" + value + "?pinataGatewayToken=" + process.env.REACT_APP_ACCESS_TOKEN_1
        const info = await axios.get(ipfsPath, readHeader)
        const propertyInfo = info.data.propertyInfo
        if(propertyInfo && propertyInfo.filter === filter)
          listArray.push(propertyInfo)
      }
      // setListings(listArray)  
      setPropertiesFromContext(listArray.reverse().slice(0,4))
    } catch (error) {
      console.log(error)
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

  const data = {account, networkName, contractProvider, contractSigner, isMetamaskInstalled, propertiesFromContext, 
    connectWallet, getContract, readFileFromIPFS}
  return(
    <accountContext.Provider value = {data}>
      {children}
    </accountContext.Provider>
  )
}