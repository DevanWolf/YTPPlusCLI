# YTPPlusCLI
ytp+ infinity branch of YTPPlusCLI (Windows only for now).

This shares the same code as YTPPlusCLI but it will infinitely generate videos to a live stream.

Requires an RTMP server, specify an ``rtmp://`` prefixed url with ``--rtmpurl`` as a parameter (default is ``rtmp://localhost:1935/myapp/mystream``).

View the live stream using ``ffplay -use_wallclock_as_timestamps 1 -fflags -nobuffer -i rtmp://<rtmp server>`` (``ffplay`` can be found in ``node_modules/ffmpeg-cli/ffmpeg``).

See more at https://ytp-plus.github.io/

# Credits

[Royalty Free Music from Bensound](https://www.bensound.com/)
