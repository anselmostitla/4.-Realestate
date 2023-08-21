import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { usePinataContext } from '../constants/pinataContext';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useAccount } from '../context/account';
import { BigNumber } from 'ethers';

const Listed = () => {
  const {readHeader, getHeader, filter} = usePinataContext()
  const { contractProvider, account, propertiesFromContext } = useAccount()

  // const [listings, setListings] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgMetamask, setMsgMetamask] = useState("");

  useEffect(() => {
    loader()
    // eslint-disable-next-line
  },[attempts, account])

  // useEffect(() => {
  //   console.log("propertiesFromContext at listed: ", propertiesFromContext)
  // },[])


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
    setLoading(true)
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
      setProperties(listArray.reverse().slice(0,4))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const loader = async() => {
    setTimeout(async () => {
      // if(attempts === 0) await readFileFromIPFS()
      if(attempts === 0) setProperties(propertiesFromContext)
      if(attempts === 16){
        // readFileFromIPFS()
        // setLoading(false)
      }  
      if(contractProvider!== undefined && contractProvider!==""){
        await getAllNFTs()
      }else if(attempts <= 15){
        setAttempts(attempts+1)
      }
  
    },500)
  }

  // const getCurrentId = async() => {
  //   console.log("contractProvider: ", contractProvider)
  //   let numNFTs = await contractProvider._tokenIdCounter()
  //   numNFTs = BigNumber.from(numNFTs["_hex"]).toString()
  //   console.log("numNFTs: ", numNFTs)
  // }

  // const getTotalOfNFTs = async() => {
  //   let numNFTs = await contractProvider._tokenIdCounter()
  //   numNFTs = BigNumber.from(numNFTs["_hex"]).toString()
  //   return numNFTs
  // }

  const getAllNFTs = async() => {
    setLoading(true)
    // GET NUM TOTAL OF NFTs
    let numNFTs = await contractProvider._tokenIdCounter()
    numNFTs = BigNumber.from(numNFTs["_hex"]).toString()

    const listArray = []
    for (let i = 0; i < numNFTs; i++) {
      // GET FULL PATH CONTAINING THE CID OR URI
      const uriPath = await contractProvider.tokenURI(i)

      // READING THE INFO OF THE CORRESPONDING URI OR CID
      const info = await axios.get(uriPath, readHeader)
      let propertyInfo = info.data.propertyInfo
      propertyInfo.uriPath = uriPath
      propertyInfo.nftId = i
      if(propertyInfo && propertyInfo.filter === filter)
        listArray.push(propertyInfo)
    }
    setProperties(listArray)
    setLoading(false)
  }

  // const toLink = (nftId) => {
  //   console.log("nftId at toLink: ", nftId)
  //   if(nftId!==undefined) return "/nft/" + nftId
  //   else return "/opportunities"
  // }

  const settingMsgMetamask = () => {
    if(!window.ethereum) {
      setMsgMetamask("Please install Metamask")
      setTimeout(() => {
        setMsgMetamask("")
      }, 3000)
    }    
  }

  return (
    <div className='bg-white min-h-screen'>

      {
        // !isMetamaskInstalled && 
        // <div className='lg:w-[60%] md:w-[80%] w-[90%] bg-slate-500 text-white font-medium lg:text-5xl md:text-3xl text-xl mx-auto my-20 lg:p-20 md:p-15 p-8 text-center rounded-xl'>
        //   Please Install <span className='font-bold text-4xl px-2 text-orange-400'>METAMASK</span>  to see all the Real Estate options available to invest!
        // </div>
      }


      <div className={`${loading? 'flex':'invisible'} w-fit mx-auto text-center text-xl text-gray-500 py-5`}>
        Loading...
      </div>


      {/* <div className={`${msgMetamask==""? "text-white":"text-black"} text-5xl`}>Please Install Metamask</div>  */}

      <div className={` w-full sticky top-10 flex items-center`}>
        <div className={`${msgMetamask===""? "bg-transparent": "bg-red-500 text-white"} text-xl w-[50%] rounded-xl mx-auto text-center h-fit p-5`}>{msgMetamask}</div>
      </div>

      <div className='  mx-auto items-center'>
        {properties?.map((el,i) => (
            <div key={i} className='my-5 mx-auto p-2 flex flex-col justify-between md:h-80 h-240 w-fit border border-gray-500 rounded-xl cursor-pointer'>
              <Link to={`/${el.nftId!==undefined? `nft/${el.nftId}`:"opportunities"}`} onClick={() => settingMsgMetamask()}>
                <div className='flex lg:flex-row md:flex-row flex-col '>  
                  <div className=' w-80 overflow-hidden flex items-center h-52 mx-auto'>   
                    <img src={el.image}  alt='pic'  className=' mx-auto p-5'/>
                  </div>
                  <div className='w-80 px-5 flex flex-col justify-end h-52  mx-auto'>
                  <div className='font-semibold'>Total Tokens Issue:{el.numTokens}</div>     
                    <div className='flex justify-between w-[80%] my-5'>
                      <div className=''>
                        <div> Floors: {el.floors} </div>
                        <div> Garage: {el.garage}</div>  
                        <div>Built: {el.yearBuilt}</div>              
                      </div>
                      <div className=''>
                        <div>Rooms: {el.rooms}</div>
                        <div>Baths: {el.baths}</div>  
                        <div>Price: ${el.askingPrice}</div>  
                      </div>
                    </div>
                    <div className=''>
                      {el.additionalInfo} .
                    </div>
                </div>                 
                </div>

                <div className='flex'>
                  <div className=' mx-auto flex flex-col md:w-full w-80 px-5 py-2 space-y-5  '>
                    <div className='flex md:flex-row flex-col justify-between'>
                      <div>Seller {el.sellerName}</div>
                      <div>email: {el.sellerEmail}</div>
                      <div>Phone: {el.sellerPhone}</div>
                      
                    </div>
                    <div className='flex md:flex-row flex-col justify-between '>
                      <div>Listed since: {moment(el.listed).format("MMM Do YYYY")}</div>
                      <div className='text-right flex md:flex-row flex-col items-end'>...see more <span className='md:flex hidden px-2'> details</span></div>   
                    </div>

                  </div>   
                </div>
              </Link>
            </div>          
        ))}

      </div>



    </div>
  );
}

export default Listed