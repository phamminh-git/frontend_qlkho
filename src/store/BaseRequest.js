const axios = require('axios');
import Config from '../config.js';

export default{
    _getHeaders() {
        let headers = {};
        if (window.localStorage.getItem('user')) {
            let user = JSON.parse(window.localStorage.getItem('user'));
            headers.Authorization = 'Bearer ' + user.token;
        }
        return headers;
    },
    post(url, data){
        return new Promise( (resolve, reject) =>{
            axios.post(
                Config.API_URL + url, 
                data,
                {
                    headers: this._getHeaders()
                }
            )
            .then( response => {
                resolve(response.data);
            })
            .catch( error => {
                reject(error);
            })
        })
    },
    get(url, params) {
        let headers = this._getHeaders();
        return axios.get(Config.API_URL + url, { headers, params })
    },
    delete(url) {
        let headers = this._getHeaders();
        return new Promise((resolve, reject) => {
            axios.delete(Config.API_URL + url, { headers })
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error);
                })
        })
    },
    put(url, data){
        return new Promise( (resolve, reject) =>{
            axios.put(
                Config.API_URL + url, 
                data,
                {
                    headers: this._getHeaders()
                }
            )
            .then( response => {
                resolve(response.data);
            })
            .catch( error => {
                reject(error);
            })
        })
    },
}