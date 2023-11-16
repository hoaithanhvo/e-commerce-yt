import React, { memo } from 'react'

const Button = ({ name, children, handleOnClick, style, fw, type = 'button' }) => {
    return (
        <button
            type={type}
            className={style ? style : `px-1 py-2 rounded-md text-white bg-main text-semibold my-2 ${fw ? 'w-1/2' : 'w-fit'}`}
            onClick={() => { handleOnClick && handleOnClick() }}
        >

            <span>{name}</span>
        </button>
    )
}

export default memo(Button)