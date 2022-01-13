import { existsSync } from 'fs'
import os from 'os'
export { getAlbum, getTrack } from './Info'
export { downloadAlbum, downloadTrack } from './Download'

export type Track = {
    title: string,
    artist: string,
    year:  string,
    album: string,
    id: string | any,
    albumCoverURL: string,
    trackNumber: number
}

export type Album = {
    name: string,
    artist: string,
    year: string,
    tracks: any | null ,
    albumCoverURL: string 
}

export type Results = { status: boolean, filename: string, id: string }

    /**
     * Check the type of the object, can be of type <Track> or <Album>
     * @param {Track|Album} ob An object, can be type <Track> or <Album>
     * @returns {string} "Track" | "Album" | "None"
     */
export const checkType = (ob: Track | Album): "Track" | "Album" | "None"  => {
    if ("title" in ob && "trackNumber" in ob){
        return "Track";
    } else if ("name" in ob && "tracks" in ob){
        return "Album";
    } else {
        return "None"
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
    if (!existsSync(c)){
        throw Error("Filepath:( " + c + " ) doesn't exist, please specify absolute path") 
    } else if (c.slice(-1) != '/'){
        return `${c}/`
    } 
    return c
}

