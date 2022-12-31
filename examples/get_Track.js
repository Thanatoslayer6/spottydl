const spottyDL = require('../')
const URL = "https://open.spotify.com/track/0QkT7SfXL9eR6tuQ7xb9ya?si=95cba6f791af4784";
const URL1 = "https://embed.spotify.com/?uri=spotify:track:0QkT7SfXL9eR6tuQ7xb9ya"

async function main() {
    try {
        // let data = await spottyDL.getTrack(URL)
        // console.log(data)
        let data1 = await spottyDL.getTrack(URL1)
        console.log(data1)
    } catch (err) {
        console.error(err);
    }
}

main()
