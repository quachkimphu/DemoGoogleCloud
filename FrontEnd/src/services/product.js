import axios from 'axios';
import {API_ROOT} from './api-config'

const baseURL = API_ROOT + 'products';

export default class ProductService {
	static getProductList = () => {	
		return axios
			.get(baseURL + '/listing')
			.then(res => res)
			.catch((err) => {
				throw err;
			});
	};

	static addProduct = (obj) => {
		return axios
			.post(baseURL + '/create', obj)
			.then(res => res)
			.catch((err) => {
				throw err;
			});
	};

	static updateProduct = (obj) => {
		return axios
			.put(baseURL + '/update?id='+obj.id, obj)
			.then(res => res)
			.catch((err) => {
				throw err;
			});
	};

	static deleteProduct = (obj) => {
		return axios({
            method: 'delete',
            url: baseURL + '/delete?id='+obj.id,
            headers: {
            },
            data: obj
        	})
			.then(res => res)
			.catch((err) => {
				throw err;
			});
	};
};