import { Album, Track } from './index'
import axios from 'axios'
import YTMusic from 'ytmusic-api'
const { parse } = require('himalaya')
const ytm = new YTMusic()

    /**
     * Get the Track details of the given Spotify Track URL
     * @param {string} url Track URL ex `https://open.spotify.com/track/...`
     * @returns {Track} <Track> if success, `string` if failed
     */
export const getTrack = async (url: string = ""): Promise<Track|string> => {
    try {
        // Check if url is a track URL
        let spURL = url.split('/')
        if (spURL[3] != 'track') {
            throw {name: 'URL Error', message: `'${url}' is not a Spotify Track URL...`}
        } 
        let properURL = `http://embed.spotify.com/?uri=spotify:${spURL[3]}:${spURL[4]}`
        let sp = await axios.get(properURL)
        let spData = JSON.parse(decodeURIComponent(parse(sp.data)[2].children[3].children[3].children[0].content))

        // Return tags
        let tags: Track = {
            title: spData.name,
            artist: spData.artists.map( (i : any) => i.name ).join(', '),
            year: spData.album.release_date,
            album: spData.album.name,
            id: "ID",
            albumCoverURL: spData.album.images[0].url,
            trackNumber: spData.track_number
        }

        await ytm.initialize();
        let trk = await ytm.search(`${tags.title} - ${tags.artist}`, "SONG")
        tags.id = trk[0].videoId

        return tags

    } catch (err: any) {
        return `Caught: ${err.name} | ${err.message}`
    }
}

    /**
     * Get the Album details of the given Spotify Album URL
     * @param {string} url Album URL ex `https://open.spotify.com/album/...`
     * @returns {Album} <Album> if success, `string` if failed
     */
export const getAlbum = async (url: string = ""): Promise<Album|string> => {
    try {
        // Check if url is a track URL
        let spURL = url.split('/')
        if (spURL[3] != 'album') {
            throw {name: 'URL Error', message: `'${url}' is not a Spotify Album URL...`}
        }
        let properURL = `http://embed.spotify.com/?uri=spotify:${spURL[3]}:${spURL[4]}`
        let sp = await axios.get(properURL)
        let spData = JSON.parse(decodeURIComponent(parse(sp.data)[2].children[3].children[3].children[0].content))

        let tags : Album =  {
            name: spData.name,
            artist: spData.artists.map((e: any) => e.name ).join(', '),
            year: spData.release_date,
            tracks: [],
            albumCoverURL: spData.images[0].url
        }
        // Search for album in youtube
        await ytm.initialize()
        let alb = await ytm.search(`${tags.artist} - ${tags.name}`, "ALBUM")
        let albData = await ytm.getAlbum(alb[0].albumId)
        albData.songs.map((i: any, n: number) => tags.tracks.push({ name: i.name, id: i.videoId, trackNumber: n + 1 }))
        return tags

    } catch (err: any) {
        return `Caught: ${err.name} | ${err.message}`;
    }
}

