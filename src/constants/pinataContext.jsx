import { createContext, useContext } from "react";


const pinataContext = createContext()
export const usePinataContext = () => {
  return useContext(pinataContext)
}

export const PinataContextProvider = ({children}) => {
  const readHeader = {
    "Content-Type" : "application/json"
  }
 const getHeader = {
    "headers" : {
      pinata_api_key : process.env.REACT_APP_API_KEY,
      pinata_secret_api_key : process.env.REACT_APP_API_SECRET,
    }
  }
 const sendJsonHeader = {
    "headers" : {
      "Content-Type" : "application/json",
      pinata_api_key : process.env.REACT_APP_API_KEY,
      pinata_secret_api_key : process.env.REACT_APP_API_SECRET,
    }
  }
  const filter = "amlo2"

  const data = {readHeader, getHeader, sendJsonHeader, filter}

  return(
    <pinataContext.Provider value = {data}>
      {children}
    </pinataContext.Provider>
  )
}
