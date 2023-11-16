import React, { useState } from 'react'
import { formatMoney } from '../ultils/helpers'
import label from "../assets/label.png"
import label_blue from "../assets/label_blue.png"
import { SelectOption } from "./index"
import { renderStarFromNumber } from "../ultils/helpers"
import path from "../ultils/path"

import icons from "../ultils/icons"
import { Link } from 'react-router-dom'
const { AiFillEye,
  AiOutlineMenu, BsFillSuitHeartFill } = icons
const Product = ({ productData, isNew }) => {
  const [isShowOption, setShowOption] = useState(false)
  return (
    <div className='w-full text-base px-[10px]'>
      <Link className='w-full border p-[15px] flex flex-col items-center' to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`} onMouseEnter={e => setShowOption(true)} onMouseLeave={e => setShowOption(false)}>

        <div className=' w-full relative'>
          {
            isShowOption &&
            <div className='absolute bottom-0 left-0 right-0 flex justify-center gap-2 animate-slide-top'>
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<AiOutlineMenu />} />
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </div>
          }
          <img src={productData?.thumb || ''} alt='' className='w-[274px] h-[243px] object-cover' />
          <img src={isNew ? label : label_blue} alt='' className='absolute top-[-15px] left-[-35px] w-[120px] h-[35px] object-cover' />
          <span className='absolute font-bold top-[-10px] left-[-12px] text-white' >{isNew ? "New" : "Trending"}</span>
        </div>
        <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
          <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}</span>
          <span className='line-clamp-1'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </Link>
    </div>
  )
}
export default Product