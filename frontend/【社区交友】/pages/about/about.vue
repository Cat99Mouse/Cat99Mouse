<template>
	<view>
		<view class="flex align-center justify-center flex-column pt-4 pb-3">
			<image src="/static/common/nothing.png" style="width: 300rpx;height: 300rpx;" class="rounded-circle"></image>
			<text class="font text-muted mt-2">version {{version}}</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<uni-list-item title="Check New version " @click="update"></uni-list-item>
		<!-- #endif -->
		<uni-list-item title="社区用户协议"></uni-list-item>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				version:"",
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=>{ 
				this.version = widgetInfo.version;
			})
			// #endif
		},
		methods: {
			update(){
				this.$U.update(true)
			}
		}
	}
</script>

<style>

</style>
