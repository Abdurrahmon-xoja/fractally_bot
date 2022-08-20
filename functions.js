const fs = require('fs');

let jsonData = fs.readFileSync('data.json');
let data = JSON.parse(jsonData);


// result of --'s  meeting this hive account level is -- and avg
function getHive(hiveID){
    let result
    data.forEach(info => {
        if(hiveID == info.name){
            let objectValue = Object.values(info.levels)
            let revers = objectValue.reverse()
            let avg = 0
            for(let i = 0; i <= 5; i++){
                avg += +revers[i]
            }
            objectValue.reverse()
            result = `result of ${objectValue.length}'s  meeting ${hiveID} hive account level is ${objectValue[objectValue.length - 1]} and avg is ${Math.round(avg / 6)}`
        }
    })
    return result
}



function isExist(hiveID){
    let exist = false
    data.forEach(info => {
        if(hiveID == info.name){
            exist = true
        }
    })

    return exist
}


module.exports = {
    getHive,
    isExist
}