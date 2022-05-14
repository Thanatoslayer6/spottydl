import { Album, Track } from './index'
import { checkLinkType, getProperURL } from './Util'
import axios from 'axios'
import YTMusic from 'ytmusic-api'
const ytm = new YTMusic()

// Private methods
const get_album_playlist = async (playlistId: string) => {
    // Get the Track ID for every track by scraping from an unlisted Youtube playlist
    let properUrl = `https://m.youtube.com/playlist?list=${playlistId}`
    let resp = await axios.get(properUrl)

    // Scrape json inside script tag
    let ytInitialData = JSON.parse(
        /(?:window\["ytInitialData"\])|(?:ytInitialData) =.*?({.*?});/s.exec(resp.data)?.[1] || '{}'
    )
    let listData =
        ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer
            .contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer
    return listData.contents
}

/**
 * Get the Track details of the given Spotify Track URL
 * @param {string} url Track URL ex `https://open.spotify.com/track/...`
 * @returns {Track} <Track> if success, `string` if failed
 */
export const getTrack = async (url: string = ''): Promise<Track | string> => {
    try {
        let linkData = checkLinkType(url)
        let properURL = getProperURL(linkData.id, linkData.type)
        let sp = await axios.get(properURL)
        let info: any = /<script id="resource" type="application\/json">(.*?)<\/script>/s.exec(sp.data)
        let spData = JSON.parse(decodeURIComponent(info[1])) // info[1] matches the data to decode
        let tags: Track = {
            title: spData.name,
            artist: spData.artists.map((i: any) => i.name).join(', '),
            year: spData.album.release_date,
            album: spData.album.name,
            id: 'ID',
            albumCoverURL: spData.album.images[0].url,
            trackNumber: spData.track_number
        }

        await ytm.initialize()
        let trk = await ytm.searchSongs(`${tags.title} - ${tags.artist}`)
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
export const getAlbum = async (url: string = ''): Promise<Album | string> => {
    try {
        let linkData = checkLinkType(url)
        let properURL = getProperURL(linkData.id, linkData.type)
        let sp = await axios.get(properURL)
        let info: any = /<script id="resource" type="application\/json">(.*?)<\/script>/s.exec(sp.data)
        let spData = JSON.parse(decodeURIComponent(info[1]))
        let tags: Album = {
            name: spData.name,
            artist: spData.artists.map((e: any) => e.name).join(', '),
            year: spData.release_date,
            tracks: [],
            albumCoverURL: spData.images[0].url
        }

        // Search the album
        await ytm.initialize()
        let alb = await ytm.searchAlbums(`${spData.artists[0].name} - ${spData.name}`)
        let yt_tracks: any | undefined = await get_album_playlist(alb[0].playlistId) // Get track ids from youtube
        spData.tracks.items.forEach((i: any, n: number) => {
            tags.tracks.push({
                name: i.name,
                id: yt_tracks[n].playlistVideoRenderer.videoId,
                trackNumber: i.track_number
            })
        })

        return tags
    } catch (err: any) {
        return `Caught: ${err.name} | ${err.message}`
    }
}
