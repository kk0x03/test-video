const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar', 'app.asar.unpacked'); // 避免在Electron打包的时候找不到asar之外的ffmpeg路径。
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
let bufferStream = new stream.PassThrough();  // 新建一个队列的stream
let instance = ffmpeg()
    .input('video=USB GS CAM') // 输入设备的名称，下面是windows独有的dshow功能。如果是mac或者linux平台，只需要输入/dev/video*之类的地址
    .inputOption('-f', 'dshow')
    .output(saveVideoPath) // 第一个输出文件,在这之前也可以做一下转码
    .videoCodec('copy') // 直接将视频输出的流保存下来
    .output(bufferStream) //将第二路输出到之前新建的stream。
    .videoCodec(videoCodec) //因为electron默认支持的格式有限，在这里选择libx264
    .format('mp4')
    .outputOptions(
        '-movflags', 'frag_keyframe+empty_moov+faststart',
        '-g', '18')
    .on('progress', function(progress) {
        //程序进行时的回调
        console.log('time: ' + progress.timemark);
    })
    .on('error', function(err) {
            //ffmpeg出错时的回调
        console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
            //ffmpeg收到停止信号并安全退出时的回调
        console.log('Processing finished !');
    })
instance.run() //双路时需要添加一个run来执行ffmpeg命令


const http = require('http')
let server = http.createServer((request, response) => {
                                //... ffmpeg指令既可以放到这，也可以放到之前，只要能够获取到bufferStream就可以
                bufferStream.pipe(response);
            })
server.listen(8889);