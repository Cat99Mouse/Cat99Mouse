<template>
	<view class="flex align-center px-5 py-3">
		<!-- #ifdef APP-PLUS || MP-ALIPAY -->
		<view class="flex-1 flex align-center justify-center"
		v-for="(item,index) in providerList" :key="index"
		@click="login(item)">
			<view :class="item.icon + ' '+item.bgColor" class="iconfont font-lg text-white flex align-center justify-center rounded-circle" style="width: 100rpx;height: 100rpx;"></view>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">Login by WeChat</button>
		<!-- #endif -->
		
	</view>
</template>

<script>
	export default {
		props: {
			back: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				providerList: []
			}
		},
		mounted(){
			uni.getProvider({
				service: 'oauth',
				success: (result) => {
					this.providerList = result.provider.map((value) => {
						let providerName = '';
						let icon = ''
						let bgColor = ''
						switch (value) {
							case 'weixin':
								providerName = 'Wechat'
								icon = 'icon-weixin'
								bgColor = 'bg-success'
								break;
							case 'qq':
								providerName = 'QQ'
								icon = 'icon-QQ'
								bgColor = 'bg-primary'
								break;
							case 'sinaweibo':
								providerName = 'Weibo'
								icon = 'icon-xinlangweibo'
								bgColor = 'bg-warning'
								break;
							// #ifdef MP-ALIPAY
							case 'alipay':
								providerName = 'Alipay';
								icon='changyonglogo30';
								bgColor = 'bg-primary'
								break;
							// #endif
						}
						return {
							name: providerName,
							id: value,
							icon:icon,
							bgColor:bgColor
						}
					});
					console.log(this.providerList);
				},
				fail: (error) => {
					console.log('failure', error);
				}
			});
		},
		methods: {
			// 登录
			login(item) {
				console.log(item);
				uni.login({
					provider: item.id,
					// #ifdef MP-ALIPAY
					scopes: 'auth_user',  //支付宝小程序需设置授权类型
					// #endif
					success: res => {
						console.log(res);
						/*
						{
							"authResult": {
								"access_token": "28_ceqdzxESqQwYEFKp6LjgHZkUxkMpF6MqvCi0gr-Spwurp87utuxkHTr0nZFh7-TNZTQ4ds5ufnRoGnLsFw59NLWPWs3MNrZpOg1IsoQmfoE",
								"expires_in": 7200,
								"refresh_token": "28_FAqK9VRNebbvKiEBgG3V9lC5NHEGRuhnoXS3pkGdE3M2GTPmd2eVFWBRNbcAwF5heXPb4RWMmCXeYJOiaTUzn0TlXIcD4xFO3CnkShN5ObU",
								"openid": "oRrdQt3HS3Ns2TFCVLMOyxbR9DcM",
								"scope": "snsapi_userinfo",
								"unionid": "oU5Yytz7ielo7Xw00LMgZsPeSDkQ"
							},
							"errMsg": "login:ok"
						}
						*/
					   // 获取用户信息
					   uni.getUserInfo({
						 provider: item.id,
						 success:(infoRes)=> {
						    let obj = {
								provider:item.id,
								openid:infoRes.userInfo.openId,
								expires_in:0,
								nickName:infoRes.userInfo.nickName,
								avatarUrl:infoRes.userInfo.avatarUrl,
							}
							this.loginEvent(obj)
						 }
					   });
					},
					fail: () => {
						uni.showToast({
							title: 'failure',
							icon: 'none'
						});
					},
				});
			},
			// 登录逻辑
			loginEvent(data){
				this.$H.post('/user/otherlogin',data)
				.then(res=>{
					// 修改vuex的state,持久化存储
					this.$store.commit('login',this.$U.formatUserinfo(res))
					// 返回上一页
					if(this.back){
						uni.navigateBack({
							delta: 1
						});
					}
					uni.showToast({
						title: 'succeed',
						icon: 'none'
					});
				})
			},
			// #ifdef MP-WEIXIN
			mpGetUserInfo(result) {
				uni.showLoading({ title: 'login...', mask: true });
				// 获取失败
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.hideLoading();
					uni.showModal({
						title: 'failure to get user info',
						content: 'result' + result.detail.errMsg,
						showCancel: false
					});
					return;
				}
				let userinfo = result.detail.userInfo;
				uni.login({
					provider:"weixin",
					success: (res) => {
						this.MpLogin({
							url:"/wxlogin",
							code:res.code,
							nickName:userinfo.nickName,
							avatarUrl:userinfo.avatarUrl
						})
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},
			// #endif
			MpLogin(options){
				this.$H.post(options.url,{
					code:options.code,
					nickName:options.nickName,
					avatarUrl:options.avatarUrl
				}).then(data=>{
					// 修改vuex的state,持久化存储
					this.$store.commit('login',this.$U.formatUserinfo(data))
					// 返回上一页
					if(this.back){
						uni.navigateBack({
							delta: 1
						});
					}
					uni.showToast({
						title: 'succeed',
						icon: 'none'
					});
				});
			},
		},
	}
</script>

<style>
	
</style>
