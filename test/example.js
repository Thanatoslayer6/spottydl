const spottyDL = require('../')

const URL = "https://open.spotify.com/track/0QkT7SfXL9eR6tuQ7xb9ya?si=95cba6f791af4784"
// const URL = "https://open.spotify.com/album/1LqgEMQNmL2yvjsGpihGee"
async function main() {
    try {
        // ALBUMS
        // Fetch Album
        // let data = await spottyDL.getAlbum(URL)
        // console.log(data)
        // await spottyDL.downloadAlbum(data)
        // TRACKS
        // Fetch Track
        // console.log('Starting now')
        let data = await spottyDL.getTrack(URL)
        console.log(data)
        let file = await spottyDL.downloadTrack(data, "songs/")
        console.log(file)
        // console.log(`STARTING`)
        // let data = await spottyDL.getAlbum(URL)
        // await spottyDL.downloadAlbum
        // console.log(data)
        // let file = await spottyDL.downloadAlbum(data, "songs/")
        // console.log(file)
    } catch (err) {
        console.error(err);
    }
    
}

main()
