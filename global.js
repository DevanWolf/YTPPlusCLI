"use strict";
//unused right now
const fs = require("fs"),
    ffmpeg = require("ffmpeg-cli"),
    child_process = require('child_process'),
    mediainfo = require('mediainfo-static');
module.exports = {
    /* Prompt Defaults */
    defaults: {
        input: "videos.txt",
        output: "output.mp4",
        clips: 20,
        minstream: 0.2,
        maxstream: 0.4,
        width: 640,
        height: 480,
        fps: 30,
        usetransitions: false,
        transitions: "transitions.txt"
    },
    /* Plugin consts */
    ffmpeg: ffmpeg,
    mediainfo: mediainfo,
    /* Uses MediaInfo to get video information */
    getVideoProbe: (video) => {
        //Taken from https://www.npmjs.com/package/video-length
        //Not using package due to invalid params with mediainfo-static
        let vid = `"${video.replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}"`;
        let stdout = child_process.execSync(mediainfo.path+" "+vid+' --full --output=JSON');
        if(stdout) {
            let specs = JSON.parse(stdout.toString());
            if(!specs.media.track){
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
            return {
                duration : parseFloat(general_specs.Duration),
                width    : parseFloat(video_specs.Width),
                height   : parseFloat(video_specs.Height),
                fps      : parseFloat(general_specs.FrameRate),
                bitrate  : parseFloat(general_specs.OverallBitRate),
                size     : parseFloat(general_specs.FileSize),
            };
        }
    },
    /* Uses MediaInfo to get audio information */
    getAudioProbe: (video) => {
        //Taken from https://www.npmjs.com/package/video-length
        //Modified
        let vid = `"${video.replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}"`;
        let stdout = child_process.execSync(mediainfo.path+" "+vid+' --full --output=JSON');
        if(stdout) {
            let specs = JSON.parse(stdout.toString());
            if(!specs.media.track){
                throw new TypeError('Can\'t extract audio specs');
            }
            // General info
            let general_specs = track.find(i => i['@type'] == 'General');
            if(!general_specs){
                throw new TypeError('Can\'t find "General" specs');
            }
            return {
                duration : parseFloat(general_specs.Duration),
                bitrate  : parseFloat(general_specs.OverallBitRate),
                size     : parseFloat(general_specs.FileSize),
            };
        }
    },
    /* Trims down videos to a specific time and length */
    snipVideo: (video, startTime, endTime, output, resolution, fps, debug) => {
        var args = " -i \"" + `${video.replace(/\\/g,"\\\\").replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}`
            + "\" -ss " + startTime
            + " -to " + endTime
            + " -ac 1"
            + " -ar 44100"
            + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps="+fps
            + " -y"
            + " " + output + ".mp4";
        return ffmpeg.runSync(args + (debug == false ? " -hide_banner -loglevel quiet" : ""));
    },
    /* Copies videos to what is normally the temporary directory */
    copyVideo: (video, output, resolution, fps, debug) => {
        var args =" -i \"" + `${video.replace(/\\/g,"\\\\").replace(/\//g,(process.platform === "win32" ? "\\\\" : "/"))}`
            + "\" -ar 44100"
            + " -ac 1"
            + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps="+fps
            + " -y"
            + " " + output + ".mp4";
        return ffmpeg.runSync(args + (debug == false ? " -hide_banner -loglevel quiet" : ""));
    },
    /* Writes a concat.txt and merges it together, this is unlike the original YTP+ as it now allows for any amount of video files
        This should NOT be used in plugins */
    concatenateVideo: (count, out, debug) => {
        var command1 = "";
            
        for (var i=0; i<count; i++) {
            if (fs.existsSync(process.cwd()+"/shared/temp/video" + i + ".mp4") == true) {
                command1 = command1.concat(" -i "+process.cwd()+"/shared/temp/video" + i + ".mp4");
            }
        }
        command1 = command1.concat(" -filter_complex \"");
        
        let realcount = 0;

        for (var i=0; i<count; i++) {
            if (fs.existsSync(process.cwd()+"/shared/temp/video" + i + ".mp4") == true) {
                realcount+=1;
            }
        }

        for (var i=0; i<realcount; i++) {
            command1 = command1.concat("[" + i + ":v:0][" + i + ":a:0]");
        }

        command1=command1.concat("concat=n=" + realcount + ":v=1:a=1[outv][outa]\" -map \"[outv]\" -map \"[outa]\" -y " + out); 

        return ffmpeg.runSync(command1 + (debug == false ? " -hide_banner -loglevel quiet" : ""));
    },
    /* Get a random integer between a minimum and a maximum number */
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
