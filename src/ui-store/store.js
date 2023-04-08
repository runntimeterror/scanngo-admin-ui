import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

const reducer = {

}

const makeStore = () => configureStore({ reducer })
export const wrapper = createWrapper(makeStore)