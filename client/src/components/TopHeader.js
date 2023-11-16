import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import path from "../ultils/path"
import { useSelector, useDispatch } from 'react-redux'
import { getCurrent } from '../store/user/asyncActions'
import { logout, clearMessage } from '../store/user/userSlice'

import icons from '../ultils/icons'

const { AiOutlineLogout } = icons

const TopHeader = () => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const { isLoggedIn, current, mes } = useSelector(state => state.user)
    useEffect(() => {
        if (isLoggedIn) dispatch(getCurrent())

    }, [dispatch, isLoggedIn])

    return (
        <div className='h-[38px] w-full bg-main flex items-center justify-center'>
            <div className='w-main flex items-center justify-between text-xs text-white'>
                <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
                {isLoggedIn && current
                    ? <div className=' flex gap-4 text-sm items-center'>
                        <span>{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
                        <span
                            onClick={() => dispatch(logout())}
                            className='hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-2'>
                            <AiOutlineLogout size={18} />
                        </span>
                    </div>
                    : <Link className='hover:text-gray-800' to={`/${path.LOGIN}`}>Sign In or Create Account</Link>}
            </div>
        </div>
    )
}

export default TopHeader