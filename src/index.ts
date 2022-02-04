import { existsSync } from 'fs'
import { isArray } from 'util'
import os from 'os'
export { getAlbum, getTrack, getAlbExp, _getAlbExp } from './Info'
export { downloadAlbum, downloadTrack, retryDownload } from './Download'

export type Track = {
    title: string
    artist: string
    year: string
    album: string
    id: string | any
    albumCoverURL: string
    trackNumber: number
}

export type Album = {
    name: string
    artist: string
    year: string
    tracks: any | null
    albumCoverURL: string
}

export interface Results {
    status: 'Success' | 'Failed (stream)' | 'Failed (tags)'
    filename: string
    id?: string
    tags?: object
}

/**
 * Check the type of the object, can be of type <Track>, <Album> or <Results[]>
 * @param {Track|Album|Results[]} ob An object, can be type <Track>, <Album> or <Results[]>
 * @returns {string} "Track" | "Album" | "Results[]" | "None"
 */
export const checkType = (ob: Track | Album | Results[]): 'Track' | 'Album' | 'Results[]' | 'None' => {
    if ('title' in ob && 'trackNumber' in ob) {
        return 'Track'
    } else if ('name' in ob && 'tracks' in ob) {
        return 'Album'
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
