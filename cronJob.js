const fs = require('fs');
let jsonData = fs.readFileSync('data.json');
let data = JSON.parse(jsonData);
let LastMeetingDb = data[0].date


const {getTelegramID, telegramUsers , getLevelBack} = require('./functions')
const {sendMessage} = require('./telegramFunctions')

const {GoogleSpreadsheet} = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1XDyeUDxGKOUDA9u4usTIkIiA4GO7GAudBosSnHaFA1U');
const credentials = JSON.parse(fs.readFileSync("googleSheetsKeys.json"));

async function cronJob() {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo()
    const sheet = await doc.sheetsByIndex[0]
    let lastMeetingDate = await sheet.getRows({limit: 1, offset: -1})
    let dates = lastMeetingDate[0]._rawData
    let lastMeeting = dates[dates.length - 1]


    if (LastMeetingDb !== lastMeeting) {
        let telegramUsersArray = await telegramUsers()
        for (let i = 0; i < telegramUsersArray.length; i++) {
            let newLastLevelArray = await getLevelBack(telegramUsersArray[i])
            let newLastLevel = newLastLevelArray[newLastLevelArray.length - 1]
            sendMessage(await getTelegramID( telegramUsersArray[i]) , `UPDATE: Meeting #${lastMeeting}. Earned level: ${newLastLevel} `)
        }
    }

    // console.log('*** ' + lastMeeting )
    data[0].date = lastMeeting
    let json = JSON.stringify(data)
    fs.writeFileSync('data.json' , json)
}

cronJob()