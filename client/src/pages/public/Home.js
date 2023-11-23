import React from 'react'
import { Header, Banner, Navigation, Sidebar, BestSeller, DealDaily, FeatureProduct, Product, CustomSlider } from "../../components"
import { apiGetProducts } from "../../apis/index"
import Slider from 'react-slick'
import { useDispatch, useSelector } from 'react-redux'
import icons from 'ultils/icons'

const { IoIosArrowForward } = icons

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const Home = () => {
    const { newProducts } = useSelector(state => state.products)
    const { categories } = useSelector(state => state.app)
    const { isLoggedIn, current } = useSelector(state => state.user)

    console.log({ isLoggedIn, current });


    console.log("5", newProducts);
    return (
        <div className='w-full '>
            <div className='w-main m-auto flex mt-6'>
                <div className='flex flex-col gap-5 w-[25%] flex-auto'>
                    <Sidebar />
                    <DealDaily />

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
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>NEW ARRIVAL</h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider
                        products={newProducts}
                    />

                </div>
            </div>
            <div className='my-8 w-main m-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>HOT COLLECTIONS</h3>
                <div className='flex flex-wrap gap-4 mt-4'>
                    {categories?.prodCategories?.map((el, index) => (
                        <div key={index} className='w-[396px]'>
                            <div className='border flex p-4 gap-4 min-h-[190px]'>
                                <img src={el?.image} alt="" className='w-[144px] flex-1 h-[129px] object-cover' />
                                <div className='flex-1 text-gray-700'>
                                    <h4 className='font-semibold uppercase'>{el.title}</h4>
                                    <ul className='text-sm'>
                                        {el?.brand?.map(item => (
                                            <span key={item} className='flex gap-1 items-center text-gray-500'>
                                                <IoIosArrowForward size={14} />
                                                <li>{item}</li>
                                            </span>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <div className='my-8 w-main m-auto'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>BLOG POSTS</h3>
            </div>
        </div>
    )
}

export default Home