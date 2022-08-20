const fs = require('fs')

let jsonData = fs.readFileSync('dataTest.json');
let data = JSON.parse(jsonData);

for (let i = 0; i < data.length; i++) {
    data[i].levels["23"] = "0"
    data[i].levels["24"] = "0"
}

let json = JSON.stringify(data)
fs.writeFileSync('dataTest.json', json)