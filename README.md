# Spottydl

A **NodeJS Spotify Downloader** package without any API Keys or authentication from Spotify or Youtube-Music.

However, this **requires [ffmpeg](https://ffmpeg.org/download.html)** to be installed on your system...

## Project Status

- [x] **Automatic tagging of .mp3 files** using [Node-ID3](https://github.com/Zazama/node-id3) includes _Year, Artist, Album, Title, and Art Cover_
- [x] **Simple and easy to use**, contains only 4 usable methods 🤔 I do need some help optimizing some parts
- [ ] Error checking, when downloading Tracks or Albums, like retrying the process when status failed...

## Installation 

_Make sure you have ffmpeg installed on your system preferably version >= 4.0_

```sh
# NPM
npm i spotifydl-core
# Yarn
yarn add spotifydl-core
```

## Usage

#### First we require/import the module

```JS
// If you use plain Javascript
const SpottyDL = require('spottydl')
// If typescript
import SpottyDL from 'spottydl'
```

#### Getting a Track Info

```JS
(async() => {
    await SpottyDL.getTrack("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT")
        .then(results => { // Returns a <Track>
            console.log(results)
        });
})();

/* Example Output
{
  title: 'Never Gonna Give You Up',
  artist: 'Rick Astley',
  year: '1987-11-12',
  album: 'Whenever You Need Somebody',
  id: 'lYBUbBu4W08', // videoId From Youtube-Music
  albumCoverURL: 'https://i.scdn.co/image/ab67616d0000b2735755e164993798e0c9ef7d7a',
  trackNumber: 1
}
*/
```

#### Getting an Album/Single Info

```JS
(async() => {
    await SpottyDL.getAlbum("https://open.spotify.com/album/2mxFsS5yylSTHNivV53HoA")
        .then(results => { // Returns an <Album>
            console.log(results)
        });
})();

/* Example Output
{
  name: 'Cigarettes After Sex',
  artist: 'Cigarettes After Sex',
  year: '2017-06-09',
  tracks: [
    { name: 'K.', id: 'L4sbDxR22z4', trackNumber: 1 },
    ...
    ],
  albumCoverURL: 'https://i.scdn.co/image/ab67616d0000b27394d280f0006107be47bb4fe7'
}
*/
```

#### Downloading a Track

```JS
(async() => {
    await SpottyDL.getTrack("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT")
        .then(async(results) => {
            let track = await SpottyDL.downloadTrack(results, "~/somePath") // Second parameter is optional...
            console.log(track)
        });
})();

/* Example Output
  {
  status: true,
  filename: '~/somePath/Never Gonna Give You Up.mp3',
  id: 'lYBUbBu4W08'
  }
*/
```

#### Downloading an Album/Single

```JS
(async() => {
    await SpottyDL.getAlbum("https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT")
        .then(async(results) => {
            let album = await SpottyDL.downloadAlbum(results)
            console.log(album)
        });
})();

/* Example Output
[
  {
  status: true,
  filename: "./'K.'.mp3",
  id: 'L4sbDxR22z4'
  },
  {...}
]
*/
```

## Notes

What this module simply does is that it scrapes data from Spotify, then finds the right track/song from Youtube-Music.

Hence, there's no illegal action or DRM bypass being done within this module, as all data is freely taken and used the right way

## Special Thanks to:

[ytdl-core](https://github.com/fent/node-ytdl-core)

[ytmusic-api](https://github.com/zS1L3NT/ts-npm-ytmusic-api)

[node-id3](https://github.com/Zazama/node-id3)

And other notable NodeJS Spotify downloader projects :D
