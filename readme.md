```shell
ffmpeg -i ./video.mp4 -vf "fps=0.5,scale=320:-1,tile=10x<rows>" -frames:v 1 -update 1 ./thumbs.jpg
```
