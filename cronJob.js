let LastMeeting = '25 (20.8.2022)'
const {getTelegramID} = require('./functions')

const {GoogleSpreadsheet} = require('google-spreadsheet');
const fs = require('fs')
const doc = new GoogleSpreadsheet('1XDyeUDxGKOUDA9u4usTIkIiA4GO7GAudBosSnHaFA1U');
const credentials = JSON.parse(fs.readFileSync("googleSheetsKeys.json"));

async function isExzist() {
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });

    await doc.loadInfo();
    const sheet = await doc.sheetsByIndex[0];
    let lastMeetingDate = await sheet.getRows({limit: 1, offset: -1});
    let some = lastMeetingDate[0]._rawData
    let some2 = some[some.length -1]

    if(LastMeeting !==  some2){
        // name // level // and send to telegram
        const rows = await sheet.getRows();

        for(let i = 0; i < row.length; i++){
            bot.telegram.sendMessage(await getTelegramID(rows[i].hive), `In ${some2} meeting your level ${row[i].some2}🥳`)
        }


        LastMeeting = some2
    }


}

isExzist()