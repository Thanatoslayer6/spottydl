const spottyDL = require('../')

const URL = "https://open.spotify.com/track/0QkT7SfXL9eR6tuQ7xb9ya?si=95cba6f791af4784";
const CAS = "https://open.spotify.com/album/51AxfjN2gEt5qeJqPY5w0e";

async function main() {
    try {
        // ALBUM
        let data = await spottyDL.getAlbum(CAS)
        console.log(data)
        let file = await spottyDL.downloadAlbum(data, "output/")
        console.log(file)
        //
        // TRACK
        // let data = await spottyDL.getTrack(URL)
        // console.log(data)
        // let file = await spottyDL.downloadTrack(data, "output/")
        // console.log(file)
    } catch (err) {
        console.error(err);
    }
    
}

main()
