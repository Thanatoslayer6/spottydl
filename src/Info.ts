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
    // let resp = await axios.get(properUrl, {headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; rv:100.0) Gecko/20100101 Firefox/100.0'  }})

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
        let info: any = /<script id="initial-state" type="text\/plain">(.*?)<\/script>/s.exec(sp.data)

        // Decode the base64 data, then parse as json... info[1] matches the encoded data
        let spData = JSON.parse(Buffer.from(decodeURIComponent(info[1]), 'base64').toString('utf8'))
        // Assign necessary items to a variable
        let spTrk = spData.entities.items[`spotify:${linkData.type}:${linkData.id}`]
        let tags: Track = {
            title: spTrk.name,
            // artist: tempartist,
            artist: spTrk.otherArtists.items.length == 0 ? spTrk.firstArtist.items[0].profile.name : spTrk.firstArtist.items[0].profile.name + ', ' + spTrk.otherArtists.items.map((i: any) => i?.profile?.name).join(', '),
            // artist: trk.data.entity.artists.map((i: any) => i.name).join(', '),
            // year: spData.data.entity.releaseDate,
            year: `${spTrk.albumOfTrack.date.year}-${spTrk.albumOfTrack.date.month}-${spTrk.albumOfTrack.date.day}`,
            // album: spData.album.name || undefined,
            album: spTrk.albumOfTrack.name,
            id: 'ID',
            // albumCoverURL: spData.data.entity.coverArt.sources[0].url,
            albumCoverURL: spTrk.albumOfTrack.coverArt.sources[0].url,
            //trackNumber: spData.track_number || undefined
            trackNumber: spTrk.trackNumber
        }
        await ytm.initialize()
        let yt_trk = await ytm.searchSongs(`${tags.title} - ${tags.artist}`)
        tags.id = yt_trk[0].videoId

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
        let info: any = /<script id="initial-state" type="text\/plain">(.*?)<\/script>/s.exec(sp.data)
        let spData = JSON.parse(Buffer.from(decodeURIComponent(info[1]), 'base64').toString('utf8'))
        // Assign necessary items to a variable
        let spTrk = spData.entities.items[`spotify:${linkData.type}:${linkData.id}`]
        let tags: Album = {
            name: spTrk.name,
            artist: spTrk.artists.items.map((e: any) => e.profile.name).join(', '),
            year: `${spTrk.date.year}-${spTrk.date.month}-${spTrk.date.day}`,
            tracks: [],
            albumCoverURL: spTrk.coverArt.sources[0].url
        }

        // Search the album
        await ytm.initialize()
        let alb = await ytm.searchAlbums(`${tags.artist} - ${tags.name}`)
        let yt_tracks: any | undefined = await get_album_playlist(alb[0].playlistId) // Get track ids from youtube
        spTrk.tracks.items.forEach((i: any, n: number) => {
            tags.tracks.push({
                name: i.track.name,
                id: yt_tracks[n].playlistVideoRenderer.videoId,
                trackNumber: i.track.trackNumber
            })
        })

        return tags
    } catch (err: any) {
        return `Caught: ${err.name} | ${err.message}`
    }
}
