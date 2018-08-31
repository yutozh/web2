<template>
  <div id="admin-editor" class="admin-content-wrapper">
    <div class="admin-editor-container">
      <div class="admin-editor-head">
        编辑内容
      </div>
      <div class="admin-editor-type ui form">
        <div class="field">
          <label>类型选择：</label>
          <select name="gender" class="ui dropdown"
                  id="select" v-model="articleType">
            <option value="1">知识库</option>
            <option value="2">问题栏</option>
            <option value="3">留言板</option>
          </select>
        </div>
      </div>
      <div class="admin-editor-title" v-show="articleType<3">
        <div class="ui form">
          <div class="field">
            <label>标题（不超过30字）：</label>
            <input type="text" v-model="article.title">
          </div>
        </div>
      </div>

      <div class="admin-editor-desc" v-show="articleType==1">
        <div class="ui form">
          <div class="field">
            <label>描述</label>
            <textarea rows="3" v-model="article.desc"></textarea>
          </div>
        </div>
      </div>
      <textarea ref="froalaEditor" id="froalaEditor" style="text-align: left"></textarea>
      <div class="ui admin-editor-tags" v-show="articleType<3">
        <div class="ui form">
          <div class="fields">
            <div class="field">
              <label>标签1</label>
              <input type="text" placeholder="..." v-model="article.tags[0]">
            </div>
            <div class="field">
              <label>标签2</label>
              <input type="text" placeholder="..." v-model="article.tags[1]">
            </div>
            <div class="field">
              <label>标签3</label>
              <input type="text" placeholder="..." v-model="article.tags[2]">
            </div>
          </div>
        </div>
      </div>
      <div class="admin-editor-url" v-show="articleType<3">
        <div class="ui form">
          <div class="field">
            <label>URL：</label>
            <input type="text" v-model="articleURL">
          </div>
        </div>
        <div class="ui warning message" v-if="showWarning">
          <div class="header">URL不符合规范</div>
          <ul class="list">
            <li>只能包含字母,数字,'-'</li>
          </ul>
        </div>
      </div>
      <div class="admin-editor-buttons">
        <button class="ui button positive"
                v-bind:class="{loading:isloading,disabled:isloading}"
                v-on:click="submit">提交
        </button>
      </div>
    </div>

  </div>
</template>

<script>
const $ = window.$

let typeList = ['modelKnowledge', 'modelQuestion', 'modelMessage']

export default {
  data () {
    return {
      isloading: false,
      update: false,
      editorData: '',
      article: {title: '', body: '', tags: [], desc: ''},
      articleURL: ''
    }
  },
  created () {

  },
  computed: {
    showWarning () {
      /* eslint-disable no-useless-escape */
      let strRegex = '^[a-zA-Z0-9\-]*$'
      let re = new RegExp(strRegex)
      return !re.test(this.articleURL)
    },
    articleType: {
      get () {
        switch (this.$route.query.type) {
          case 'K':
            return 1
          case 'Q':
            return 2
          case 'M':
            return 3
        }
      },
      set (newVal) {
        // todo: unknown get error
        return newVal
      }
    }
  },
  destroyed () {
  },
  mounted () {
    // 块级代码高亮
    $.FroalaEditor.DefineIcon('dropdownIcon', {NAME: 'file-code-o'})

    // Define a dropdown button.
    $.FroalaEditor.RegisterCommand('code', {
      title: 'code',
      type: 'dropdown',
      icon: 'dropdownIcon',

      // Options for the dropdown.
      options: {
        'java': 'Java',
        'c': 'C',
        'cpp': 'C++',
        'visual-basic': 'Visual Basic',
        'php': 'PHP',
        'perl': 'Perl',
        'python': 'Python',
        'csharp': 'C#',
        'javascript': 'JavaScript',
        'ruby': 'Ruby',
        'sql': 'SQL',
        'css': 'CSS',
        'bash': 'Bash',
        'r': 'R',
        'scala': 'Scala',
        'json': 'Json',
        'julia': 'Julia',
        'docker': 'Docker',
        'go': 'Go'
      },
      // Save the dropdown action into undo stack.
      undo: true,
      // Focus inside the editor before callback.
      focus: true,
      // Refresh the button state after the callback.
      refreshAfterCallback: true,

      // Callback.
      callback: function (cmd, val, params) {
        // The current context is the editor instance.
        this.html.insert(`<pre><code class="language-${val}">${$('<div/>').text(this.selection.text()).html()}</code></pre>`, true)
      }
    })

    // 行内代码高亮
    $.FroalaEditor.DefineIcon('inline-code', {NAME: 'info'})
    $.FroalaEditor.RegisterCommand('inline-code', {
      title: 'inline-code',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        this.html.insert(`<code class="language-bash">${$('<div/>').text(this.selection.text()).html()}</code>`, true)
      }
    })

    $('#froalaEditor').froalaEditor({
      language: 'zh_cn',
      imageUploadURL: this.$api.host + '/upload_image',
      fileUploadURL: this.$api.host + '/upload_file',
      fileMaxSize: 1024 * 1024 * 50,
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize',
        '-', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
        '-', 'code', 'inline-code', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
      fontFamilySelection: true,
      fontSizeSelection: true,
      paragraphFormatSelection: true
    }).on('froalaEditor.image.error', function (e, editor, error, response) {
      console.log(error)
    })

    // this.ue = UE.getEditor('editor', {
    //   // BaseUrl: '/pubilc',
    //   UEDITOR_HOME_URL: '/ueditor/'
    // }
    // )
    // $('#select').dropdown()
    // SyntaxHighlighter.all()
    // 请求文章数据
    this.articleURL = this.$route.query.url
    if (this.articleURL) {
      this.update = true
      this.$http.get(this.$api.adminAPI.getContents, {
        params: {path: this.articleURL, target: typeList[this.articleType - 1]}
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.article = data.content
          $('#froalaEditor').froalaEditor('html.set', this.article.body)
        } else {
          this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/adminAPI/getContents',
      //   method: 'get',
      //   data: {path: this.articleURL, target: typeList[this.articleType - 1]},
      //   beforeSend: () => {
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.article = data.content
      //       this.ue.addListener('ready', () => {
      //         // editor准备好之后才可以使用
      //         this.ue.setContent(this.article.body)
      //       })
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
      //     }
      //   }
      // })
    }
  },
  methods: {
    submit: function () {
      if (this.articleType === 3) {
        this.editorData = $('#froalaEditor').froalaEditor('selection.text')
      } else {
        this.editorData = $('#froalaEditor').froalaEditor('html.get', true)
      }
      this.$http({
        method: 'post',
        url: this.$api.adminAPI.postContents,
        data: {
          target: typeList[this.articleType - 1],
          update: this.update,
          path: this.articleURL,
          title: this.article.title,
          content: this.editorData,
          tags: this.article.tags,
          desc: this.article.desc
        }
      }).then((res) => {
        const data = res.data
        if (data.status === 0) {
          this.$root.eventHub.$emit('showAlert', '提交成功', 1)
          this.isloading = false
          this.$root.$router.go(-1)
        } else {
          this.$root.eventHub.$emit('showAlert', data.msg)
          this.isloading = false
        }
      }).catch((e) => {
        this.$root.eventHub.$emit('showAlert', '服务器错误，请稍后再试')
        console.log(e)
      })
      // $.ajax({
      //   url: '/adminAPI/postContents',
      //   contentType: 'application/json; charset=utf-8',
      //   type: 'post',
      //   data: JSON.stringify({
      //     target: typeList[this.articleType - 1],
      //     update: this.update,
      //     path: this.articleURL,
      //     title: this.article.title,
      //     content: this.uedata,
      //     tags: this.article.tags,
      //     desc: this.article.desc
      //   }),
      //   beforeSend: () => {
      //     this.isloading = true
      //   },
      //   success: (data) => {
      //     if (data.status === 0) {
      //       this.$root.eventHub.$emit('showAlert', '提交成功', 1)
      //       this.isloading = false
      //       this.$root.$router.go(-1)
      //     } else {
      //       this.$root.eventHub.$emit('showAlert', data.msg)
      //       this.isloading = false
      //     }
      //   }
      // })
    }
  }
}

</script>

<style scoped>

  .admin-editor-container {
    width: 1024px;
    margin: 0 auto;
  }

  .admin-editor-head {
    font-size: large;
    font-weight: bolder;
    color: black;
    margin: 20px;
  }

  .admin-editor-type, .admin-editor-title, .admin-editor-desc, .admin-editor-tags, .admin-editor-url {
    text-align: left;
    margin: 30px 0;
    z-index: 1000;
  }

  #editor {
    text-align: center;
    margin: 0 auto;
  }

  .admin-editor-buttons {
    margin: 30px auto;
    width: 1024px;
    text-align: right;
  }
</style>
<style>
  pre {
    background: #eee;
    padding: 0.5em;
  }
</style>
