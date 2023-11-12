import React, { memo } from 'react'
// import { apiGetCategories } from "../apis/app"
import { NavLink } from 'react-router-dom'
import { createSlug } from '../ultils/helpers'
import { useSelector } from 'react-redux'

const Sidebar = () => {
    // const [categories, setCategories] = useState(null)
    // const fetchCategories = async () => {
    //     const respone = await apiGetCategories()
    //     if (respone.success) setCategories(respone.prodCategories)
    // }
    // useEffect(() => {
    //     fetchCategories()
    // }, [])
    const { categories } = useSelector(state => state.app)
    console.log(categories);
    return (
        <div className='flex flex-col border'>
            {categories?.prodCategories?.map(el => (
                <NavLink
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    className={({ isActive }) => isActive
                        ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
                        : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                >
                    {el.title}
                </NavLink>
            ))}
        </div>
    )
}

export default memo(Sidebar)