# Spottydl

A **NodeJS Spotify Downloader** package without any API Keys or Authentication from Spotify or Youtube-Music.

However, this **requires [ffmpeg](https://ffmpeg.org/download.html)** to be installed on your system...

## Project Status

- [x] **Automatic tagging of .mp3 files** using [Node-ID3](https://github.com/Zazama/node-id3) includes _Year, Artist, Album, Title, and Art Cover_
- [x] **Simple and easy to use**, contains only 4 usable methods 🤔 I do need some help optimizing some parts
- [ ] Error checking, when downloading Tracks or Albums, like retrying the process when status failed...

## Installation 

_Make sure you have ffmpeg installed on your system preferably a version greater than 4.0_

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
const spottyDL = require('spottydl');

let URL = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";

(async() => {
    await spottyDL.getTrack(URL)
        .then(results => { // Returns a <Track>
            console.log(results)
        });
})();

/* OUTPUT
{
  title: 'Never Gonna Give You Up',
  artist: 'Rick Astley',
  year: '1987-11-12',
  album: 'Whenever You Need Somebody',
  id: 'lYBUbBu4W08',
  albumCoverURL: 'https://i.scdn.co/image/ab67616d0000b2735755e164993798e0c9ef7d7a',
  trackNumber: 1
}
*/
```
#### Downloading a Track

```JS
(async() => {
    await spottyDL.getTrack(URL)
        .then(results => {
            spottyDL.downloadTrack(results, "~/somePath") // Second parameter is optional...
        });
})();

/* OUTPUT
  {
  status: true,
  filename: '~/somePath/Never Gonna Give You Up.mp3',
  id: 'lYBUbBu4W08'
  }
*/
```



