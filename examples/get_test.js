const sp = require('../');
let al = "https://open.spotify.com/album/3NcGNYXKiHeygdXXL7czL1";

(async() => {
    let alb = await sp.getAlbExp(al);
    console.log(alb)
})()
