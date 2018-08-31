<template>
  <div class="admin-content-wrapper" id="container">
    <h3>文件上传</h3>
    <div class="upload-btn">
      <button class="ui button purple" type="submit" id="startUpload">开始上传</button>
    </div>
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
import '../../../node_modules/qiniu-js/src/qiniu'

const $ = window.$
const plupload = window.plupload
const Qiniu = window.Qiniu

export default {
  data () {
    return {}
  },
  mounted () {
    Qiniu.uploader({
      disable_statistics_report: false,
      runtimes: 'html5,flash,html4', // 上传模式，依次退化
      browse_button: 'startUpload', // 上传选择的点选按钮，必需
      // uptoken : 'IU3TTD_98cr4a04JkzAOSZGh007JE5Yi4XtCORtF:2X4etpy4AeVDiVQnyF2kvNGu5pk=:eyJzY29wZSI6Im9hdHRhby1yZXMiLCJkZWFkbGluZSI6MTUwMjI5OTMwMn0=', // uptoken是上传凭证，由其他程序生成
      get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken

      uptoken_url: this.$api.adminAPI.uploadToken,
      // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
      // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
      // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
      // domain: 'http://oud9xo9ee.bkt.clouddn.com/', // bucket域名，下载资源时用到，必需
      domain: 'http://qn-res.oattao.cn/', // bucket域名，下载资源时用到，必需
      container: 'container', // 上传区域DOM ID，默认是browser_button的父元素
      max_file_size: '300mb', // 最大文件体积限制
      flash_swf_url: 'http://cdn.bootcss.com/plupload/2.1.1/Moxie.swf', // 引入flash，相对路径
      max_retries: 3, // 上传失败最大重试次数
      dragdrop: true, // 开启可拖曳上传
      drop_element: 'container', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
      chunk_size: '4mb', // 分块上传时，每块的体积
      auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
      unique_names: true,
      init: {
        'FilesAdded': function (up, files) {
          plupload.each(files, function (file) {
            // 文件添加进队列后，处理相关的事情
            let progress = new ProgressItem(file,
              'fsUploadProgress')
            progress.setStatus('等待上传...')
            progress.bindUploadCancel(up)
          })
        },
        'BeforeUpload': function (up, file) {

        },
        'UploadProgress': function (up, file) {
          // 每个文件上传时，处理相关的事情
          let progress = new ProgressItem(file, 'fsUploadProgress')
          progress.setProgress(file.percent, file.speed)
        },
        'FileUploaded': (up, file, info) => {
          // 单个文件上传完毕
          let progress = new ProgressItem(file, 'fsUploadProgress')
          progress.setComplete(up, info.response)
          this.$http.post(this.$api.adminAPI.uploadResInfo, {
            filename: file.name,
            size: plupload.formatSize(file.size).toUpperCase(),
            key: $.parseJSON(info.response).key
          }).then((res) => {
            const data = res.data
            if (data.status === 0) {
              progress.setStatusColor('green')
            } else {
              progress.setStatusColor('red')
            }
          })
        },
        'Error': function (up, err, errTip) {
          // 上传出错时，处理相关的事情
          let progress = new ProgressItem(err.file, 'fsUploadProgress')
          progress.setError(up)
          progress.setStatus(errTip)
        },
        'UploadComplete': function () {
          // 队列文件处理完毕后，处理相关的事情
        }
      }
    })
  }
}

function ProgressItem (file, targetID) {
  this.fileProgressID = file.id
  this.file = file

  this.fileProgressWrapper = $('#' + this.fileProgressID)
  if (!this.fileProgressWrapper.length) {
    this.fileProgressWrapper = $('<tr></tr>')
    let Wrappeer = this.fileProgressWrapper
    Wrappeer.attr('id', this.fileProgressID).addClass('progressContainer')

    let progressText = $('<td/>')
    progressText.addClass('progressName').text(file.name)

    let fileSize = plupload.formatSize(file.size).toUpperCase()
    let progressSize = $('<td/>')
    progressSize.addClass('progressFileSize').text(fileSize)

    let progressBarTd = $('<td/>')
    let progressDiv = $(`<div class="progress-item">
            <div class="ui indicating active small progress" data-percent="0">
                <div class="bar">
                    <div class="progress">
                    </div>
                </div>
            </div>
            <div class="info">
                <span class="status"></span>
                <button class="ui button small basic progressCancel"><i class="icon remove"></i>取消上传</button>
            </div>
        </div>`)
    progressBarTd.append(progressDiv)

    Wrappeer.append(progressText)
    Wrappeer.append(progressSize)
    Wrappeer.append(progressBarTd)

    $('#' + targetID).append(Wrappeer)
    progressDiv.find('.progress').progress(
      {
        percent: 0
      }
    )
  } else {
    this.reset()
  }
}

ProgressItem.prototype.setProgress = function (percentage, speed) {
  let file = this.file
  let uploaded = file.loaded

  let size = plupload.formatSize(uploaded).toUpperCase()
  let formatSpeed = plupload.formatSize(speed).toUpperCase()
  let progressbar = this.fileProgressWrapper.find('td .progress')
  if (this.fileProgressWrapper.find('.status').text() === '取消上传') {
    return
  }
  this.fileProgressWrapper.find('.status').text('已上传: ' + size + '   上传速度： ' +
    formatSpeed + '/s')
  percentage = parseInt(percentage, 10)
  if (file.status !== plupload.DONE && percentage === 100) {
    percentage = 99
  }
  progressbar.progress({
    percent: percentage
  })
}

ProgressItem.prototype.reset = function () {
  this.fileProgressWrapper.find('td .progress').attr('data-percent', '0')
}

// 设置提示信息内容和样式
ProgressItem.prototype.setStatus = function (status, isUploading) {
  if (!isUploading) {
    this.fileProgressWrapper.find('.status').html(status)
  }
}
ProgressItem.prototype.setStatusColor = function (color, isUploading) {
  if (!isUploading) {
    this.fileProgressWrapper.find('.status').css({color: color})
  }
}
// 绑定取消上传事件
ProgressItem.prototype.bindUploadCancel = function (up) {
  let self = this
  if (up) {
    self.fileProgressWrapper.find('td:eq(2) .progressCancel').on('click',
      () => {
        this.fileProgressWrapper.find('td .progress').remove()
        this.fileProgressWrapper.find('td:eq(2) .progressCancel').hide()
        self.setStatus('取消上传')
        up.removeFile(self.file)
      })
  }
}
ProgressItem.prototype.setComplete = function (up, info) {
  let res = $.parseJSON(info)
  this.fileProgressWrapper.find('td:eq(2) .progressCancel').hide()
  this.fileProgressWrapper.find('td .progress').remove()

  let domain = up.getOption('domain')
  let url = domain + encodeURI(res.key)
  let link = domain + res.key

  let str = `
<h4>上传成功</h4>
<div><strong>文件链接:</strong><a href="${url}" target='_blank' >${link}</a></div>
<div class=hash><strong>Hash值:</strong>${res.hash}</div>`
  this.setStatus(str)
}
ProgressItem.prototype.setError = function (up) {
  this.fileProgressWrapper.find('td:eq(2) .progress').remove()
  this.fileProgressWrapper.find('.progressCancel').hide()
  up.removeFile(this.file)
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
