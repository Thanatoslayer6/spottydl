const spottyDL = require('../')

let sample = [{
    status: true,
    filename: '~/somePath/Never Gonna Give You Up.mp3',
}];

let data = spottyDL.checkType(sample)
console.log(data) // Results[]
