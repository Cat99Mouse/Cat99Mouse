<template>
	<view class="px-2">
		<view class="uni-uploader" v-if="show">
			<view class="uni-uploader-head">
				<view class="uni-uploader-title">check imgs</view>
				<view class="uni-uploader-info">{{imageList.length}}/9</view>
			</view>
			<view class="uni-uploader-body">
				<view class="uni-uploader__files">
					<block v-for="(image,index) in imageList" :key="index">
						
						<view class="uni-uploader__file position-relative">
							<image class="uni-uploader__img rounded" :src="image.url" :data-src="image.url" @tap="previewImage" mode="aspectFill"></image>
							
							<view class="position-absolute top-0 right-0 rounded" style="padding: 0 15rpx;background-color: rgba(0,0,0,0.5);" @click.stop="deleteImage(index)">
								<text class="iconfont icon-shanchu text-white"></text>
							</view>
						</view>
						
					</block>
					<view class="uni-uploader__input-box rounded">
						<view class="uni-uploader__input" @tap="chooseImage"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import permision from "@/common/permission.js"
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		props: {
			list:Array,
			show:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				title: 'choose/previewImage',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['camera', 'album', 'camera or album'],
				sizeTypeIndex: 2,
				sizeType: ['compressed', 'original', 'compressed or original'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
		},
		created() {
			this.imageList = this.list
		},
		destroyed() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['camera', 'album', 'camera or album'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['compressed', 'original', 'compressed or original'],
				this.countIndex = 8;
		},
		methods: {
			// 删除图片
			deleteImage(index){
				uni.showModal({
					title: 'alarm',
					content: 'delete the img？',
					showCancel: true,
					cancelText: 'yes',
					confirmText: 'no',
					success: res => {
						if (res.confirm) {
							this.imageList.splice(index,1)
							this.$emit('change',this.imageList)
						}
					},
				});
			},
			chooseImage: async function() {
				// #ifdef APP-PLUS
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// #endif

				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("continue?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						// 上传图片
						res.tempFilePaths.forEach(item=>{
							this.$H.upload('/image/uploadmore',{
								filePath: item,
								name: 'imglist[]',
								token:true
							}).then(result=>{
								this.imageList.push(result.data.list[0])
								this.$emit('change',this.imageList)
							})
						})
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: 'failure',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
			}
		}
	}
</script>

<style>
	.cell-pd {
		padding: 22upx 30upx;
	}

	.list-pd {
		margin-top: 50upx;
	}
</style>
