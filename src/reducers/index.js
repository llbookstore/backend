import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import user from './user';
import author from './author'
import sale from './sale'
import publishing_house from './publishing_house'
import category from './category'
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'author', 'sale', 'publishing_house','category']
}

const rootReducer = combineReducers({
    user, author, sale, publishing_house, category
})  

export default persistReducer(persistConfig, rootReducer);