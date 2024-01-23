# JavaScript PuppeteerCrawler Actor template

1. Get the twitter post url from user
2. Get the twitter post content and comments from twitter API
3. Use Playwright to screenshot the twitter post and comments
4. Use AWS polly to convert the twitter post content and comments to audio
5. Use ffmpeg to combine the audio and screenshots to video


##

docker build --platform linux/amd64 -t test-bot .
docker run -it --rm -p 8080:8080 test-bot
