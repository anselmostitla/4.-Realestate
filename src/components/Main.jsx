import React from 'react';
import housePuebla0 from '../images/housePuebla0.jpg'
import housePuebla1 from '../images/housePuebla1.jpg'
import housePuebla2 from '../images/housePuebla2.jpg'
import housePuebla3 from '../images/housePuebla3.jpg'
import housePuebla4 from '../images/housePuebla4.jpg'

import { Link } from 'react-router-dom';

const Main = () => {

  const styleForm = 'flex flex-col absolute right-0 text-black lg:mx-10 md:mx-5 mx-2 lg:my-14 md:my-7 my-3 lg:w-[50%] md:w-[60%] w-[70%] items-center '

  return (
    <div className=''>
      <div className={`absolute right-0 ${styleForm} lg:h-96 md:h-80 h-72`}>
        <div className="w-full h-full absolute bg-white opacity-30 rounded-lg" >
        </div>
        <div className='w-full h-full absolute lg:p-5 md:p-3 p-1 flex flex-col items-center justify-between'>
          <div className='font-bold lg:text-4xl md:text-3xl text-2xl'>BRICKVESTOR</div>
          <div className='text-orange-500 font-semibold lg:text-2xl md:text-xl text-lg'>Puebla, Pue.</div>
          <div className='text-white lg:text-lg md:text-base text-xm text-center'>The first one in short term rentals with Boutique style in Puebla</div>
          <div className='lg:text-3xl md:text-2xl text-xl text-white text-center px-5'>Co-Ownership investments from 100 usdt</div>
          <Link to={'/opportunities'} className='bg-yellow-400 rounded-xl lg:py-2 md:py-1 py-1 px-10 lg:text-base md:text-sm text-xs'>See options to invest</Link>
          <div className='text-white lg:text-base md:text-sm text-xs'>With the support of</div>
          <div className='flex space-x-5 text-white lg:text-base md:text-sm text-xs md:uppercase lowercase'>
            <div>ARCHITECTONICDESIGNS</div>
            <div>HABITAKCLUSTER</div>
            <div>PACIFICBANK</div>
          </div>
        </div>
      </div>

      <div className=''>
        <img src={housePuebla0} alt="housePuebla1" className='w-[100%]' />
      </div> 

      <div className='bg-black flex flex-col text-white py-20 space-y-10'>
        <div className='text-center lg:text-4xl md:text-3xl text-xl lg:px-5 md:px-4 px-3'>
          Brickvestor is not just a place to visit, it is a great experience of life
        </div>
        <div className='text-center lg:text-2xl md:text-xl text-base w-[70%] mx-auto'>
          Its location, unique design and more than 20 options around the city toguether with the 
          <span className='text-orange-500 font-bold px-2'> BLOCKCHAIN </span> technology, 
          is what makes Brickvestor one of the best options to invest. We offer 
        </div>

        <div className='flex lg:flex-row flex-col lg:space-y-0 space-y-5 justify-between mx-5 py-10'>
          <div className='lg:w-[30%] md:w-[50%] w-[100%] h-72 flex mx-auto flex-col justify-between'>
            <div className='text-center py-2'>The best option to invest in short term rentals with the co-ownership model.</div>
            <img src={housePuebla1} alt="housePuebla1" className='w-full aspect-video p-1 hover:p-0'/>
          </div>
          
          <div className='lg:w-[30%] md:w-[50%] w-[100%] h-72 flex mx-auto flex-col justify-between'>
            <div className='text-center py-2'>Brickvestor in Puebla has wounderful weather, not hot nor cold, a very warm weather in the entire year </div>
            <img src={housePuebla2} alt="housePuebla2" className='w-full overflow-hidden aspect-video p-1 hover:p-0 '/>
          </div>

          <div className='lg:w-[30%] md:w-[50%] w-[100%] h-72 flex mx-auto flex-col justify-between'>
          <div className='text-center py-2'>You don't need to buy a whole property or live in Puebla, better be a co-owner starting from 100 usdt</div>
            <img src={housePuebla4} alt="housePuebla4" className='w-full overflow-hidden aspect-video p-1 hover:p-0'/>
          </div>
        </div>

        <div className='text-center lg:text-2xl md:text-xl text-base lg:w-[70%] md:w-[80%] w-[90%] mx-auto'>
          Through airbnb we will get clients and manage the rentals and you will enjoy your corresponding co-ownership rentals. 
          All executed through the blockchain and smart contracts.
        </div>
      </div>

      <div className='bg-orange-500 space-y-10 flex flex-col lg:py-20 md:py-10 py-5'>
        <div className='text-center lg:text-xl md:text-lg text-base text-white font-semibold'>
          Diversify your investment portfolio at Brickvestor now with the blockchain technology.
        </div>
        <div className='text-center text-white lg:text-5xl md:text-3xl text-xl font-bold'>Be part of the fractional ownership model</div>
        <Link to={'/opportunities'} className='bg-yellow-400 lg:text-xl md:text-lg text-base text-red-600 lg:px-20 md:px-15 px-8  py-2 w-fit rounded-lg mx-auto'>See options to invest</Link>
      </div>

    </div>

  );
}

export default Main;
