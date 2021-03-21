
import {
    GET_BOOKS
}
    from '../constants/actionTypes'

const initialState = [];

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BOOKS: 
            return [...action.books]

        default:
            return state;
    }
}

export default userReducer;