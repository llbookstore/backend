
import {
    GET_USER_INFO, LOG_OUT
}
    from '../constants/actionTypes'

const initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action) {
        case GET_USER_INFO:
            return { ...action.user }
        case LOG_OUT:
            return {}
        default:
            return state;
    }
}

export default userReducer;