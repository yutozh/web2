module.exports = {
  // DEBUG: false,
  // MongoDB
  port: '8888',
  mongoString: 'mongodb://admin:admin@localhost/web2',
  
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
  rootUser: 'zyt',
  rootPsd: 'zaq1xsw2cde3vfr4',
  
  // 七牛keys
  qnAK: 'IU3TTD_98cr4a04JkzAOSZGh007JE5Yi4XtCORtF',
  qnSK: 'RpYjEOB5D67JOqgi6W6O0uny-5WaWxVwnh_wqXSi',
  articleBucket: 'oattao',
  articleZone: 'Zone_z2',
  articleDomain: 'https://file.oattao.cn',
  resBucket: 'oattao-res',
  resZone: 'Zone_z2',
  resBucketDomain: 'https://qn-res.oattao.cn',
  // 极验keys
  geetest_id: '7666360d67a607b6cee6c885a2311852',
  geetest_key: '610941c08cf545ebda9c02e597e7365b',
  // 易源keys
  YYappid: '43832',
  YYsecret: '6d59d5ee86654cdbae14a57b5a14b230',
  
  
  // session密码
  sessionKey: 'hahaha@hohoho6666!'
}
