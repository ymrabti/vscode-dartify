

function isInteger(n) {
    return n === +n && n === (n | 0);
}

function isDate(str) {
    const timestamp = Date.parse(str);
    return !isNaN(timestamp);
}

function isTimeOfDay(timeString) {
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)?$/i;
    const match = timeString.match(timeRegex);

    if (!match) {
        return false;
    }

    const [reg, hourString, minuteString, meridiem] = match;
    const hour = parseInt(hourString);
    const minute = parseInt(minuteString);

    if (hour > 12 || minute >= 60) {
        return false;
    }

    const date = new Date();
    date.setHours(hour + (meridiem === 'PM' && hour !== 12 ? 12 : 0));
    date.setMinutes(minute);

    return date.getHours() === hour && date.getMinutes() === minute;
}
module.exports = {
    isDate, isTimeOfDay, isInteger
}