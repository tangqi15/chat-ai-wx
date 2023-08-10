<template>
  <view class="" hover-class="none" hover-stop-propagation="false">
    <van-field name="uploader" label="头像" class="pics">
      <template #input>
        <van-uploader
          @after-read="afterRead"
          preview-size="2rem"
          :max-count="5"
          deletable
        />
      </template>
    </van-field>
    <van-button
      round
      block
      type="info"
      size="small"
      native-type="submit"
      color="##5994ef"
      @click="submitPic"
      >提交</van-button
    >
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import upload from "@/common/upload";

export default Vue.extend({
  components: {},
  data() {
    return {};
  },
  methods: {
    async afterRead(e: any) {
      const { file } = e.detail;
      console.log(e, file, "ccccc");
      console.log(e, "ccccc");
      const uploadPath: any = await upload(file.url);
      console.log(uploadPath, "uploadPath");
    },
    async submitPic() {},
  },
});
</script>

<style lang="scss" scoped>
.pics {
  width: 500px;
  height: 500px;
  border: 1px solid red;
}
.pics ::v-deep .van-field__body {
  height: 500rpx;
}
</style>
