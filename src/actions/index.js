import {
    GET_ALL_ACCOUNT,
    GET_BOOKS,
    GET_USER_INFO,
    LOG_OUT,
    GET_AUTHOR
} from '../constants/actionTypes'

export const getBooks = (books) => {
    return {
        type: GET_BOOKS,
        books
    }
}
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
export const getAllAccount = (listAccount) => {
    return {
        type: GET_ALL_ACCOUNT,
        data: listAccount
    }
}
export const getAuthors = (listAuthor) => {
    return {
        type: GET_AUTHOR,
        data: listAuthor
    }
}