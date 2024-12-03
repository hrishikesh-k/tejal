```shell
ffmpeg -i ./video.mp4 -vf "fps=0.5,scale=192:-1,tile=10x<rows>" -frames:v 1 -q:v 1 -update 1 ./thumbs.jpg
```
