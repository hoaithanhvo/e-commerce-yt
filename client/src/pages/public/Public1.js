import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Navigation } from '../../components/index'

const Public = () => {
    return (
        <div className='max-h-screen overflow-y-auto flex flex-col items-center'>
            <Header />
            <Navigation />
            <div className='w-full flex items-center flex-col'>
                <Outlet />
            </div>
        </div>
    )
}

export default Public