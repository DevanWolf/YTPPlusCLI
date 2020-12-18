//unused right now
const fs = require("fs"),
    ffmpeg = require("ffmpeg-cli");
module.exports = {
    getLength: (file,callback) => {
        return this.getVideoLength(file,callback)
    },
    snipVideo: (video, startTime, endTime, output, resolution, fps) => {
        var args = " -i \"" + video
            + "\" -ss " + startTime.getTimeStamp()
            + " -to " + endTime.getTimeStamp()
            + " -ac 1"
            + " -ar 44100"
            + " -vf scale="+resolution[0]+"x"+resolution[1]+",fps=fps="+fps
            + " -y"
            + " " + output + ".mp4";
        return ffmpeg.runSync(args);
    },
    copyVideo: (video, output, resolution, fps) => {
        var args =" -i \"" + video
            + "\" -ar 44100"
            + " -ac 1"
            + " -vf scale="+resolution[0]+"x"+resolution[1]+",fps=fps="+fps
            + " -y"
            + " " + output + ".mp4";
        return ffmpeg.runSync(args);
    },
    concatenateVideo: (count, out) => {
        var command1 = "";
        for (var i=0; i<count; i++) {
            if (fs.existsSync(this.TEMP + "video" + i + ".mp4") == true) {
                command1 = command1.concat(" -i \"" + this.TEMP + "video" + i + ".mp4\""); //quotes
            }
        }
        command1 = command1.concat(" -filter_complex \"");
        var realcount = 0;
        for (i=0; i<count; i++) {
            if (fs.existsSync(this.TEMP + "video" + i + ".mp4") == true) {
                realcount+=1;
            }
        }
        for (i=0; i<realcount; i++) {
            command1 = command1.concat("[" + i + ":v:0][" + i + ":a:0]");
        }
        command1=command1.concat("concat=n=" + realcount + ":v=1:a=1[outv][outa]\" -map \"[outv]\" -map \"[outa]\" -y " + out); 
        return ffmpeg.run(command1);
    }
}
