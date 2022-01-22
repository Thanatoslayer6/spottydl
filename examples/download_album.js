const spottyDL = require('../') 

const URL = "https://open.spotify.com/album/4sYpTER2iT2Y7Kf4VsfUne";
const CAS = "https://open.spotify.com/album/66MRfhZmuTuyGCO1dJZTRB";

(async () => {
    let data = await spottyDL.getAlbum(URL);
    console.log(data)
    let info = await spottyDL.downloadAlbum(data, "output/", false)
    console.log(info)
    let integ = await spottyDL.retryDownload(info)
    console.log(integ)
})();
