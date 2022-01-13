const spottyDL = require('../')

const URL = "https://open.spotify.com/track/0QkT7SfXL9eR6tuQ7xb9ya?si=95cba6f791af4784";
const CAS = "https://open.spotify.com/album/2mxFsS5yylSTHNivV53HoA";

async function main() {
    try {
        let data = await spottyDL.getAlbum(CAS)
        console.log(data)
        let file = await spottyDL.downloadAlbum(data)
        console.log(file)
    } catch (err) {
        console.error(err);
    }
    
}

main()
