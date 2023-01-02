import { Track, Album, Playlist, Results } from './index'
import { existsSync } from 'fs'
import { isArray } from 'util'
import os from 'os'

export const checkLinkType = (link: string) => {
    const reg =
        /^(?:spotify:|(?:https?:\/\/(?:open|play|embed)\.spotify\.com\/))(?:embed|\?uri=spotify:|embed\?uri=spotify:)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/
    const match = link.match(reg)
    if (match) {
        return {
            type: match[1],
            id: match[2]
        }
    } else {
        throw { name: 'URL Error', message: `'${link}' is not a Spotify URL...` }
    }
}

export const getProperURL = (id: string, type: string) => {
    // UPDATE: Embed link doesn't allow scraping anymore due to new Spotify UI change
    // return `https://embed.spotify.com/?uri=spotify:${type}:${id}`
    return `https://open.spotify.com/${type}/${id}`
}

/**
 * Check the type of the object, can be of type <Track>, <Album> or <Results[]>
 * @param {Track|Album|Playlist|Results[]} ob An object, can be type <Track>, <Album> or <Results[]>
 * @returns {string} "Track" | "Album" | "Playlist" | "Results[]" | "None"
 */
export const checkType = (
    ob: Track | Album | Playlist | Results[]
): 'Track' | 'Album' | 'Playlist' | 'Results[]' | 'None' => {
    if ('title' in ob && 'trackNumber' in ob) {
        return 'Track'
    } else if ('name' in ob && 'tracks' in ob && 'albumCoverURL' in ob) {
        return 'Album'
    } else if ('name' in ob && 'owner' in ob && 'playlistCoverURL' in ob) {
        return 'Playlist'
    } else if ('status' in ob[0] && 'filename' in ob[0] && isArray(ob) == true) {
        return 'Results[]'
    } else {
        return 'None'
    }
}

/**
 * Check the path if it exists, if not then we throw an error
 * @param {string} path A string that specifies the path
 * @returns {string} `path` modified to be absolute
 */
export const checkPath = (path: string) => {
    // First we convert tilda/~ to the home directory
    let c = path.replace(`~`, os.homedir())
    if (!existsSync(c)) {
        throw Error('Filepath:( ' + c + " ) doesn't exist, please specify absolute path")
    } else if (c.slice(-1) != '/') {
        return `${c}/`
    }
    return c
}
