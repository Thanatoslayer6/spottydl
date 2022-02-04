const sp = require('../');
let al = "https://open.spotify.com/album/3NcGNYXKiHeygdXXL7czL1";
let yc = "https://open.spotify.com/album/7AHbaRIYnilUwe981nZpmi";
let sd = "https://open.spotify.com/album/1qDA0jVhj4ZTjGHmpbmmwa";
let td = "https://open.spotify.com/album/7AHbaRIYnilUwe981nZpmi";
let tnd = "https://open.spotify.com/album/6psfQ7hu5uqFLkdtWyygcT"
let kn = "https://open.spotify.com/album/4UMXvtXMP0JW3jRsm8jvPd" // does not work due to .indexOf

// Unlisted playlist ID of an album
let id = "OLAK5uy_m3Fukipf4Vmp4iRV6nAK_iWT4D4MEGlrI"
let id_1 = "OLAK5uy_ndnboZopfLBTBiZZ_TvCZY4vpTlwk9tfo";
// DEPRECATED...
// ;(async() => {
//     let alb = await sp.getAlbExp(kn); 
//     console.log(alb)
// })()

;(async() => {
    let alb = await sp._getAlbExp(id); 
    console.log(alb)
})()




// MUSIC VIDEO of Today's supernatural by AnCo
//https://music.youtube.com/watch?v=47xbkT3calM&list=OLAK5uy_ndnboZopfLBTBiZZ_TvCZY4vpTlwk9tfo
