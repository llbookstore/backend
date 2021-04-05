import {
    GET_AUTHORS
}
    from '../constants/actionTypes'

const initialState = [];

const authorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_AUTHORS: 
            return [...action.author]
        default:
            return state;
    }
}

export default authorReducer;