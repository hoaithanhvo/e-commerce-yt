import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import userSlice from './user/userSlice'
import productSlice from './products/productSlice';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from "redux-persist"
const commonConfig = {
    key: 'shop/user',
    storage
}
const userConfig = {
    ...commonConfig,
    whitelist: ['isLoggedIn', 'token', 'current', 'currentCart']
}
export const store = configureStore({
    reducer: {
        app: appSlice,
        products: productSlice,
        user: persistReducer(userConfig, userSlice)
    },

});
export const persistor = persistStore(store)