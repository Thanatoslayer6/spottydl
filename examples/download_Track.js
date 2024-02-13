const spottyDL = require('../');
const URL1 = "https://embed.spotify.com/?uri=spotify:track:0QkT7SfXL9eR6tuQ7xb9ya";
const URL2 = "https://open.spotify.com/track/3sslYZcFKtUvIEWN9lADgr";

;(async() => {
    let data = await spottyDL.getTrack(URL2)
    console.log(data)
    let info = await spottyDL.downloadTrack(data, "output/");
    console.log(info)
})()
