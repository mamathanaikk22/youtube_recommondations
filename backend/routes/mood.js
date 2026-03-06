const express = require('express');
const axios = require('axios');
const Sentiment = require('sentiment');
require('dotenv').config();

const router = express.Router();
const sentiment = new Sentiment();

function detectMood(text){

    const score = sentiment.analyze(text).score;

    if(score > 2){
        return "happy";
    }

    if(score < -2){
        return "sad";
    }

    return "neutral";
}

router.post('/', async (req, res) => {

    try{

        const text = req.body.text;

        if(!text){
            return res.status(400).json({error:"Text is required"});
        }

        const mood = detectMood(text);
        const apiKey = process.env.YT_API_KEY;

        const query = {
            happy: "Lungi Dance",
            sad: "Parasiva Raghu Dixit",
            neutral: "Lokada Kalaji Raghu Dixit"
        };

        const url =
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query[mood]}&key=${apiKey}&maxResults=15&type=video`;

        const response = await axios.get(url);

        const videos = response.data.items.map(item => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
            thumbnail: item.snippet.thumbnails.default.url
        }));

        res.json({ mood, videos });

    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Server error"});
    }

});

module.exports = router;