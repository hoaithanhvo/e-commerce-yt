import React, { useState, useEffect } from 'react'
import { apiGetProducts } from '../apis/product'
import { useDispatch, useSelector } from 'react-redux'
import { getNewProducts } from '../store/products/asyncAction'

import { Product, CustomSlider } from './'
import Slider from 'react-slick'
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};
const tabs = [
    { id: 1, name: 'best sellers' },
    { id: 2, name: 'new arrivals' },
]
const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState(null);
    // const [newProducts, setnewProducts] = useState(null);
    const [activedTab, setActivedTab] = useState(1)
    const [products, setProducts] = useState(null)
    const dispatch = useDispatch()
    const { newProducts } = useSelector(state => state.products)
    console.log(newProducts);


    const fetchProduct = async () => {
        const response = await apiGetProducts({ sort: '-sold' })

        if (response.success) {
            setBestSeller(response.products)
            setProducts(response.products)
        }
        console.log(response);

    }
    useEffect(() => {
        fetchProduct()
        dispatch(getNewProducts())
    }, [])
    useEffect(() => {
        if (activedTab === 1) setProducts(bestSeller)
        if (activedTab === 2) setProducts(newProducts)

    }, [activedTab])
    return (
        <div >
            <div className='flex text-20px gap-8 pb-4 border-b-2 border-main'>
                {tabs.map(el => (
                    <span
                        key={el.id}
                        className={`font-semibold uppercase px-8 border-r cursor-pointer text-gray-400 ${activedTab === el.id ? 'text-gray-900' : ''}`}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>
            <div className='mt-4 mx-[10px]'>
                <CustomSlider products={products} activedTab={activedTab} />
            </div>
            <div className='w-full flex gap-4 mt-4'>
                <img
                    src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner"
                    className='flex-1 object-contain'
                />
                <img
                    src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-home2_2000x_crop_center.png?v=1613166657"
                    alt="banner"
                    className='flex-1 object-contain'
                />
            </div>

        </div>
    )
}

export default BestSeller