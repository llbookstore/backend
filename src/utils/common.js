import moment from 'moment';
export const timestampToDate = (timestamp, format = 'DD/MM/YYYY') => {
    const day = moment.unix(timestamp);
    return day.format(format);
}

export const momentObjectToDateString = (momentObject, format = 'DD/MM/YYYY') => {
    const day = moment(momentObject);
    return day.format(format);
}
export const momentObjectToTimestamp = (momentObject) => {
    return momentObject.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix();
}


export const getCurrentTimestamp = () => {
    return Math.ceil(new Date().getTime() / 1000);
}