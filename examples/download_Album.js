const spottyDL = require('../') 

const URL = "https://open.spotify.com/album/4sYpTER2iT2Y7Kf4VsfUne";
const CAS = "https://open.spotify.com/album/66MRfhZmuTuyGCO1dJZTRB";
const GYBE = "https://open.spotify.com/album/2rT82YYlV9UoxBYLIezkRq?si=WYijF7OcRyS5gvtsuvS91w";

(async () => {
    // Download asynchronously, faster but prone to stream/downloading errors...
    
    // let data = await spottyDL.getAlbum(URL);
    // console.log(data)
    // let info = await spottyDL.downloadAlbum(data, "output/", false)
    // console.log(info) // check Results[]
    // let res = await spottyDL.retryDownload(info)
    // console.log(res)
    
    // Download synchronously, one by one, much safer
    
    let data = await spottyDL.getAlbum(CAS)
    console.log(data)
    let info = await spottyDL.downloadAlbum(data, "output/", false);
    console.log(info)
    let res = await spottyDL.retryDownload(info)
    console.log(res) // If this is equal to [] it means no errors...

    //
})();
