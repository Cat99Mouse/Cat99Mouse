<template>
	<view style="height: 100rpx;"
	class="fixed-bottom flex align-center border-top bg-white">
	
		<input type="text" v-model="content" class="flex-1 rounded bg-light ml-2" style="padding: 5rpx;" :focus="focus" placeholder="Please be polite" @confirm="submit" @blur="$emit('blur')"/>
		
		<view class="iconfont icon-fabu flex align-center justify-center font-lg animated" hover-class="jello text-main" style="width: 100rpx;" @click="submit"></view>
		
	</view>
</template>

<script>
	export default {
		props: {
			focus: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				content: ""
			}
		},
		methods: {
			submit() {
				// 是否为空
				if (this.content === '') {
					return uni.showToast({
						title: 'Message cannot be empty!',
						icon: 'none'
					});
				}
				this.$emit('submit',this.content)
				// 清空输入框
				this.content = ''
			}
		},
	}
</script>

<style>
</style>
