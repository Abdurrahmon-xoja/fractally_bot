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
    console.log(some2)
    return `Last meeting #: ${some2}\nLast meeting level: ${lastLevel}\nTotal meetings participated: ${allMeeting}\nTotal respect earned: ${totalLevel}\n`
    // console.log(`Last meeting you level was <b>${lastLevel}</b> you participated in <b>${allMeeting}</b> meetings and your total respect is <b>${totalLevel}</b>`)
}

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

async function telegramUser() {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = await doc.sheetsByIndex[1]; // first sheet
    const rows = await sheet.getRows();

    let usersArray = []

    for (let i = 0; 0 < rows.length; i++) {
        if (rows[i]?.telegramIDs) {
            usersArray.push(rows[i].hive)
        }
    }

    return usersArray
}



module.exports = {
    register,
    getLevelFront,
    getTelegramID,
    telegramUser,
    getLevelBack
}