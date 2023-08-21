// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '../context/account';
// import info from '../constants/info.json'
// import chainId from '../constants/chainId.json'

const Navbar = () => {
  const { account, connectWallet } = useAccount()

  // useEffect(() => {
  //   checkNetwork()
  // },[attemps])

  // const loader = () => {
  //   setTimeout( async()=> {

  //   },500)
  // }

  // const checkNetwork = async() => {
  //   const defaultWorkingNetwork = "maticmum"
  //   console.log("network: ", network)
  //   if(network){
  //     console.log("info[network]: ", info[network])
  //     if(!info[network]){
  //       await window.ethereum.request({method:"wallet_SwitchEthereumChain", params:[{chainId: chainId[defaultWorkingNetwork]}]})
  //     }
  //   }
  // }


  return (
    <div className='flex flex-col'>
      
      <div className='px-5 flex justify-between items-center'>
        <Link to={'/'} className='lg:text-3xl md:text-2xl text-xl font-extrabold'> 
          BRICK<span className='text-red-700'>VESTOR</span> 
        </Link>
        
        <div className='flex space-x-7 py-2 items-center'>
          <Link to={'/opportunities'} className='hover:font-semibold hover:cursor-pointer md:flex hidden'>Properties to invest</Link>
          <Link to={'/list'} className='hover:font-semibold hover:cursor-pointer md:flex hidden'>Tokenize your property</Link>
          <button className='bg-orange-500 rounded-lg text-white font-semibold lg:px-5 md:px-4 px-3 py-1 md:py-2 lg:text-base md:text-sm text-xs
          hover:bg-orange-600'
          onClick={() => connectWallet()}>
            {(account && account!=="")?  account?.slice(0,4) + "..." + account?.slice(-4):"Connect Wallet"}
          </button>
        </div>        
      </div>

      <div className='flex justify-between px-5 items-center'>
        <Link to={'/opportunities'} className='hover:font-semibold hover:cursor-pointer md:hidden flex'>Properties to invest</Link>
        <Link to={'/list'} className='hover:font-semibold hover:cursor-pointer md:hidden flex'>Tokenize your property</Link>        
      </div>


    </div>
  );
}

export default Navbar;
