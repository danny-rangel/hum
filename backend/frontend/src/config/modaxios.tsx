import axios from 'axios';

const MODAXIOS = axios.create({
    withCredentials: true
});

export default MODAXIOS;
