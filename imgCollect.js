const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://example.com'; // Replace with the URL you want to scrape

axios.get(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const images = [];

        $('img').each(function() {
            const imageUrl = $(this).attr('src');
            if (imageUrl) {
                images.push(imageUrl);
            }
        });

        console.log(images);

        // Download images
        images.forEach((imgUrl, index) => {
            axios({
                method: 'get',
                url: imgUrl,
                responseType: 'stream'
            })
                .then(function(response) {
                    response.data.pipe(fs.createWriteStream(path.join(__dirname, `athlete_${index}.jpg`)));
                })
                .catch(function(error) {
                    console.error(`Error downloading image ${imgUrl}: `, error);
                });
        });
    })
    .catch(console.error);