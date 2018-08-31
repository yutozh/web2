<template>
  <div class="admin-content-wrapper" id="container">
    <h3>文件上传</h3>
    <div class="upload-btn">
      <input class="ui button purple" type="file" id="startUpload">开始上传</input>
    </div>
    <p id="result"></p>
    <div>
      <table class="ui celled fixed table">
        <thead>
        <tr>
          <th>文件名</th>
          <th>大小</th>
          <th>进度</th>
        </tr>
        </thead>
        <tbody id="fsUploadProgress">
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import '../../../node_modules/cos-js-sdk-v4/dist/cos-js-sdk-v4'

const $ = window.$

export default {
  data () {
    return {}
  },
  mounted () {
    let cos = new CosCloud({
      appid: '1251419385', // APPID 必填参数
      bucket: 'resource', // bucketName 必填参数
      region: 'gz', // 地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
      getAppSign: function (callback) {
        // 获取签名 必填参数

        // 下面简单讲一下获取签名的几种办法

        // 1.搭建一个鉴权服务器，自己构造请求参数获取签名，推荐实际线上业务使用，优点是安全性好，不会暴露自己的私钥
        // 拿到签名之后记得调用callback
        this.$http.get(this.$api.adminAPI.uploadTokenQC, {
          params: {type: 'multi'}
        }).then((res) => {
          const data = res.data
          let sig = data.sign
          callback(sig)
        }).catch((e) => {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
          console.log(e)
        })
        // $.ajax({
        //   url: '/adminAPI/uploadTokenQC',
        //   type: 'get',
        //   data: {type: 'multi'},
        //   success: function (data) {
        //     let sig = data.sign
        //     callback(sig)
        //   }
        // })

        // 2.直接在浏览器前端计算签名，需要获取自己的accessKey和secretKey, 一般在调试阶段使用
        // 拿到签名之后记得调用callback
        // let res = getAuth(); //这个函数自己根据签名算法实现
        // callback(res);

        // 3.直接复用别人算好的签名字符串, 一般在调试阶段使用
        // 拿到签名之后记得调用callback
        // callback('YOUR_SIGN_STR')
        //
      },
      getAppSignOnce: function (callback) { // 单次签名，必填参数，参考上面的注释即可
        this.$http.get(this.$api.adminAPI.uploadTokenQC, {
          params: {type: 'single', file: ''}
        }).then((res) => {
          const data = res.data
          let sig = data.sign
          callback(sig)
        }).catch((e) => {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
          console.log(e)
        })
        // $.ajax({
        //   url: '/adminAPI/uploadTokenQC',
        //   type: 'get',
        //   data: {type: 'single', file: ''},
        //   success: function (data) {
        //     let sig = data.sign
        //     callback(sig)
        //   }
        // })
      }
    })

    let myFolder = '/111/' // 需要操作的目录
    let successCallBack = function (result) {
      $('#result').val(JSON.stringify(result))
    }

    let errorCallBack = function (result) {
      result = result || {}
      $('#result').val(result.responseText || 'error')
    }

    let progressCallBack = function (curr) {
      $('#result').val('uploading... curr progress is ' + curr)
    }

    $('#startUpload').off('change').on('change', function (e) {
      let file = e.target.files[0]
      cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + file.name, file, 0)
      return false
    })
  }
}
</script>

<style>
  .upload-btn {
    margin: 2em auto;
    display: inline-block;
    text-align: justify;
    width: 100%;
  }

  .admin-content-wrapper {
    padding-top: 60px;
  }

  .admin-content-wrapper form label {
    text-align: left;
  }

  .progress-item .info {
    word-break: break-all;
  }

  .progress-item .info .status {

  }

  .progress-item .info .progressCancel {

  }

  .ui.progress:first-child {
    margin-bottom: 5px !important;
  }
</style>
