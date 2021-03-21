import {
    GET_USER_INFO,
    LOG_OUT,
} from '../constants/actionTypes'

export const getUserInfo = (user) => {
    return {
        type: GET_USER_INFO,
        user
    }
}
export const logOut = () => {
    return {
        type: LOG_OUT
    }
}
