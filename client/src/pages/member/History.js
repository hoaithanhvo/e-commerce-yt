import { apiGetOrder, apiGetUserOrders } from 'apis'
import { InputForm, Pagination } from 'components'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

const History = () => {
    const [order, setOrder] = useState(null)
    const [counts, setCounts] = useState(0)
    const [params] = useSearchParams()

    const { register, formState: { errors }, watch } = useForm()
    const q = watch('q')
    const fetchOrder = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        })
        if (response.success) {
            setCounts(response.counts)

            setOrder(response.order)
        }
    }
    useEffect(() => {
        fetchOrder()
    }, [])
    return (
        <div>
            <div className='flex justify-center items-center px-4'>
                <form className='w-[45%]'>
                    <InputForm
                        id='q'
                        register={register}
                        errors={errors}
                        fullWidth
                        placeholder='Search order by title, description,...'
                    />
                </form>
            </div>
            <table className='table-auto w-full'>
                <thead>
                    <tr className='border bg-sky-900 text-white border-white text-xs'>
                        <th className='text-center py-2'>Order</th>
                        <th className='text-center py-2'>Thumb</th>
                        <th className='text-center py-2'>Title</th>
                        <th className='text-center py-2'>Brand</th>
                        <th className='text-center py-2'>Category</th>
                        <th className='text-center py-2'>Price</th>
                        <th className='text-center py-2'>Quantity</th>
                        <th className='text-center py-2'>Sold</th>
                        <th className='text-center py-2'>Color</th>
                        <th className='text-center py-2'>Ratings</th>
                        <th className='text-center py-2'>Varriants</th>
                        <th className='text-center py-2'>UpdatedAt</th>
                        <th className='text-center py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.map((el, idx) => (
                        <tr className='border-b' key={el._id}>
                            <td className='text-center py-2'>{((+params.get('page') > 1 ? +params.get('page') - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}</td>
                            <td className='text-center py-2'>
                                {el?.products.map(item => <span>{item?.title}</span>)}
                            </td>
                            <td className='text-center py-2'>{el.total}</td>
                            <td className='text-center py-2'>{el.orderBy}</td>
                            <td className='text-center py-2'>{el.category}</td>
                            <td className='text-center py-2'>{el.price}</td>
                            <td className='text-center py-2'>{el.quantity}</td>
                            <td className='text-center py-2'>{el.sold}</td>
                            <td className='text-center py-2'>{el.color}</td>
                            <td className='text-center py-2'>{el.totalRatings}</td>
                            <td className='text-center py-2'>{el?.varriants?.length || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='w-full flex justify-end my-8'>
                <Pagination totalCount={counts} />
            </div>
        </div>
    )
}
export default History