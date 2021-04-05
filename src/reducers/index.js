import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import user from './user';
import author from './author'
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'author']
}

const rootReducer = combineReducers({
    user, author
})

export default persistReducer(persistConfig, rootReducer);