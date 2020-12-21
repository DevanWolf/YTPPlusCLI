//unused right now
const fs = require("fs"),
    ffmpeg = require("ffmpeg-cli"),
    { execSync } = require('child_process'),
    mediainfo = require('mediainfo-static');
module.exports = {
    getVideoProbe: (video) => {
        //https://www.npmjs.com/package/video-length
        //not using package due to invalid params with mediainfo-static
        let vid = `"${video.replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}"`;
        let stdout = execSync(mediainfo.path+" "+vid+' --full --output=JSON');
        if(stdout) {
            let specs = JSON.parse(stdout.toString());
            let { track } = specs.media;
            if(!track){
                throw new TypeError('Can\'t extract video specs');
            }
            // General info
            let general_specs = track.find(i => i['@type'] == 'General');
            if(!general_specs){
                throw new TypeError('Can\'t find "General" specs');
            }
            // Video track specs
            let video_specs = track.find(i => i['@type'] == 'Video');
            if(!video_specs){
                throw new TypeError('Can\'t find "Video" track');
            }
            let { Duration, FrameRate, OverallBitRate, FileSize } = general_specs;
            let { Width, Height } = video_specs;
            return {
                duration : parseFloat(Duration),
                width    : parseFloat(Width),
                height   : parseFloat(Height),
                fps      : parseFloat(FrameRate),
                bitrate  : parseFloat(OverallBitRate),
                size     : parseFloat(FileSize),
            };
        }
    },
    snipVideo: (video, startTime, endTime, output, resolution, fps) => {
        var args = " -i \"" + `${video.replace(/\\/g,"\\\\").replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}`
            + "\" -ss " + startTime
            + " -to " + endTime
            + " -ac 1"
            + " -ar 44100"
            + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps="+fps
            + " -y"
            + " " + output + ".mp4";
        return ffmpeg.runSync(args);
    },
    copyVideo: (video, output, resolution, fps) => {
        var args =" -i \"" + `${video.replace(/\\/g,"\\\\").replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}`
            + "\" -ar 44100"
            + " -ac 1"
            + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps="+fps
            + " -y"
            + " " + output + ".mp4";
        return ffmpeg.runSync(args);
    },
    concatenateVideo: (count, out) => {
        var command1 = "";
        for (var i=0; i<count; i++) {
            if (fs.existsSync(process.cwd()+"/shared/temp/video" + i + ".mp4") == true) {
                let newline = ""
                if(command1 != "") {
                    newline = "\n"
                }
                command1 = command1.concat(newline+"file '" + process.cwd()+"/shared/temp/video" + i + ".mp4'"); 
            }
        }
        fs.writeFileSync("concat.txt",`${command1.replace(/\\/g,"\\\\").replace(/\//g,(process.platform === "win32" ? "\\\\" : /\//g))}`)
        return ffmpeg.runSync("-f concat -safe 0 -i concat.txt -af aresample=async=1 "+out);
    }
}
