const spottyDL = require('../')
const URL = "https://open.spotify.com/track/0QkT7SfXL9eR6tuQ7xb9ya?si=95cba6f791af4784";

async function main() {
    try {
        let data = await spottyDL.getTrack(URL)
        console.log(data)
    } catch (err) {
        console.error(err);
    }
}

main()
