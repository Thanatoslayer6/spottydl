import { Album, Track, Results, checkType, checkPath } from './index'
import NodeID3 from 'node-id3'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import { unlinkSync } from 'fs'

// Experimental Private
const dl_track = async(id: string, filename: string): Promise<boolean> => {
    let stream = ytdl(id , { quality: 'highestaudio', filter: 'audioonly' })
    return await new Promise<boolean> ((resolve, reject) => {
        ffmpeg(stream)
          .audioBitrate(128)
          .save(filename)
          .on('error', (err: any) => {
              console.error(`Failed to write file (${filename}): ${err}`)
              unlinkSync(filename)
              resolve(false);
          })
          .on('end', () => {
              resolve(true);
          })
    })
}

    /**
     * Download the Spotify Track, need a <Track> type for first param, the second param is optional
     * @param {Track} obj An object of type <Track>, contains Track details and info
     * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
     * @returns {Results[]} <Results[]> if successful, `string` if failed
     */
export const downloadTrack = async(obj: Track, outputPath: string = './'): Promise<Results[]|string> => {
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
        // EXPERIMENTAL
        let dlt = await dl_track(obj.id, filename);
        if (dlt) {
            let tagStatus = NodeID3.update(tags, filename)
            if (tagStatus) {
                return [{ status: "Success", filename: filename }]
            } else {
                return [{ status: "Failed (tags)", filename: filename, tags: tags }]
            }
        } else {
            return [{ status: "Failed (stream)", filename: filename, id: obj.id, tags: tags }]
        }
        // END
        // let stream = ytdl(obj.id , { quality: 'highestaudio', filter: 'audioonly' })
        // return await new Promise<Results[]>((resolve, reject) => {
        //     ffmpeg(stream)
        //       .audioBitrate(128)
        //       .save(filename)
        //       .on('error', (err: any) => {
        //           console.error(`Failed to write file (${filename}): ${err}`)
        //           unlinkSync(filename)
        //           reject([{ status: "Failed", filename: filename, id: obj.id, tags: tags }])
        //       })
        //       .on('end', () => {
        //           let tagStatus = NodeID3.update(tags, filename)
        //           if (tagStatus) {
        //             resolve([{ status: "Success", filename: filename }])
        //           } else {
        //             reject([{ status: "Tags", filename: filename, tags: tags }]);
        //           }
        //       })
        // })
        } catch (err: any) {
            return `Caught: ${err}`
        }
}

    /**
     * Download the Spotify Album, need a <Album> type for first param, the second param is optional,
     * function will return an array of <Results>  
     * @param {Album} obj An object of type <Album>, contains Album details and info
     * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
     * @param {string} speed - String type, (optional) can be `normal` or `fast`. Normal is safer, use it if u have slow bandwidth
     * @returns {Results[]} <Results[]> if successful, `string` if failed
     */
export const downloadAlbum = async (obj: Album, outputPath: string = './', speed: string = 'normal'): Promise<Results[]|string> => {
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
        // EXPERIMENTAL
        return await new Promise <Results[]> (async (resolve, reject) => {
            if (speed == "normal") {
                for await (let res of obj.tracks) {
                    let filename = `${oPath}${res.name}.mp3`
                    let dlt = await dl_track(res.id, filename);
                    if (dlt) {
                        let tagStatus = NodeID3.update(tags, filename)
                        if (tagStatus) {
                            console.log(`Finished: ${filename}`)
                            Results.push({ status: "Success", filename: filename })
                        } else {
                            console.log(`Failed: ${filename} (tags)`)
                            Results.push({ status: "Failed (tags)", filename: filename, tags: tags })
                        }
                    } else {
                        console.log(`Failed: ${filename} (stream)`)
                        Results.push({ status: "Failed (stream)", filename: filename, id: res.id, tags: tags })
                    }
                }
                // END
            } else if (speed == "fast") {
                let i: number = 0; // Variable for specifying the index of the loop
                for await (let res of obj.tracks){
                    let filename = `${oPath}${res.name}.mp3`
                    let stream = ytdl(res.id, { quality: 'highestaudio', filter: 'audioonly' })
                    ffmpeg(stream)
                        .audioBitrate(128)
                        .save(filename)
                        .on('error', (err: any) => {
                            tags.title = res.name; // Tags
                            tags.trackNumber = res.trackNumber;
                            Results.push({ status: "Failed", filename: filename, id: res.id, tags: tags })
                            console.error(`Failed to write file (${filename}): ${err}`)
                            unlinkSync(filename)
                            // reject(err)
                        })
                        .on('end', () => {
                            i++;
                            tags.title = res.name;
                            tags.trackNumber = res.trackNumber;
                            let tagStatus = NodeID3.update(tags, filename)
                            if (tagStatus) {
                                console.log(`Finished: ${filename}`);
                                Results.push({ status: "Success", filename: filename })
                            } else {
                                console.log(`Failed to add tags: ${filename}`);
                                Results.push({ status: "Tags", filename: filename, id: res.id, tags: tags })
                            }
                            if (i == obj.tracks.length){
                                resolve(Results);
                            }
                        })
                }
            }
        })
    } catch (err: any) {
        return `Caught: ${err}`
    }
}
