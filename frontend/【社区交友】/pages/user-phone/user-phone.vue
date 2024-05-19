<template>
	<view>
		<view class="mb-2 flex align-stretch">
			<view class="border-bottom flex align-center justify-center font px-2">+86</view>
			<input type="text" v-model="phone" placeholder="Phone" class="border-bottom p-2 flex-1"/>
		</view>
		<view class="mb-2 flex align-stretch">
			<input type="text" v-model="code" placeholder="Verrification code" class="border-bottom p-2 flex-1"/>
			<view class="border-bottom flex align-center justify-center font-sm text-white" :class="codeTime > 0 ? 'bg-main-disabled' : 'bg-main'" style="width: 180rpx;" @click="getCode">{{codeTime > 0 ? codeTime + ' s' : 'Get code'}}</view>
		</view>
		<view class="py-2 px-3">
			<button class="bg-main text-white" style="border-radius: 50rpx;border: 0;" type="primary" :disabled="disabled" :class="disabled ? 'bg-main-disabled' : ''" @click="submit">Bind</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:"",
				code:"",
				codeTime:0,
			}
		},
		computed: {
			disabled() {
				return this.phone === '' || this.code === ''
			}
		},
		methods: {
			check(){
				var rule = /^1[34578]\d{9}$/; 
				if (!rule.test(this.phone)) {
					uni.showToast({
						title:"Illegal type",
						icon:"none"
					})
					return false;
				}
				return true
			},
			submit(){
				if (!this.check()) {
					return;
				}
				this.$H.post('/user/bindphone',{
					phone:this.phone,
					code:this.code
				},{
					token:true
				}).then(res=>{
					console.log('Succeed',res);
					this.$store.commit('editUserInfo',{
						key:'phone',
						value:this.phone
					})
					this.$store.commit('editUserInfo',{
						key:'id',
						value:res.user_id
					})
					uni.navigateBack({
						delta: 1
					});
					uni.showToast({
						title: 'Succeed',
						icon: 'none'
					});
				})
			},
			// 获取验证码
			getCode(){
				// 防止重复获取
				if (this.codeTime > 0) {
					return;
				}
				// 验证手机号
				if (!this.check()) return;
				// 请求数据
				this.$H.post('/user/sendcode',{
					phone:this.phone
				},{
					native:true
				}).then(res=>{
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					});
					// 倒计时
					this.codeTime = 60
					let timer = setInterval(()=>{
						if (this.codeTime >= 1) {
							this.codeTime--
						} else {
							this.codeTime = 0
							clearInterval(timer)
						}
					},1000)
				})
			},
		}
	}
</script>

<style>

</style>
