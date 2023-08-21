import React from 'react';

const Footer = () => {
  return (
    <div className='bg-black text-white flex flex-col lg:py-14 md:py-9 py-5 lg:space-y-10 md:space-y-6 space-y-4'>
      <div className='text-center lg:text-5xl md:text-4xl text-3xl font-bold'>
        BRICKVESTOR
      </div>

      <div className='flex lg:w-[70%] md:w-[80%] w-[90%] justify-between mx-auto font-semibold lg:text-2xl md:text-lg text-sm md:uppercase lowercase'>
        <div>ARCHITECTONICDESIGNS</div>
        <div>HABITAKCLUSTER</div>
        <div>PACIFICBANK</div>
      </div>

      <div className='flex lg:w-[70%] md:w-[80%] w-[90%]  mx-auto text-center lg:text-lg md:text-base text-xs'>
        Real Estate company of the project HABITAKCLUSTER. We offer innovated and secure investment options through the blockchain 
        and smart contracts in the matic network. We believe in the fractional ownership model to make available investment options
        to everyone worlwide.
      </div>

      <div className='flex flex-col text-center lg:text-base md:text-sm text-xs'>
        <div>Phone: (+52) 22.21.85.98.27</div>
        <div>Email: info@brickvestor.com</div>
        <div>Address: Priv. Atras de la iglesia, Bugambilias, 72456, Puebla, Pue.</div>
      </div>
      
    </div>
  );
}

export default Footer;
