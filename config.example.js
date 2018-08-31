module.exports = {
  // MongoDB
  port: '',
  mongoString: '',
  
  // 专栏内容容量
  pageSize: 8,
  
  // 留言容量
  messageSize: 9,
  
  // 首页内容容量
  homeKnowledgeSize: 3,
  homeQuestionSize: 3,
  homeResourceSize: 5,
  
  // 资源类型（需和前端一致）
  resourceTypeList: ['全部', '文档', '软件', '数据', '视频', '图片', '其他'],
  
  // 后台列表容量
  adminPageSize: 10,
  // 后台用户名密码
  rootUser: '',
  rootPsd: '',
  
  // 七牛keys
  qnAK: '',
  qnSK: '',
  articleBucket: 'oattao',
  articleZone: 'Zone_z2',
  articleDomain: 'https://file.oattao.cn',
  resBucket: 'oattao-res',
  resZone: 'Zone_z2',
  resBucketDomain: 'https://qn-res.oattao.cn',
  // 极验keys
  geetest_id: '',
  geetest_key: '',
  // 易源keys
  YYappid: '',
  YYsecret: '',
  
  // session密码
  sessionKey: ''
}
