const sp = require('../');
let al = "https://open.spotify.com/album/3NcGNYXKiHeygdXXL7czL1";
let yc = "https://open.spotify.com/album/7AHbaRIYnilUwe981nZpmi";
let sd = "https://open.spotify.com/album/1qDA0jVhj4ZTjGHmpbmmwa";
let td = "https://open.spotify.com/album/7AHbaRIYnilUwe981nZpmi";
let tnd = "https://open.spotify.com/album/6psfQ7hu5uqFLkdtWyygcT"

;(async() => {
    let alb = await sp.getAlbExp(tnd);
    console.log(alb)
})()
