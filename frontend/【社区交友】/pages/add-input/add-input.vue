<template>
	<view>
		<!-- 自定义导航 -->
		<!-- #ifdef MP -->
		<uni-nav-bar :border="false">
			<view class="flex align-center justify-center w-100"
			@click="changeIsopen">
				{{isopenText}}<text class="iconfont icon-shezhi"></text>
			</view>
		</uni-nav-bar>
		<!-- #endif -->
		<!-- #ifndef MP -->
		<uni-nav-bar left-icon="back" statusBar :border="false" @click-left="goBack">
			<view class="flex align-center justify-center w-100"
			@click="changeIsopen">
				{{isopenText}}<text class="iconfont icon-shezhi"></text>
			</view>
		</uni-nav-bar>
		<!-- #endif -->
		<!-- 文本域 -->
		<textarea v-model="content" placeholder="Say something!" class="uni-textarea px-2"/>
		<!-- 选中的分类 -->
		<view class="font-md px-2 py-1 flex">
			<view class="border px-3 py main-color main-border-color flex align-center justify-center" style="border-radius: 50rpx;">
				<text class="iconfont icon-huati mr-1"></text>
				{{post_class_name ? "Class："+post_class_name : "Select class"}}
			</view>
		</view>
		<!-- 选中的话题 -->
		<view class="font-md px-2 py-1 flex">
			<view class="border px-3 py main-color main-border-color flex align-center justify-center" style="border-radius: 50rpx;">
				<text class="iconfont icon-huati mr-1"></text>
				{{topic.title ? "Topic："+topic.title : "Select topic"}}
			</view>
		</view>
		
		<!-- 多图上传 -->
		<upload-image :show="show" ref="uploadImage" :list="imageList" @change="changeImage"></upload-image>
		
		<!-- 底部操作条 -->
		<view class="fixed-bottom bg-white flex align-center" style="height: 85rpx;">
			<picker mode="selector" :range="range" 
			@change="choosePostClass">
				<view class="iconfont icon-caidan footer-btn animated"
				hover-class="jello"></view>
			</picker>
			
			<view class="iconfont icon-huati footer-btn animated"
			hover-class="jello" @click="chooseTopic"></view>
			<view class="iconfont icon-tupian footer-btn animated"
			hover-class="jello" @click="iconClickEvent('uploadImage')"></view>
			
			<view class="bg-main text-white ml-auto flex justify-center align-center rounded mr-2 animated" hover-class="jello" style="width: 140rpx;height: 60rpx;" @click="submit">Post</view>
		</view>
		
	</view>
</template>

<script>
	const isOpenArray = ['Private','Open'];
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue';
	import uploadImage from '@/components/common/upload-image.vue';
	export default {
		components: {
			uniNavBar,
			uploadImage
		},
		data() {
			return {
				content:"",
				imageList:[],
				// 是否已经弹出提示框
				showBack:false,
				isopen:1,
				topic:{
					id:0,
					title:""
				},
				post_class_list:[],
				post_class_index:-1
			}
		},
		computed: {
			show() {
				return this.imageList.length > 0 
			},
			isopenText(){
				return isOpenArray[this.isopen]
			},
			// 文章分类可选项
			range(){
				return this.post_class_list.map(item=>{
					return item.classname
				})
			},
			post_class_id(){
				if(this.post_class_index !== -1){
					return this.post_class_list[this.post_class_index].id
				}
			},
			post_class_name(){
				if(this.post_class_index !== -1){
					return this.post_class_list[this.post_class_index].classname
				}
			},
			imgListIds(){
				return this.imageList.map(item=>{
					return {
						id:item.id,
						url:item.url
					}
				})
			}
		},
		// 监听返回
		onBackPress() {
			if ((this.content !== '' || this.imageList.length > 0) && !this.showBack ) {
				uni.showModal({
					content: 'Do you want to save？',
					showCancel: true,
					cancelText: 'no',
					confirmText: 'yes',
					success: res => {
						// 点击确认
						if (res.confirm) {
							this.store()
						} else { // 点击取消，清除缓存
							uni.removeStorage({
								key:"add-input"
							})
						}
						// 手动执行返回
						uni.navigateBack({ delta: 1 });
					},
				});
				this.showBack = true
				return true
			}
		},
		// 页面加载时
		onLoad() {
			uni.getStorage({
				key:"add-input",
				success:(res)=>{
					if (res.data) {
						let result = JSON.parse(res.data)
						this.content = result.content
						this.imageList = result.imageList
					}
				}
			})
			// 监听选择话题事件
			uni.$on('chooseTopic',(e)=>{
				this.topic.id = e.id
				this.topic.title = e.title
			})
			// 获取所有分类
			this.getPostClass()
		},
		beforeDestroy() {
			uni.$off('chooseTopic',(e)=>{})
		},
		methods: {
			// 发布
			submit(){
				if(this.topic.id == 0){
					return uni.showToast({
						title: 'Select Topic',
						icon: 'none'
					});
				}
				if(this.post_class_id == 0){
					return uni.showToast({
						title: 'Select Class',
						icon: 'none'
					});
				}
				uni.showLoading({
					title: 'Posting...',
					mask: false
				});
				this.$H.post('/post/create',{
					imglist:this.imgListIds,
					text:this.content,
					isopen:this.isopen,
					topic_id:this.topic.id,
					post_class_id:this.post_class_id
				},{
					token:true
				}).then(res=>{
					uni.hideLoading()
					uni.$emit('updateIndex')
					uni.showToast({
						title: 'Succeed',
						icon:"none"
					});
					this.showBack = true
					uni.navigateBack({
						delta: 1
					});
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			// 获取所有文章分类
			getPostClass(){
				this.$H.get('/postclass').then(res=>{
					this.post_class_list = res.list
				})
			},
			// 选择文章分类
			choosePostClass(e){
				this.post_class_index = e.detail.value
			},
			// 选择话题
			chooseTopic(){
				uni.navigateTo({
					url: '../topic-nav/topic-nav?choose=true',
				});
			},
			// 切换可见性
			changeIsopen(){
				uni.showActionSheet({
				    itemList: isOpenArray,
				    success: (res)=> {
				        this.isopen = res.tapIndex
				    }
				});
			},
			// 底部图片点击事件
			iconClickEvent(e){
				switch (e){
					case 'uploadImage':
					this.$refs.uploadImage.chooseImage()
						break;
				}
			},
			// 返回上一步
			goBack(){
				uni.navigateBack({ delta: 1 });
			},
			// 选中图片
			changeImage(e){
				this.imageList = e
			},
			// 保存操作
			store(){
				// 保存为本地存储
				let obj = {
					content:this.content,
					imageList:this.imageList
				}
				uni.setStorage({
					key:'add-input',
					data:JSON.stringify(obj)
				})
			}
		}
	}
</script>

<style>
.footer-btn{
	width: 86rpx;
	height: 86rpx;
	display: flex;
	justify-content: center;
	align-content: center;
	font-size: 50rpx;
}
</style>
