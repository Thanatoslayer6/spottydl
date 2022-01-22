import { Album, Track, Results, checkType, checkPath } from './index'
import NodeID3 from 'node-id3'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios'
import { unlinkSync } from 'fs'

// Experimental Private
const dl_track = async(id: string, filename: string): Promise<boolean> => {
    // let stream = ytdl(id , { quality: 'highestaudio', filter: 'audioonly' })
    return await new Promise<boolean> ((resolve, reject) => {
        ffmpeg(ytdl(id , { quality: 'highestaudio', filter: 'audioonly' }))
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

const dl_album_normal = async(obj: Album, oPath: string, tags: any): Promise<Results[]> => {
    let Results: any = [];
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
    return Results;
}

const dl_album_fast = async(obj: Album, oPath: string, tags: any): Promise<Results[]> => {
    let Results: any = [];
    let i: number = 0; // Variable for specifying the index of the loop
    return await new Promise<Results[]> (async (resolve, reject) => {
        for await (let res of obj.tracks) {
            let filename = `${oPath}${res.name}.mp3`
            // let stream = ytdl(res.id, { quality: 'highestaudio', filter: 'audioonly' })
            ffmpeg(ytdl(res.id, { quality: 'highestaudio', filter: 'audioonly' }))
                .audioBitrate(128)
                .save(filename)
                .on('error', (err: any) => {
                    tags.title = res.name; // Tags
                    tags.trackNumber = res.trackNumber;
                    Results.push({ status: "Failed (stream)", filename: filename, id: res.id, tags: tags })
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
                        Results.push({ status: "Failed (tags)", filename: filename, id: res.id, tags: tags })
                    }
                    if (i == obj.tracks.length){
                        resolve(Results);
                    }
                })
        }
    })
}
// END

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
                
    } catch (err: any) {
        return `Caught: ${err}`
    }
}

    /**
     * Download the Spotify Album, need a <Album> type for first param, the second param is optional,
     * function will return an array of <Results>  
     * @param {Album} obj An object of type <Album>, contains Album details and info
     * @param {string} outputPath - String type, (optional) if not specified the output will be on the current dir
     * @param {boolean} sync - Boolean type, (optional) can be `true` or `false`. Normal (true) is safer/less errors, for slower bandwidths
     * @returns {Results[]} <Results[]> if successful, `string` if failed
     */
export const downloadAlbum = async (obj: Album, outputPath: string = './', sync: boolean = true): Promise<Results[]|string> => {
    try {
        if (checkType(obj) != "Album"){
            throw Error("obj passed is not of type <Album>")
        } 
        let albCover = await axios.get(obj.albumCoverURL, { responseType: 'arraybuffer' })
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
        if (sync) {
            return await dl_album_normal(obj, oPath, tags);
        } else {
            return await dl_album_fast(obj, oPath, tags)
        }
    } catch (err: any) {
        return `Caught: ${err}`
    }
}

    /**
     * Retries the download process if there are errors. Only use this after `downloadTrack()` or `downloadAlbum()` methods
     * checks for failed downloads then tries again, returns <Results[]> object array
     * @param {Results[]} obj An object of type <Results[]>, contains an array of results
     * @returns {Results[]} <Results[]> if successful, `string` if failed
     */
export const retryDownload = async(Info: Results[]): Promise<Results[]|string> => {
    try {
        if (checkType(Info) != "Results[]"){
            throw Error("obj passed is not of type <Results[]>")           
        }
        // Filter the results
        let failedStream = Info.filter(i => i.status == 'Failed (stream)' || i.status == 'Failed (tags)')
        if (failedStream.length == 0){ // Check
            console.log(`No Errors found :D`)
        }
        let Results: any = [];
        failedStream.map(async (i: any) => {
            if (i.status == "Failed (stream)"){
                let dlt = await dl_track(i.id, i.filename);
                if (dlt) {
                    let tagStatus = NodeID3.update(i.tags, i.filename)
                    if (tagStatus) {
                        Results.push({ status: "Success", filename: i.filename })
                    } else {
                        Results.push({ status: "Failed (tags)", filename: i.filename, tags: i.tags })
                    }
                } else {
                    Results.push({ status: "Failed (stream)", filename: i.filename, id: i.id, tags: i.tags })
                }
            } else if (i.status == "Failed (tags)"){
                let tagStatus = NodeID3.update(i.tags, i.filename)
                if (tagStatus) {
                    Results.push({ status: "Success", filename: i.filename })
                } else {
                    Results.push({ status: "Failed (tags)", filename: i.filename, tags: i.tags })
                }
            }
        })
        return Results;
    } catch (err) {
        return `Caught: ${err}`
    }
}
