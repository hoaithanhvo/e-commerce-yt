import React, { useEffect, useState, useCallback } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct, apiGetProducts } from "../../apis"
import { Breadcrumb, Button, SelectQuantity, ProductExtraInfoItem, ProductInfomation, CustomSlider } from "../../components"
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, fotmatPrice, renderStarFromNumber } from '../../ultils/helpers'
import { productExtraInfomation } from '../../ultils/contants'

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const DetailProduct = ({ isQuickView }) => {
    const { pid, title, category } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState(null)


    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: '',
        color: ''
    })
    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return
        } else {
            setQuantity(number)
        }
    }, [quantity])
    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])
    const fetch = async () => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.productData)
        }
        console.log(response);

    }
    const fetchProducts = async () => {
        const response = await apiGetProducts({ category })
        if (response.success) setRelatedProducts(response.products)
    }
    useEffect(() => {
        fetch()
        fetchProducts()
    }, [pid])
    console.log(category, "456");
    return (
        <div className='w-full'>
            <div className='h=[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-bold'>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>
            <div className='w-main m-auto mt-4 flex'>
                <div className='flex flex-col gap-4 w-2/5'>
                    <div className='h-[458px] w-[458px]'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: '',
                                isFluidWidth: true,
                                src: product?.thumb
                            },
                            largeImage: {
                                src: product?.thumb,
                                width: 1800,
                                height: 1500
                            },
                        }} />
                    </div>
                    <div className='w-[458px]'>
                        <Slider className='image-slider flex gap-2 justify-between' {...settings}>
                            {product?.images?.map(el => (
                                <div className=' flex-1'>
                                    <img src={el} className='h-[143px] w-[143px] object-cover border ' alt='product'></img>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='w-2/5'>
                    <div className='flex item-center justify-between'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(product?.price)}VND`}</h2>
                        <span className='text-sm text-main'>{`Kho: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex items-center mt-4'>
                        {renderStarFromNumber(product?.totalRatings)?.map(el => (<span key={el}>{el}</span>))}
                        <span className='text-sm text-main'>{`Đã bán: ${product?.sold}`}</span>

                    </div>
                    <ul className='list-item text-sm text-gray-500 list-square ml-5' >
                        {product?.description?.map(el => (<li className='leading-8' key={el}>{el}</li>))}
                    </ul>
                    <div className='flex flex-col'>
                        <span className='font-semibold'>Số lượng</span>
                        <SelectQuantity
                            quantity={quantity}
                            handleQuantity={handleQuantity}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                        <Button fw>
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
                <div className=' w-1/5'>
                    {!isQuickView && <div className=''>
                        {productExtraInfomation.map(el => (
                            <ProductExtraInfoItem
                                key={el.id}
                                title={el.title}
                                icon={el.icon}
                                sub={el.sub}
                            />
                        ))}
                    </div>}
                </div>


            </div>
            {!isQuickView && <div className='w-main m-auto mt-8'>
                <ProductInfomation
                    totalRatings={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    pid={product?._id}

                />
            </div>}
            {!isQuickView && <>
                <div className='w-main m-auto mt-8'>
                    <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO LIKED</h3>
                    <CustomSlider products={relatedProducts} />
                </div>
                <div className='h-[100px] w-full'></div>
            </>}

        </div>
    )
}
export default DetailProduct