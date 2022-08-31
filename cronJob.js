const fs = require('fs')
let LastMeetingDb = JSON.parse(fs.readFileSync('data.json'))[0].date
const {getTelegramID, telegramUser , getLevelBack} = require('./functions')
const {sendMessage} = require('./telegramFunctions')

const {GoogleSpreadsheet} = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1XDyeUDxGKOUDA9u4usTIkIiA4GO7GAudBosSnHaFA1U');
const credentials = JSON.parse(fs.readFileSync("googleSheetsKeys.json"));

async function cronJob() {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo();
    const sheet = await doc.sheetsByIndex[0];
    let lastMeetingDate = await sheet.getRows({limit: 1, offset: -1});
    let dates = lastMeetingDate[0]._rawData
    let lastMeeting = dates[dates.length - 1]

    if (LastMeetingDb !== lastMeeting) {
        const rows = await sheet.getRows();
        let telegramUsersArray = await telegramUser()
        console.log(telegramUsersArray)
        // console.log(LastMeetingDb)/
        // console.log(telegramUsersArray)
        // for (let i = 0; i < telegramUsersArray.length; i++) {
        //     let lastLevel = await getLevelBack(telegramUsersArray[i])[(await getLevelBack(telegramUsersArray[i])).length - 1]
        //     console.log('it working')
        //     console.log(lastLevel)
            // console.log(await getTelegramID( telegramUsersArray[i]))
            // console.log(`In ${lastMeeting} meeting your level ${rows[i]._rawData[rows[i]._rawData.length - 1]}🥳`)
            // sendMessage(await getTelegramID(rows[i].hive) , `In ${lastMeeting} meeting your level ${rows[i]._rawData[rows[i]._rawData.length - 1]}🥳`)
        }
        // LastMeetingDb = lastMeeting
    // }

}

cronJob()