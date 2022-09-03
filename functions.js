const {GoogleSpreadsheet} = require('google-spreadsheet');
const fs = require('fs')
const doc = new GoogleSpreadsheet('1XDyeUDxGKOUDA9u4usTIkIiA4GO7GAudBosSnHaFA1U');
const credentials = JSON.parse(fs.readFileSync("googleSheetsKeys.json"));

async function register(hiveID, telegramID) {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[1]; // first sheet
    const rows = await sheet.getRows();
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].hive == hiveID) {
            rows[i].telegramIDs = telegramID
            await rows[i].save();
        }
    }
}


async function getHive(telegramID) {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[1]; // first sheet
    const rows = await sheet.getRows();

    let result

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].telegramIDs == telegramID) {
            result = rows[i].hive
        }
    }

    return result
}


async function getTelegramID(hiveID) {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[1]; // first sheet
    const rows = await sheet.getRows();

    let result

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].hive == hiveID) {
            result = rows[i].telegramIDs
        }
    }

    if (!result) {
        return false
    } else {
        return result
    }
}

async function getLevelFront(telegramID) {

    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[0]; // first sheet
    const userHive = await getHive(telegramID)
    const rows = await sheet.getRows();

    let arrayInfo
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].hive == userHive) {
            let some = await sheet.getRows({limit: 1, offset: i});
            arrayInfo = some[0]._rawData
        }
    }

    // working with info
    let lastLevel = arrayInfo[arrayInfo.length - 1]
    let totalLevel = 0
    for (let i = 1; i < arrayInfo.length; i++) {
        totalLevel += +arrayInfo[i]
    }
    let allMeeting = 0
    for (let i = 1; i < arrayInfo.length; i++)
        if (+arrayInfo[i] !== 0) {
            allMeeting += 1
        }

    let lastMeetingDate = await sheet.getRows({limit: 1, offset: -1});
    let some = lastMeetingDate[0]._rawData
    let some2 = some[some.length - 1]

    // console.log(arrayInfo)
    let userArray = arrayInfo.slice(1)
        let avg = 0
        userArray.reverse()
        for(let i = 0; i < 6; i++ ){
            avg += +userArray[i]
        }
    return `Last meeting #: ${some2}\nLast meeting level: ${lastLevel}\nTotal meetings participated: ${allMeeting}\nTotal respect earned: ${totalLevel}\nAverage result: ${Math.ceil(avg / 6)}`
    // console.log(`Last meeting you level was <b>${lastLevel}</b> you participated in <b>${allMeeting}</b> meetings and your total respect is <b>${totalLevel}</b>`)
}

getLevelFront('215197299')

async function getLevelBack(hiveID) {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[0]; // first sheet
    const rows = await sheet.getRows();

    let arrayInfo = []
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].hive == hiveID) {
            let some = await sheet.getRows({limit: 1, offset: i});
            arrayInfo.push(...some[0]._rawData)
        }
    }

    return arrayInfo
}

async function telegramUsers() {
    console.log('function is working')
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[1]; // first sheet
    const rows = await sheet.getRows();

    let telegramUsers = []

    // console.log()
    for (let i = 0; i < rows.length; i++) {
        let some = rows[i]?.telegramIDs !== undefined
        if (some) {
            telegramUsers.push(rows[i].hive)
        }
    }

    return telegramUsers
}


async function isExistInDb(hiveID) {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[0]; // first sheet
    const rows = await sheet.getRows();

    // console.log(rows[0].hive)

    let exist = false

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].hive == hiveID) {
            exist = true
        }
    }

    console.log(exist)
    return exist
}

async function showOthers(hiveID) {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[0]; // first sheet
    // const userHive = await getHive(telegramID)
    const rows = await sheet.getRows();

    let arrayInfo
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].hive == hiveID) {
            let some = await sheet.getRows({limit: 1, offset: i});
            arrayInfo = some[0]._rawData
        }
    }

    // working with info
    let lastLevel = arrayInfo[arrayInfo.length - 1]
    let totalLevel = 0
    for (let i = 1; i < arrayInfo.length; i++) {
        totalLevel += +arrayInfo[i]
    }
    let allMeeting = 0
    for (let i = 1; i < arrayInfo.length; i++)
        if (+arrayInfo[i] !== 0) {
            allMeeting += 1
        }

    let lastMeetingDate = await sheet.getRows({limit: 1, offset: -1});
    let some = lastMeetingDate[0]._rawData
    let some2 = some[some.length - 1]

    let userArray = arrayInfo.slice(1)
    let avg = 0
    userArray.reverse()
    for(let i = 0; i < 6; i++ ){
        avg += +userArray[i]
    }
    return `Last meeting #: ${some2}\nLast meeting level: ${lastLevel}\nTotal meetings participated: ${allMeeting}\nTotal respect earned: ${totalLevel}\nAverage result: ${Math.ceil(avg / 6)}`
    // console.log(`Last meeting you level was <b>${lastLevel}</b> you participated in <b>${allMeeting}</b>
    // return `Last meeting #: ${some2}\nLast meeting level: ${lastLevel}\nTotal meetings participated: ${allMeeting}\nTotal respect earned: ${totalLevel}\n`

}

async function top12(){
    // await doc.useServiceAccountAuth({
    //     client_email: credentials.client_email,
    //     private_key: credentials.private_key,
    // });
    //
    // await doc.loadInfo(); // loads document properties and worksheets
    // const sheet = await doc.sheetsByIndex[0]; // first sheet
    // const rows = await sheet.getRows();

    // console.log(rows)
    // for(let i = 105; i < rows.length; i++){
    //     let row = await sheet.getRows({limit: 1, offset: i})
    //     let userName = row[0]._rawData[0]
    //     let userArray = row[0]._rawData.slice(1)
    //     let avg = 0
    //     userArray.reverse()
    //     for(let i = 0; i < 6; i++ ){
    //         avg += +userArray[i]
    //     }
    //     avgObject[userName] = Math.ceil(avg / 6)
    //     console.log(avgObject)
    // }

    let jsonAvgData = fs.readFileSync('avg.json');
    let dataAvg = JSON.parse(jsonAvgData);

    const sortable = Object.fromEntries(
        Object.entries(dataAvg).sort(([,a],[,b]) => a-b)
    );

    const reversedKeys = Object.keys(sortable).reverse();
    const reversedValus = Object.values(sortable).reverse()

    let result = ''
    for(let i = 0; i < 12; i++){
        result += `${i +1}.${reversedKeys[i]}: ${reversedValus[i]}\n`
    }

    let jsonData = fs.readFileSync('data.json');
    let data = JSON.parse(jsonData);
    let LastMeetingDb = data[0].date

    // console.log(`Top 12 in ${LastMeetingDb}\n${result}`)
    return `Average Top 12 for ${LastMeetingDb} \n${result}`
}



module.exports = {
    register,
    getLevelFront,
    getTelegramID,
    telegramUsers,
    getLevelBack,
    isExistInDb,
    showOthers,
    top12
}