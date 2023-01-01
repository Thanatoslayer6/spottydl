const spottyDL = require('../')

let sample = [{
    status: true,
    filename: '~/somePath/Never Gonna Give You Up.mp3',
}];

let data = spottyDL.checkType(sample)
console.log(data) // Results[]

let sample1 = {
    name: '',
    owner: '',
    tracks: [],
    playlistCoverURL: ''
};

let data1 = spottyDL.checkType(sample1)
console.log(data1)
// console.log(spottyDL.checkLinkType("https://open.spotify.com/album/6psfQ7hu5uqFLkdtWyygcT"))
// console.log(spottyDL.checkLinkType("https://open.spotify.com/track/0K5Fcpl8O91CTSCeXlOOJu?si=zBi4weJcRvSLOML6XzJDNA"))
// console.log(spottyDL.checkLinkType("https://open.spotify.com/embed/track/5F7fVq54gTmTQQQfISorwz"))
// console.log(spottyDL.checkLinkType("https://embed.spotify.com/embed?uri=spotify:track:5F7fVq54gTmTQQQfISorwz"))
// console.log(spottyDL.checkLinkType("https://embed.spotify.com/?uri=spotify:track:5F7fVq54gTmTQQQfISorwz"))
