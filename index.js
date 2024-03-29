// 下载链接保存到对应目录 downloadMap.js

var request = require('request')
var fs = require('fs')
var path = require('path')

let hostdir = __dirname.replace(/\\/g, "/") + "/"
let urls = [];
let setDownload = null;
/**
 * 判断目录是否存在, 不存在创建目录
 * @param {string} dirPath 目录路径
 */
function mkdirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirPath))) {
      fs.mkdirSync(dirPath);
      return true;
    }
  }
  return false
}

/**
 * 添加链接到数组
 * @param {string} url 
 */
function JoinTheDownLoadQueue(url){
  urls.push(url);
}

/**
 * 下载单条链接
 * @param {string} url 
 */
function downloadUrl(url) {
  const last = url.lastIndexOf('/')
  debugger
  let arr = url.split('/')
  let dir = 'downloads/' + arr[arr.length - 3] + '/' +arr[arr.length - 2]
  
  const name = url.substr(last + 1)
  const dstpath = hostdir + dir + '/' + name
  console.log(`
  -----------------------
    url ${url}
    last ${last}
    arr ${arr}
    dir ${dir}
    name ${name}
    dstpath ${dstpath}
  ---------------------
  `)
  
  if (name.length && dir.length && !fs.existsSync(dstpath)) {
    console.log('in if ')
    if (mkdirSync(hostdir + dir)) {
      try{
        debugger
        let httpStream = request({
          method: 'GET',
          url: url
        });

        let writeStream = fs.createWriteStream(dstpath);

        request(url).pipe(writeStream)

        let totalLength = 0;

        // 当获取到第一个HTTP请求的响应获取
        httpStream.on('response', (response) => {
          console.log('response headers is: ', response.headers);
        });

        httpStream.on('data', (chunk) => {
          totalLength += chunk.length;
          console.log('recevied data size: ' + totalLength + 'KB');
        });

        writeStream.on("close", function (err) {
          urls.splice(0, 1);
          console.log(`${url} [${totalLength}KB]下载完毕, 还剩${urls.length}条链接`);
          download_s()
          if(urls.length === 0){
            console.log(`
              已完成所有下载！！！
              已完成所有下载！！！
              已完成所有下载！！！
              已完成所有下载！！！
              已完成所有下载！！！
              已完成所有下载！！！
            `)
          }
        });
      }catch(err){
        console.log('Erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
        download_s()
      }
    }
  }
  else if(fs.existsSync(dstpath)){
    urls.shift()
    download_s()
  }
}

function download_s(){
  setDownload = setTimeout(function(params) {
    if (setDownload) { clearTimeout(setDownload)}
    // 下载任务完成后下载下一个任务
    if (urls.length){
      downloadUrl(urls[0])
    }else{
      download_s()
    }
  },1000)
}

download_s()



let x,y,z;
let params

for(let i=4;i<5;i++){
  z = i
  let mz = Math.pow(2,z)
  for(let j=0;j<mz;j++){
    y = j
    for(let k=0;k<mz;k++){
      x = k;
      params = `http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/${z}/${y}/${x}`
      JoinTheDownLoadQueue(params)
    }
  }
}
