<template>
	<view>
		<uni-list-item :title="item.name" 
		v-for="(item,index) in list"
		:key="index" @click="handleEvent(item)">
			<view class="flex align-center text-right text-light-muted" 
			slot="right">
				{{item.data}}
			</view>
		</uni-list-item>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	import { mapState } from 'vuex'
	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				list:[]
			}
		},
		computed: {
			...mapState({
				user:state=>state.user
			})
		},
		onShow() {
			this.__init()
		},
		methods: {
			__init(){
				let list = [{
					name:"Phone",
					data:this.user.phone ? this.user.phone : "null",
					type:"navigateTo",
					url:"/pages/user-phone/user-phone"
				},{ 
					name:"Password",
					data:this.user.password ? "Refresh" : "null",
					type:"navigateTo",
					url:"/pages/user-password/user-password"
				},{ 
					name:"Bind email",
					data:this.user.email ? this.user.email : "null",
					type:"navigateTo",
					url:"/pages/user-email/user-email"
				}]
				this.list = [...list]
				this.$H.get('/user/getuserbind',{},{
					token:true
				}).then(res=>{
					this.$store.commit('editUserInfo',{
						key:"user_bind",
						value:res
					})
					let other = [{
						name:"Wechat",
						data:this.user.user_bind.weixin ? this.user.user_bind.weixin.nickname:"null",
						type:"bind",
						provider:"weixin"
					},{
						name:"Weibo",
						data:this.user.user_bind.sinaweibo ? this.user.user_bind.sinaweibo.nickname:"null",
						type:"bind",
						provider:"sinaweibo"
					},{
						name:"QQ",
						data:this.user.user_bind.qq ? this.user.user_bind.qq.nickname:"null",
						type:"bind",
						provider:"qq"
					}]
					this.list = [...this.list,...other]
				})
			},
			handleEvent(item){
				if(item.type === '') return
				switch (item.type){
					case 'navigateTo':
					uni.navigateTo({
						url: item.url,
					});
						break;
					case 'bind':
					if(item.data !== 'null'){
						return uni.showToast({
							title: 'Binded!',
							icon: 'none'
						});
					}
					this.bind(item.provider)
						break;
				}
			},
			// 绑定第三方登录
			bind(provider){
				uni.login({
					provider: provider,
					success: r => {
						uni.getUserInfo({
							provider: provider,
							success:(res)=> {
								let obj = {
									provider:provider,
									openid:res.userInfo.openId,
									nickName:res.userInfo.nickName,
									avatarUrl:res.userInfo.avatarUrl,
								}
								this.$H.post('/user/bindother',obj,{
									token:true,
									native:true
								}).then(result=>{
									if(result.data.errorCode){
										return uni.showToast({
											title: result.data.msg,
											icon: 'none'
										});
									}
									this.__init()
									uni.showToast({
										title: 'Succeed',
										icon: 'none'
									});
								})
							}
						});
					},
				});
				
			}
		}
	}
</script>

<style>

</style>
