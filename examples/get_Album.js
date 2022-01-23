const spottyDL = require('../')

// const URL = "https://open.spotify.com/track/0QkT7SfXL9eR6tuQ7xb9ya?si=95cba6f791af4784";
const URL = "https://open.spotify.com/album/7AHbaRIYnilUwe981nZpmi"

async function main() {
    try {
        let data = await spottyDL.getAlbum(URL)
        console.log(data)
    } catch (err) {
        console.error(err);
    }
}

main()

/* Output
{
  name: 'Yank Crime',
  artist: 'Drive Like Jehu',
  year: '1994',
  tracks: [
    {
      name: 'Here Come the Rome Plows',
      id: '02MAcqIvX7w',
      trackNumber: 1
    },
    { name: 'Do You Compute', id: 'bxSwb2h-RYc', trackNumber: 2 },
    { name: 'Golden Brown', id: 'mqnLnuJAb0g', trackNumber: 3 },
    { name: 'Luau', id: 'FyFOIEut-rA', trackNumber: 4 },
    { name: 'Super Unison', id: 'O5Cz-qDjl1U', trackNumber: 5 },
    { name: 'New Intro', id: 'OZNOIJg8BWQ', trackNumber: 6 },
    { name: 'New Math', id: 'en4s6e0jFrI', trackNumber: 7 },
    { name: 'Human Interest', id: 'CIubxQ_aHKs', trackNumber: 8 },
    { name: 'Sinews', id: '5iRnArupie4', trackNumber: 9 },
    { name: 'Hand over Fist', id: 'X-LYeJ8Uncs', trackNumber: 10 },
    {
      name: 'Bullet Train to Vegas',
      id: '4JxV9DXWOWk',
      trackNumber: 11
    },
    {
      name: 'Sinews (Original Version)',
      id: 'RFOuoIa5JZc',
      trackNumber: 12
    }
  ],
  albumCoverURL: 'https://i.scdn.co/image/ab67616d0000b273e601454f9f3c90a969e7260e'
} */
