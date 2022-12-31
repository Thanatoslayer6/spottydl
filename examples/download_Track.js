const spottyDL = require('../');
const URL1 = "https://embed.spotify.com/?uri=spotify:track:0QkT7SfXL9eR6tuQ7xb9ya";

;(async() => {
    let data = await spottyDL.getTrack(URL1)
    console.log(data)
    let info = await spottyDL.downloadTrack(data, "output/");
    console.log(info)
})()
