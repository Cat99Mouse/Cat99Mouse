import $C from '@/common/config.js';
import $store from '@/store/index.js';
export default {
	common:{
		method: 'GET',
		header:{
			"content-type":"application/json"
		},
		data:{}
	},
	request(options = {}){
		
		options.url = $C.webUrl + options.url
		options.method = options.method || this.common.method
		options.header = options.header || this.common.header
		
		// 验证权限token
		if(options.token){
			console.log('options.noCheck',!options.noCheck)
			console.log('options.notoast', !options.notoast)
			options.header.token = $store.state.token
			console.log('options.header.token', options.header.token)
			
			if(!options.noCheck && !options.header.token && !options.notoast){
				return uni.showToast({
					title: 'Illegal token, please login again',
					icon: 'none'
				});
			}
		}
		
		return new Promise((res,rej)=>{
			uni.request({
				...options,
				success: (result) => {
					// 返回原始数据
					// console.log(result);
					if(options.native){
						return res(result)
					}
					// 请求服务端失败
					if (result.statusCode !== 200 && !options.notoast) {
						uni.showToast({
							title:result.data.msg || 'failure',
							icon: 'none'
						});
						return rej(result.data)
					}
					// 成功
					res(result.data.data)
				},
				fail:(error)=>{
					uni.showToast({
						title: error.errMsg || 'failure',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	upload(url,options = {}){
		options.url = $C.uploadUrl + url
		options.header = options.header || {}
		// 验证权限token
		if(options.token){
			options.header.token = $store.state.token
			if(!options.header.token){
				return uni.showToast({
					title: 'Illegal token, please login again',
					icon: 'none'
				});
			}
		}
		
		return new Promise((res,rej)=>{
			uni.uploadFile({
				...options,
				success: (uploadFileRes) => {
					if(uploadFileRes.statusCode !== 200){
						return uni.showToast({
							title: 'upload image failed',
							icon: 'none'
						});
					}
					let data = JSON.parse(uploadFileRes.data)
					res(data)
				},
				fail:(err)=>{
					rej(err)
				}
			});
		})
		
	}
}