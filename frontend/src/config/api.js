// Production URL added for api
export const getAPIURL = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return '';
    } else {
        return 'http://humbackend.com';
    }
};
