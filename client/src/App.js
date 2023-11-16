import React, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom"
import {
  Login,
  Home,
  Public,
  Services,
  DetailProduct,
  FAQ,
  Blogs, FinalRegister, ResetPassword

} from './pages/public/index'
import path from './ultils/path';
import { getCategories } from './store/app/asynAction'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCategories())
  }, [])
  return (
    <div className="text-[30px] font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />} >
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route path={path.ALL} element={<Home />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />

        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />
    </div>
  );
}

export default App;
