<template>
	<view>
		<uni-list-item title="Portraits" @click="changeUserpic">
			<view class="flex align-center" slot="right">
				<image :src="user.userpic ? user.userpic : '/static/default.jpg'"
				style="width: 100rpx;height: 100rpx;"
				class="rounded-circle"></image>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="Nickname">
			<view class="flex align-center" slot="right">
				<input class="uni-input text-right" v-model="username" />
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="Gender" @click="changeSex">
			<view class="flex align-center" slot="right">
				<text>{{sexText}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<picker mode="date" :value="birthday" @change="onDateChange">
			<uni-list-item title="Birthday">
				<view class="flex align-center" slot="right">
					<text>{{birthday}}</text>
					<text class="iconfont icon-bianji1 ml-2"></text>
				</view>
			</uni-list-item>
		</picker>
		<uni-list-item title="Emotion state" @click="changeEmotion">
			<view class="flex align-center" slot="right">
				<text>{{emotionText}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="Job" @click="changeJob">
			<view class="flex align-center" slot="right">
				<text>{{job}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		<uni-list-item title="Hometown" @click="showCityPicker">
			<view class="flex align-center" slot="right">
				<text>{{pickerText}}</text>
				<text class="iconfont icon-bianji1 ml-2"></text>
			</view>
		</uni-list-item>
		
		<view class="py-2 px-3">
			<button class="bg-main text-white" style="border-radius: 50rpx;border: 0;" type="primary" @click="submit">Save</button>
		</view>
		
		
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
		
	</view>
</template>

<script>
	const sexArray = ['Secret', 'Male', 'Female']
	const emotionArray = ['Secret', 'Spinsterhood ', 'Married']
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	
	import mpvueCityPicker from '@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue';
	
	import { mapState } from 'vuex'
	
	export default {
		components: {
			uniListItem,
			mpvueCityPicker
		},
		data() {
			return {
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 1],
				pickerText: '',
				
				username:"Nickname",
				sex:0,
				emotion:0,
				job:"Secret",
				birthday:"2019-03-18"
			}
		},
		// 监听返回
		onBackPress() {
		  if (this.$refs.mpvueCityPicker.showPicker) {
		  	this.$refs.mpvueCityPicker.pickerCancel();
		    return true;
		  }
		},
		// 监听页面卸载
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		onLoad() {
			let userinfo = this.user.userinfo
			if(userinfo){
				this.pickerText = userinfo.path
				this.username = this.user.username
				this.sex =  userinfo.sex
				this.emotion = userinfo.qg
				this.job  = userinfo.job
				this.birthday  = userinfo.birthday
			}
		},
		computed: {
			...mapState({
				user:state=>state.user
			}),
			sexText() {
				return sexArray[this.sex]
			},
			emotionText(){
				return emotionArray[this.emotion]
			}
		},
		methods: {
			showCityPicker(){
				this.$refs.mpvueCityPicker.show()
			},
			// 三级联动提交事件
			onConfirm(e) {
				this.pickerText = e.label
			},
			// 修改生日
			onDateChange(e){
				this.birthday = e.detail.value
			},
			// 修改头像
			changeUserpic(){
				uni.chooseImage({
					count:1,
					sizeType:["compressed"],
					sourceType:["album","camera"],
					success: (res) => {
						this.$H.upload('/edituserpic',{
							filePath: res.tempFilePaths[0],
							name: 'userpic',
							token:true
						}).then(result=>{
							console.log(result);
							this.$store.commit('editUserInfo',{
								key:"userpic",
								value:result.data
							})
							uni.showToast({
								title: 'Succeed',
								icon: 'none'
							});
						}).catch(err=>{
							console.log(err);
						})
					}
				})
			},
			// 修改性别
			changeSex(){
				uni.showActionSheet({
				    itemList: sexArray,
				    success:(res)=>{
				        this.sex = res.tapIndex
				    }
				});
			},
			// 修改情感
			changeEmotion(){
				uni.showActionSheet({
				    itemList: emotionArray,
				    success:(res)=>{
				        this.emotion = res.tapIndex
				    }
				});
			},
			// 修改职业
			changeJob(){
				let JobArray = ['Civilian','Manual worker','Aquaculture personnel','Farmer','Mechanical workers','Software developer','Other']
				uni.showActionSheet({
				    itemList: JobArray,
				    success:(res)=>{
				        this.job = JobArray[res.tapIndex]
				    }
				});
			},
			// 提交
			submit(){
				let obj = {
					name:this.username,
					sex:this.sex,
					qg:this.emotion,
					job:this.job,
					birthday:this.birthday,
					path:this.pickerText
				}
				this.$H.post('/edituserinfo',obj,{
					token:true
				}).then(res=>{
					console.log(res);
					this.$store.commit('editUserInfo',{
						key:"username",
						value:this.username
					})
					this.$store.commit('editUserUserInfo',obj)
					uni.navigateBack({
						delta: 1
					});
					uni.showToast({
						title: 'Succeed',
						icon: 'none'
					});
				})
			}
		}
	}
</script>

<style>

</style>
