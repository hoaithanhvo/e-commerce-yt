import React from 'react'
import { Header, Banner, Navigation, Sidebar, BestSeller, DealDaily, FeatureProduct, Product, CustomSlider } from "../../components"
import { apiGetProducts } from "../../apis/index"
import Slider from 'react-slick'
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const Home = () => {
    return (
        <div className='w-full '>
            <div className='w-main m-auto flex mt-6'>
                <div className='flex flex-col gap-5 w-[25%] flex-auto'>
                    <Sidebar />
                    {/* <DealDaily /> */}

                </div>
                <div className='flex flex-col gap-5 pl-5 w-[75%] flex-auto'>
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='my-8 w-main m-auto'>
                <FeatureProduct />
            </div>
            <div className='my-8 w-main m-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>NEW ARRIVALS</h3>
                <CustomSlider />

            </div>
            <div className='my-8 w-main m-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>HOT COLLECTIONS</h3>

            </div>
            <div className='my-8 w-main m-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>BLOG POSTS</h3>
            </div>
        </div>
    )
}

export default Home