import { Album, Track, Results, checkType, checkPath } from './index'
import NodeID3 from 'node-id3'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import { readFile, unlinkSync, writeFile } from 'fs'

    /**
     * Download the Spotify Track, need a <Track> type for first param, the second param is optional
     * @param {Track} obj An object of type <Track>, contains Track details and info
     * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
     * @returns {Results} <Results> if successful, `string` if failed
     */
export const downloadTrack = async(obj: Track, outputPath: string = __dirname): Promise<Results|string> => {
    try {
        // Check type and check if file path exists...
        if (checkType(obj) != "Track"){
            throw Error("obj passed is not of type <Track>")
        }
        let albCover = await axios.get(obj.albumCoverURL, { responseType: 'arraybuffer' })
        let tags: any = {
            title: obj.title,
            artist: obj.artist,
            album: obj.album,
            year: obj.year,
            trackNumber: obj.trackNumber,
            image: {
                imageBuffer: Buffer.from(albCover.data, "utf-8")
            }
        }
        let filename = `${checkPath(outputPath)}${obj.title}.mp3`
        let stream = ytdl(obj.id , { quality: 'highestaudio', filter: 'audioonly' })
        return await new Promise<Results>((resolve, reject) => {
            ffmpeg(stream)
              .audioBitrate(128)
              .save(filename)
              .on('error', (err: any) => {
                  console.error(`Failed to write file (${filename}): ${err}`)
                  reject({ status: false, filename: filename, id: obj.id })
              })
              .on('end', () => {
                  let tagStatus = NodeID3.update(tags, filename)
                  if (tagStatus) {
                    resolve({status: true, filename: filename, id: obj.id})
                  } else {
                    reject({ status: false, filename: filename, id: obj.id });
                  }
              })
        })
        } catch (err: any) {
            return `Caught: ${err}`
        }
}

    /**
     * Download the Spotify Album, need a <Album> type for first param, the second param is optional,
     * function will return an array of <Results>  
     * @param {Track} obj An object of type <Album>, contains Album details and info
     * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
     * @returns {Results} <Results[]> if successful, `string` if failed
     */
export const downloadAlbum = async (obj: Album, outputPath: string = __dirname): Promise<Results[]|string> => {
    try {
        if (checkType(obj) != "Album"){
            throw Error("obj passed is not of type <Album>")
        } 
        let albCover = await axios.get(obj.albumCoverURL, { responseType: 'arraybuffer' })
        let Results: any = [] // Use later inside the main loop, then we return this
        let tags: any = {
            artist: obj.artist,
            album: obj.name,
            year: obj.year,
            image: {
                imageBuffer: Buffer.from(albCover.data, "utf-8")
            }
        }
        let oPath = checkPath(outputPath)
        let i: number = 0; // Variable for specifying the index of the loop
        return await new Promise <Results[]>(async(resolve, reject) => {
            for await (let res of obj.tracks){
                let filename = `${oPath}${res.name}.mp3`
                let stream = ytdl(res.id, { quality: 'highestaudio', filter: 'audioonly' })
                ffmpeg(stream)
                    .audioBitrate(128)
                    .save(filename)
                    .on('error', (err: any) => {
                        Results.push({status: false, filename: filename, id: res.id})
                        console.error(`Failed to write file (${filename}): ${err}`)
                        unlinkSync(filename)
                        // reject(err)
                    })
                    .on('end', () => {
                        i++;
                        Results.push({status: true, filename: filename, id: res.id})
                        tags.title = res.name;
                        tags.trackNumber = res.trackNumber;
                        let tagStatus = NodeID3.update(tags, filename)
                        if (i == obj.tracks.length){
                            resolve(Results);
                        }
                    })
            }
        })
    } catch (err: any) {
        return `Caught: ${err}`
    }
}
