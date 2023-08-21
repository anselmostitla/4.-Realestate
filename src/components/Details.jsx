import React, { useEffect, useState } from 'react';
import { usePinataContext } from '../constants/pinataContext';
import { useAccount } from '../context/account';
import { useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import info from '../constants/info.json'
import tokens from '../constants/tokens.json'
import { BigNumber } from 'ethers';

const Details = () => {
  const {readHeader} = usePinataContext()
  const { account, networkName, contractProvider, getContract, connectWallet} = useAccount()
  const {id} = useParams()

  const [attempts, setAttempts] = useState(0);
  const [propertyInfo, setPropertyInfo] = useState([]);
  // const [tokenAddress, setTokenAddress] = useState("");
  const [fractionalTokenAddress, setFractionalTokenAddress] = useState("");
  const [numTokens, setNumTokens] = useState(0);
  const [fiatContract, setFiatContract] = useState(undefined);
  const [fiatDecimals, setFiatDecimals] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [fiatAmount, setFiatAmount] = useState(0);
  const [msgInput, setMsgInput] = useState("");
  const [isNumTokens, setIsNumTokens] = useState(true);

  useEffect(() => {
    // loader()
    getDetails()
    // eslint-disable-next-line
  },[contractProvider])

  useEffect(() => {
    getFiatInfo()
    // eslint-disable-next-line
  },[networkName])

  useEffect(() => {
    setTimeout(async() => {
      checkAllowance()
    },500)
    // eslint-disable-next-line
  },[isApproving,fiatContract, account, fractionalTokenAddress, attempts])

  // const loader =  () => {
  //   setTimeout(async() => {
  //     console.log("contractProvider: ", contractProvider)
  //     console.log("attempts: ", attempts)
  //     if(contractProvider){
  //       await getDetails()
  //     }else if(attempts<15){ setAttempts(attempts+1) }
  //   },500)
  // }

  const getDetails = async() => {
      // GET FULL PATH CONTAINING THE CID OR URI
      console.log("contractProvider at getDetails: ", contractProvider)
      if(contractProvider!=="") {
        const uriPath = await contractProvider.tokenURI(id)
        const fractionalTokenAddress = await contractProvider.AddressOfErc20AssociatedToNFTid(id)
        setFractionalTokenAddress(fractionalTokenAddress)
        // const tokenAddress = await contractProvider.AddressOfErc20AssociatedToNFTid(id)
        // setTokenAddress(tokenAddress)
        // console.log("tokenAddress: ", tokenAddress)

        const properties = []
        const info = await axios.get(uriPath, readHeader)
        const propertyInfo = info.data.propertyInfo
        properties.push(propertyInfo)
        setPropertyInfo(properties)        
      }

  }

  // const buy2 = async() => {
  //   // To buy, user has to approve and pay the corresponding usdt or stable token to the smart contract
  //   // 
  //   try {
  //     // const addressNftizer = info[networkName]["Nftizer"].address

  //     const abiFractionalizer = info[networkName]["Fractionalizer"].abi
  //     // const addressFractionalizer = info[network]["Fractionalizer"].address
      
  //     const tokenContract = getContract(tokenAddress, abiFractionalizer, "signer")
      
  //     const fiatTokenAddress = tokens[networkName]["USDT"].address
  //     const ERC20abi = tokens["ERC20abi"]
  //     const fiatContract = getContract(fiatTokenAddress, ERC20abi, "signer")
  //     const decimals = await fiatContract.decimals()
      
  //     const fiatAmount = priceInUsdtForTokens()*10**decimals
  //     console.log("fiatAmount: ", fiatAmount)
  //     await fiatContract.approve(tokenAddress, fiatAmount.toString())
      
      
      
  //     // console.log("abi: ", abiFractionalizer)
  //     // console.log("tokenContract: ", tokenContract)
  //     // console.log("addressNftizer: ", addressNftizer)
  //     const decimalsToken = await tokenContract.decimals()
  //     const scaleNumTokens = numTokens*10**decimalsToken
  //     const scalePriceInUsdtForTokens = priceInUsdtForTokens()*10**decimals
  //     await tokenContract.buy(scaleNumTokens.toString(), scalePriceInUsdtForTokens.toString())      
  //   } catch (error) { 
  //   }
  // }

  const getFiatInfo = async () => {
    console.log("account at getFiatInfo: ", account)
    if(networkName!=="" && account!=="" && account){
      console.log("networkName: ", networkName)
      const fiatTokenAddress = tokens[networkName]["USDT"].address
      const ERC20abi = tokens["ERC20abi"]
      const fiatContract = getContract(fiatTokenAddress, ERC20abi, "signer")
      const fiatDecimals = await fiatContract.decimals()
      setFiatContract(fiatContract)
      setFiatDecimals(fiatDecimals)      
    }
  }


  const approve = async() => {
    try {
      if(numTokens<=0) {
        setIsNumTokens(false)
        setTimeout(()=> {
          setIsNumTokens(true)
        },4000)
        return 
      }
      if(account==="" || !account) connectWallet()
      const fiatAmount = priceInUsdtForTokens()*10**fiatDecimals
      setFiatAmount(fiatAmount)
      await fiatContract.approve(fractionalTokenAddress, fiatAmount.toString())
      setIsApproving(true)
      setAttempts(0)
    } catch (error) {
      console.log(error)
    }
  }


  const checkAllowance = async () => {
    if(isApproving && fiatContract && account && account!=="" && fractionalTokenAddress){
      let allowance = await fiatContract.allowance(account, fractionalTokenAddress)
      allowance = BigNumber.from(allowance["_hex"]).toString()
      console.log("allowance: ", allowance)
      console.log("fiatAmount at :", fiatAmount)
      if(allowance >= fiatAmount){
        setIsApproving(false)
        try {
          await buy()
        } catch (error) {
          console.log(error)
        }
      }
      else setAttempts(attempts+1)
    }
  }


  const buy = async () => {
    if(networkName!=="" && fractionalTokenAddress!==""){
      const abiFractionalizer = info[networkName]["Fractionalizer"].abi
      const fractionalContract = getContract(fractionalTokenAddress, abiFractionalizer, "signer")
      const fractionalDecimals = await fractionalContract.decimals()
      const scaleNumTokens = numTokens*10**fractionalDecimals
      const scalePriceInUsdtForTokens = priceInUsdtForTokens()*10**fractionalDecimals
      await fractionalContract.buy(scaleNumTokens.toString(), scalePriceInUsdtForTokens.toString())        
    }
  }


  // getValueInUsdt
  const priceInUsdtForTokens = () => {
    const askingPrice = propertyInfo[0]?.askingPrice
    const totalTokensMinted = propertyInfo[0]?.numTokens
    const pricePerToken = askingPrice/totalTokensMinted
    const priceOftokens = pricePerToken*numTokens
    // console.log("askingPrice :", askingPrice)
    // console.log("totalTokensMinted :", totalTokensMinted)
    // // console.log(" :", )
    // // console.log(" :", )
    // console.log("priceOftokens: ", priceOftokens)
    return priceOftokens
  }

  return (
    <div>
      <div className='  mx-auto items-center'>
        {propertyInfo?.map((el,i) => (
            <div key={i} className='my-5 mx-auto p-2 flex flex-col justify-between md:h-80 h-240 w-fit border border-gray-500 rounded-xl'>
                <div className='flex lg:flex-row md:flex-row flex-col '>  
                  <div className=' w-80 overflow-hidden flex items-center h-52 mx-auto'>   
                    <img src={el.image}  alt='pic'  className=' mx-auto p-5'/>
                  </div>
                  <div className='w-80 px-5 flex flex-col justify-end h-52  mx-auto'>
                  <div className='font-semibold'>Total Tokens Issue: {el.numTokens}</div>      
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
                      {el.additionalInfo}.
                    </div>
                </div>                 
                </div>

                <div className='flex'>
                  <div className=' mx-auto flex flex-col justify-between md:w-full w-80 px-5 py-2  '>
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
            </div>          
        ))}



        <div className='lg:w-[60%] md:w-[70%] w-[90%] mx-auto px-10 space-y-5 py-5'>
          <div className='py-5 md:text-sm text-xs'>
            Fractional Token Address: {fractionalTokenAddress}
          </div>          
          <div className='text-center lg:text-4xl md:text-2xl text-lg font-semibold'>
            Become a co-owner
          </div>

          <div className='text-center lg:text-xl md:text-base text-sm'>
            With fractional ownership model, you can become an investor in real estate.
          </div>  

          <div className='text-center lg:text-xl md:text-base text-sm'>
            Enjoy 15% apr and the appretiation of the asset, all without having to buy a whole house.
          </div> 

          <div className='flex flex-col lg:py-10 md:py-6 py-3 space-y-2'>
            <label >Number of tokens to own</label>       
            <input type="number" step="any" className='border outline-none p-2' placeholder='For example: 100.5 tokens' 
            onChange={e => setNumTokens(e.target.value)}/>     
            <div className={`${isNumTokens?'invisible':'flex'} text-red-500`}>
              Required field
            </div>
            

            <div className={`${numTokens>0? "flex":'invisible'} flex-row lg:text-base md:text-sm text-xs text-center`}>
              To buy the selected number of tokens, the corresponding investment amount is: ${priceInUsdtForTokens()} usdt
            </div>                   
          </div>





          <button className='bg-blue-500 rounded-xl text-white py-3 w-full text-lg font-bold hover:bg-blue-600 my-10'
            onClick={() => approve()}
          >
            Buy tokens
          </button>

        </div>



      </div>
    </div>
  );
}

export default Details;
