import moment from 'moment';
import jwt from 'jsonwebtoken';
export const timestampToDate = (timestamp, format = 'DD/MM/YYYY') => {
    const day = moment.unix(timestamp);
    return day.format(format);
}

export const momentObjectToDateString = (momentObject, format = 'DD/MM/YYYY') => {
    const day = moment(momentObject);
    return day.format(format);
}
export const momentObjectToTimestamp = (momentObject) => {
    return momentObject.unix();
}

export const timestampToMomentObject = (time) => {
    return moment(time * 1000)
}
export const getCurrentTimestamp = () => {
    return Math.ceil(new Date().getTime() / 1000);
}

export const isAuth = (token, typeAuth) => {
    try {
        const { exp, type } = jwt.decode(token);
        if(typeAuth && !typeAuth.find(item => item === type)) 
            return false;
        return exp > getCurrentTimestamp() && type >= 1;
    } catch (err) {
        console.log(err);
        return false;
    }
}
export function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}