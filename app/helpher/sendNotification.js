const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(process.env.ONE_SIGNAL_APP, process.env.ONE_SIGNAL_API);

async function sendPushNotification(token, text, id) {
    if (token === undefined || token === null) {
        return res({});
    }
    // let token_array = [];
    // token_array.push(token);
console.log(text)
    const notification = {
        contents: {
            'en': text,
        },
        include_player_ids: token,
        data: { scheduleId: id }


    };
    // using async/await
    try {
        const response = await client.createNotification(notification);
        console.log(response.body.id);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            // When status code of HTTP response is not 2xx, HTTPError is thrown.
            console.log(e.statusCode);
            console.log(e.body);
        }
    }
}

function dateTime() {
    const d = new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let hour = d.getHours() + 5;
    let minute = d.getMinutes();
    let seconds = d.getSeconds();


    let Time = hour > 12 ? hour + ':' + minute + ':' + seconds + ' PM' : hour + ':' + minute + ':' + seconds + ' AM'
    let date1 = year + '/' + month + '/' + date;
    let newDates = date1 + ' ' + Time;
    return newDates
};


module.exports = { sendPushNotification, dateTime }