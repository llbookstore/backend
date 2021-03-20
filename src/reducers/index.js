import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import user from './user';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'books', 'accounts']
}

const rootReducer = combineReducers({
    user
})

export default persistReducer(persistConfig, rootReducer);