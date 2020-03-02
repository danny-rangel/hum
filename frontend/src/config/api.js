export const getAPIURL = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return '';
    } else {
        return 'ec2-54-67-86-233.us-west-1.compute.amazonaws.com';
    }
};
