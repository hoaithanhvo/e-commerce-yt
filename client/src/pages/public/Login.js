import React, { useState, useCallback, useEffect } from 'react'
import { InputField, Button, Loading } from '../../components'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from '../../apis/user'
import Swal from 'sweetalert2'
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom'
import path from '../../ultils/path'
import { login } from '../../store/user/userSlice'
import { showModal } from '../../store/app/appSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { validate } from '../../ultils/helpers'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    console.log(location);
    const [isRegister, setIsRegister] = useState(false)
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
    const [invalidFields, setInvalidFields] = useState([])
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: '',
    })
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: ''
        })
    }
    const [email, setEmail] = useState('')

    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload
        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)
        console.log(invalids);
        if (isRegister) {
            const respone = await apiRegister(payload)
            if (respone.success) {

                Swal.fire('Congratulation', respone.mes, 'success').then(() => {
                    setIsRegister(false)
                    resetPayload()
                })
            } else Swal.fire('Oops!', respone.mes, 'error')
        } else {
            const rs = await apiLogin(data)
            if (rs.success) {
                dispatch(login({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }))
                navigate(`/${path.HOME}`)
            } else Swal.fire('Oops!', rs.mes, 'error')
        }
    }, [payload, isRegister])
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        console.log(response);
        if (response.success) {
            toast.success(response.mes, { theme: 'colored' })
        } else toast.info(response.mes, { theme: 'colored' })
    }
    useEffect(() => {
        resetPayload()
    }, [isRegister])
    return (
        <div className='w-screen h-screen relative'>
            {isForgotPassword && <div className='absolute top-0 left-0 right-0 bottom-0 bg-white z-50 flex flex-col justify-center items-center'>
                <div className='absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
                    <div className='flex flex-col gap-4'>
                        <label htmlFor="email">Enter your email:</label>
                        <input
                            type="text"
                            id="email"
                            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                            placeholder='Exp: email@gmail.com'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className='flex items-center justify-end w-full gap-4'>
                            <Button
                                name='Submit'
                                handleOnClick={handleForgotPassword}
                                style='px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2'
                            />
                            <Button
                                className='animate-slide-right'
                                name='Back'
                                handleOnClick={() => setIsForgotPassword(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>}
            <img
                src="https://img.freepik.com/premium-photo/shopping-cart-card-icon-discounts_116441-26066.jpg"
                alt=""
                className='w-full h-full object-cover'
            />
            <div className='absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex'>
                <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
                    <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister ? 'Register' : 'Login'}</h1>
                    {isRegister && <div className='flex items-center gap-2'>
                        <InputField
                            value={payload.firstname}
                            setValue={setPayload}
                            nameKey='firstname'
                            invalidFields={invalidFields}
                            setInvalidFieds={setInvalidFields}

                        />
                        <InputField
                            value={payload.lastname}
                            setValue={setPayload}
                            nameKey='lastname'
                            invalidFields={invalidFields}
                            setInvalidFieds={setInvalidFields}

                        />
                    </div>}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFieds={setInvalidFields}

                        fullWidth
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        invalidFields={invalidFields}
                        setInvalidFieds={setInvalidFields}
                        fullWidth
                    />}

                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFieds={setInvalidFields}

                        fullWidth
                    />
                    <Button
                        name={isRegister ? 'Register' : 'Login'}
                        handleOnClick={handleSubmit}
                        invalidFields={invalidFields}
                        setInvalidFieds={setInvalidFields}
                        fw
                    />
                    <div className='flex justify-between my-2 w-full text-sm'>
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>Forgot your account?</span>}
                        {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => setIsRegister(true)}>Create account</span>}
                        {isRegister && <span className='text-blue-500 hover:underline cursor-pointer w-full text-center' onClick={() => setIsRegister(false)}>Go to login</span>}

                    </div>

                    <Link className='text-blue-500 text-sm hover:underline cursor-pointer' to={`/${path.HOME}`}>Go home?</Link>
                </div>
            </div>
        </div>
    )
}
export default Login