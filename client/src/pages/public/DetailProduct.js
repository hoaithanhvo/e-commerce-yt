import React, { useEffect, useState } from 'react'
import { createSearchParams, useParams } from 'react-router-dom'
import { apiGetProduct } from "../../apis/product"
import { Breadcrumb } from "../../components"

const DetailProduct = () => {
    const { pid } = useParams()
    const [product, setProduct] = useState(null)
    const [category, setCategory] = useState(null)

    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: '',
        color: ''
    })
    const fetch = async () => {
        const response = await apiGetProduct(pid)
        console.log(response);

    }
    useEffect(() => {
        fetch()
    }, [pid])
    console.log(pid);
    return (
        <div className='w-full'>DetailProduct
            <Breadcrumb title={currentProduct.title || product?.title} category={category} />
            <div className='h-[81px] flex justify-center items-center bg-gray-100'><Breadcrumb /></div>
        </div>
    )
}

export default DetailProduct