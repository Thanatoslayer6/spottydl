export { getAlbum, getTrack } from './Info'
export { downloadAlbum, downloadTrack, retryDownload } from './Download'
export { checkPath, checkType } from './Util'

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


