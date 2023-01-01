const spottyDL = require('../')
const playlist2 = "https://open.spotify.com/playlist/29zGkCDLvy7embGQEwuqGj"

;(async() => {
    let data = await spottyDL.getPlaylist(playlist2);
    console.log(data)
    let info = await spottyDL.downloadPlaylist(data, "output/", false);
    console.log(info)
})()
