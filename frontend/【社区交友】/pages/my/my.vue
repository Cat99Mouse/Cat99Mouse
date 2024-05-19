<template>
	<view>
		<!-- 未登录 -->
		<template v-if="!loginStatus">
			<view class="flex align-center justify-center py-2 font">
				Log in and experience more
			</view>
			<other-login></other-login>
			<view class="flex align-center justify-center py-2 font text-secondary" @click="openLogin">
				account/email/phone login <text class="ml-1 iconfont icon-jinru"></text>
			</view>
		</template>

		<!-- 已登录 -->
		<view v-else class="flex align-center p-2" hover-class="bg-light">
			<image :src="avatar"
			style="width: 100rpx;height: 100rpx;"
			class="rounded-circle"></image>
			<view class="flex flex-column flex-1 px-2">
				<text class="font-lg font-weight-bold text-dark">{{user.username}}</text>
				<text class="font text-muted">
					total post{{myData[0].num}}  today post{{myData[1].num}}</text>
			</view>
			<text class="iconfont icon-jinru"></text>
		</view>
		
		<view class="flex align-center px-3 py-2">
			<view class="flex-1 flex flex-column align-center justify-center"
			v-for="(item,index) in myData" :key="index">
				<text class="font-lg font-weight-bold">{{item.num}}</text>
				<text class="font text-muted">{{item.name}}</text>
			</view>
		</view>
		
		<view class="px-3 py-2">
			<image src="http://n.sinaimg.cn/spider20210830/63/w1080h583/20210830/f911-826f13ef12d80a95299b54ed6fc141e2.jpg" mode="aspectFill"
			style="height: 170rpx;width: 100%;" class="rounded"></image>
		</view>
		
		<uni-list-item title="Browsing history" showExtraIcon @click="openHistory">
			<text slot="icon" class="iconfont icon-liulan"></text>
		</uni-list-item>
		<uni-list-item title="Certification" showExtraIcon>
			<text slot="icon" class="iconfont icon-huiyuanvip"></text>
		</uni-list-item>
		<uni-list-item title="Audit post" showExtraIcon>
			<text slot="icon" class="iconfont icon-keyboard"></text>
		</uni-list-item>
		<!-- #ifdef MP -->
		<navigator url="../user-set/user-set" hover-class="none">
		<uni-list-item title="My settings" showExtraIcon>
			<text slot="icon" class="iconfont icon-shezhi"></text>
		</uni-list-item>
		</navigator>
		<!-- #endif -->
		
		
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	import otherLogin from '@/components/common/other-login.vue';
	import { mapState } from 'vuex'
	export default {
		components: {
			uniListItem,
			otherLogin
		},
		data() {
			return {
				myData:[{
					name:"Article",
					num:0
				},{
					name:"Post",
					num:0
				},{
					name:"Comment",
					num:0
				},{
					name:"Fans",
					num:0
				}]
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '../user-set/user-set'
			});
		},
		computed: {
			...mapState({
				loginStatus:state=>state.loginStatus,
				user:state=>state.user
			}),
			// 用户头像
			avatar(){
				return this.user.userpic ? this.user.userpic : '/static/default.jpg'
			}
		},
		onShow() {
			if(this.loginStatus){
				this.getCounts()
			}
		},
		watch: {
			loginStatus(newValue, oldValue) {
				if(newValue){
					this.getCounts()
				} else {
					this.myData.forEach(item=>{
						item.num = 0
					})
				}
			}
		},
		methods: {
			// 获取用户相关数据
			getCounts(){
				this.$H.get('/user/getcounts/'+this.user.id,{},{
					token:true,
					notoast:true
				}).then(res=>{
					if(res){
						this.myData[0].num = res.post_count
						this.myData[1].num = res.today_posts_count
						this.myData[2].num = res.comments_count
						this.myData[3].num = res.withfen_count
					}
				})
			},
			// 打开登录页
			openLogin(){
				uni.navigateTo({
					url: '../login/login',
				});
			},
			openHistory(){
				uni.navigateTo({
					url: '../history/history'
				});
			}
		}
	}
</script>

<style>

</style>
