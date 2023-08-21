import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {MdCloudUpload} from "react-icons/md";
import tokens from '../constants/tokens.json'
import info from '../constants/info.json'

import listings from '../constants/listings.json'

import {usePinataContext} from '../constants/pinataContext'

import axios from "axios";
import { useAccount } from "../context/account";

const List = () => {
  // CONTEXT VARIABLE AND FUNCTIONS
  const { sendJsonHeader, filter } = usePinataContext()
  const { contractSigner, networkName, getContract } = useAccount()


  // // CONSTANTS
  // const initialState = {
  //   title: "",
  //   address: "",
  //   city: "",
  //   state: "",
  //   country: "",
  //   postalCode: "",
  //   yearBuilt: "",
  //   askingPrice: "",
  //   additionalInfo: "",
  //   floors: "",
  //   rooms: "",
  //   baths: "",
  //   garage: "",
  //   sellerName: "",
  //   sellerEmail: "",
  //   sellerPhone: "",
  //   numTokens:0,
  // };  


  // STATE VARIABLES
  const [imageResult, setImageResult] = useState();
  const [imageFile, setImageFile] = useState();
  // const [propertyInfo, setPropertyInfo] = useState(initialState);
  const [propertyInfo, setPropertyInfo] = useState(listings[0]);


  // FUNCTIONS
  const updateInfoOfProjectImage = async (e, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (e) => {
      setImageResult(e.target.result);
    };
    setImageFile(e.target.files[0]);
  };

  const handlePropertyInfo = (e, element) => {
    e.preventDefault()
    const info = { ...propertyInfo };
    info[element] = e.target.value;
    setPropertyInfo(info);
  };

  const sendFileToIPFS = async (file) => {
    const formData = new FormData();
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    formData.append("file", file);
    const opts = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", opts);
    const options = {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: process.env.REACT_APP_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_API_SECRET,
        Accept: "text/plain",
      },
    };
    const sendPic = await axios.post(url, formData, options);
    return sendPic.data.IpfsHash;
  };

  // const sendImageToIPFS = async() => {
  //   const cid = await sendFileToIPFS(imageFile);
  //   console.log("cid: ", cid)
  // }

  const sendJSONToIPFS = async (info) => {
    try {
    if (!imageFile) return;
      const cid = await sendFileToIPFS(imageFile);
      
      const ipfsImagePath ="https://" + process.env.REACT_APP_IPFSGATEWAY + "/ipfs/" + cid + "?pinataGatewayToken=" + process.env.REACT_APP_ACCESS_TOKEN_1;
      const tempInfo = { ...info };
      tempInfo["image"] = ipfsImagePath;
      tempInfo["listed"] = Date.now();
      tempInfo["filter"] = filter;
      const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
      const data = JSON.stringify({
        pinataMetadata: {
          name: filter,
        },
        pinataOptions: {
          cidVersion: 1,
        },
        pinataContent: {
          propertyInfo: tempInfo,
        },
      });
      const sendFile = await axios.post(url, data, sendJsonHeader);
      const hash = sendFile.data.IpfsHash;
      const ipfsJSONPath =
        "https://" +
        process.env.REACT_APP_IPFSGATEWAY +
        "/ipfs/" +
        hash +
        "?pinataGatewayToken=" +
        process.env.REACT_APP_ACCESS_TOKEN_1;
      return ipfsJSONPath;      
    } catch (error) {
      
    }
 
  };

  const listProperty = async () => {
    if (
      propertyInfo.title === "" ||
      propertyInfo.address === "" ||
      propertyInfo.city === "" ||
      propertyInfo.state === "" ||
      propertyInfo.country === "" ||
      propertyInfo.postalCode === "" ||
      propertyInfo.yearBuilt === "" ||
      propertyInfo.askingPrice === "" ||
      propertyInfo.floors === "" ||
      propertyInfo.rooms === "" ||
      propertyInfo.baths === "" ||
      propertyInfo.garage === "" ||
      propertyInfo.sellerName === "" ||
      propertyInfo.sellerEmail === "" ||
      propertyInfo.sellerPhone === "" ||
      propertyInfo.numTokens === "" ||
      propertyInfo.numTokens === 0 ||
      !imageResult ||
      !imageFile
    ) {
      return console.log("some empty field")
    }
    const uri = await sendJSONToIPFS(propertyInfo);

    const numTokens = propertyInfo.numTokens

    const usdt = tokens[networkName]["USDT"]["address"]

    const address = info[networkName]["Nftizer"].address
    const abi = info[networkName]["Nftizer"].abi
    const contractSigner = getContract(address, abi, "signer")


    if(contractSigner && contractSigner!=="" && uri){
      try {
        const houseMinter =  await contractSigner.safeMint(uri, numTokens.toString(), usdt)   
      } catch (error) {
        console.log(error)
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="lg:w-[60%] md:w-[70%] sm:w-[80%] w-[96%] lg:px-10 md:px-6 px-3 mx-auto flex flex-col my-10 py-10 bg-slate-100 space-y-5">
        <div className="flex justify-end"> Property Info</div>

        <div className="flex flex-col space-y-1">
          <label>
            New Listing Title <span className="text-red-500">*</span>
          </label>
          <input
            onChange={(e) => handlePropertyInfo(e, "title")}
            className="px-3 py-2 outline-none rounded-sm w-[100%]"
            placeholder="Beautiful home..."
            value={propertyInfo.title}
          />
          {propertyInfo.title}
        </div>

        <div className="flex space-x-2">
          <div className="flex flex-col space-y-1 w-[100%]">
            <label>
              Address <span className="text-red-500">*</span>{" "}
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "address")}
              className="px-3 py-2 outline-none rounded-sm"
              value={propertyInfo.address}
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between">
          <div className="flex flex-col space-y-1 py-2">
            <label>
              City <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "city")}
              className="pl-3 pr-1 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.city}
            />
          </div>
          <div className="flex flex-col space-y-1  py-2 md:mx-2 ">
            <label>
              State <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "state")}
              className="pl-3 pr-1 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.state}
            />
          </div>
          <div className="flex flex-col space-y-1  py-2">
            <label>
              Country <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "country")}
              className="pl-3 pr-1 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.country}
            />
          </div>
        </div>

        <div className="flex sm:flex-row flex-col sm:space-x-2">
          <div className="flex flex-col space-y-1 sm:w-1/5">
            <label>
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "postalCode")}
              type="number"
              className="px-3 py-2 outline-none rounded-sm"
              value={propertyInfo.postalCode}
            />
          </div>
          <div className="flex flex-col space-y-1 sm:w-1/5">
            <label>
              Year Built <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "yearBuilt")}
              type="number"
              className="pl-3 pr-1 py-2 outline-none rounded-sm"
              value={propertyInfo.yearBuilt}
            />
          </div>
          <div className="flex flex-col space-y-1 sm:w-3/5">
            <label>
              Asking Price (in ETHs) <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "askingPrice")}
              type="number"
              step="any"
              className="pl-3 pr-1 py-2 outline-none rounded-sm"
              value={propertyInfo.askingPrice}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label>Additional information </label>
          <TextareaAutosize
            rows={10}
            onChange={(e) => handlePropertyInfo(e, "additionalInfo")}
            className="px-3 py-2 outline-none rounded-sm"
            value={propertyInfo.additionalInfo}
          />
        </div>

        <div className="flex sm:flex-row flex-col justify-between sm:space-x-2">
          <div className="flex flex-col space-y-1">
            <label>
              Floors <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "floors")}
              type="number"
              className="pl-3 pr-1 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.floors}
            />
          </div>
          <div className="flex flex-col space-y-1 flex-auto">
            <label>
              Rooms <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "rooms")}
              type="number"
              className="pl-3 pr-1 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.rooms}
            />
          </div>
          <div className="flex flex-col space-y-1 flex-auto">
            <label>
              Baths <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "baths")}
              type="number"
              className="px-3 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.baths}
            />
          </div>
          <div className="flex flex-col space-y-1 flex-auto">
            <label>
              Garage <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "garage")}
              type="number"
              className="px-3 py-2 outline-none rounded-sm w-[100%]"
              value={propertyInfo.garage}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2 py-10">
          <label>
            Add Property Picture <span className="text-red-500">*</span>
          </label>

          <div className="flex sm:flex-row flex-col space-x-3">
            <form
              className="flex flex-col justify-center items-center border border-black border-dashed h-520 sm:w-[70%] cursor-pointer py-10 bg-white"
              onClick={() => document.querySelector(".input-field").click()}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateInfoOfProjectImage(e, "image")}
                className="input-field"
                hidden
              />
              <MdCloudUpload color="#1475cf" size={60} />
              <p>Select an image file </p>
              <p className="px-3 py-2 text-center">
                It must be a JPG, PNG, TIFF, or BMP, no longer than 200 MB
              </p>
            </form>
            {imageResult && (
              <div className="flex flex-col  sm:w-[30%] sm:py-0 py-3">
                <img src={imageResult} alt="" className="mx-auto sm:w-[100%] w-[50%]   " />
                <div className="w-[45%] mx-auto text-center text-xs py-3">
                  A small sample of image
                </div>
              </div>
            )}
          </div>
          {/* <button onClick={() => sendImageToIPFS()}>Upload Image To IPFS</button> */}
        </div>

        <div className="">
          <div className="py-3">Seller Info </div>
          <div className="flex flex-col space-y-1">
            <label>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "sellerName")}
              className="pl-3 pr-1 py-2 outline-none rounded-sm"
              value={propertyInfo.sellerName}
            />
          </div>
          <div className="flex md:flex-row flex-col md:space-x-2">
            <div className="flex flex-col space-y-1 md:w-3/5">
              <label>
                email <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => handlePropertyInfo(e, "sellerEmail")}
                type="email"
                id="email"
                pattern=".+@\.com"
                className="pl-3 pr-1 py-2 outline-none rounded-sm"
                value={propertyInfo.sellerEmail}
              />
            </div>
            <div className="flex flex-col space-y-1 md:w-2/5">
              <label>
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => handlePropertyInfo(e, "sellerPhone")}
                className="px-3 py-2 outline-none rounded-sm"
                value={propertyInfo.sellerPhone}
              />
            </div>
          </div>
          <div className="flex flex-col my-3">
            <label className="my-2">
              Number of tokens (in which this property will be fractionalized) <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handlePropertyInfo(e, "numTokens")}
              className="pl-3 pr-1 py-2 outline-none rounded-sm" type="number" placeholder="Example: 10,000 tokens"
              value={propertyInfo.numTokens}
            />
          </div>
        </div>


        <div className="py-10">
          <button
            onClick={() => listProperty()}
            className="bg-blue-500 w-[100%] rounded-md py-5 text-white font-bold hover:bg-blue-600"
          >
            Create NFT and Fractional Tokens of property
          </button>
        </div>
      </div>      
    </div>

  );
};

export default List;