

function isInteger(n) {
    return n === +n && n === (n | 0);
}

const listRegExp = RegExp(/^List<[a-zA-Z]+[\?]{0,1}>[\?]{0,1}$/);

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

function isValidURL(input) {
    // Regular expression for URL validation
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(input);
}
function isValidEmail(input) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input);
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {any} value 
 * @param {string} key 
 * @returns 
 */
function getRandomFactory(value, key, dataType, optional, l = 0) {
    if (optional) {
        return `null`;
    }
    if (dataType === 'int') {
        return `randomInt(${Math.round(Math.random() * 50 + 1)})`;
    }
    if (dataType === 'double') {
        return `randomDouble(${Math.random() * 50 + 1})`;
    }
    if (dataType === 'String') {
        if (key.toLowerCase().includes('name')) {
            return 'faker.fullName';
        }
        if (key.toLowerCase().includes('address')) {
            return 'faker.fullAddress';
        }
        if (key.toLowerCase().includes('image')) {
            return 'faker.img';
        }
        if (key.toLowerCase().includes('username')) {
            return 'faker.username';
        }
        if (key.toLowerCase().includes('password')) {
            return 'faker.password';
        }
        if (isValidEmail(value)) {
            var parsedDate = new Date(value)
            return `faker.email${getRandomIntInclusive(1, 4)}`;
        }
        if (isValidURL(value)) {
            var parsedDate = new Date(value)
            return `faker.uri${getRandomIntInclusive(1, 3)}`;
        }
        return `faker.str${getRandomIntInclusive(1, 8)}`;
    }
    if (dataType == 'DateTime') {
        return 'faker.dateTime';
    }
    if (dataType == 'TimeOfDay') {
        return `faker.time`;
    }
    if (listRegExp.test(value)) {
        return 'List.empty';
    }
    if (dataType === 'bool') {
        return 'faker.binary';
    }
    if (typeof (value) == "object" && !Array.isArray(value)) {
        return `${(dataType)}.random()`
    }
    if (typeof (value) == "object" && Array.isArray(value)) {
        const eDatatype = dataType.replace('List<', '').replace('>', '');
        const inList = `${dataType}.generate(10, (index) => ${getRandomFactory(value.at(0), key, eDatatype, optional)})`;
        const outList = `${getRandomFactory(value.at(0), key, eDatatype, optional)}`
        return l === 0 ? inList : outList
    }
    else {
        return `${key}`;
    }
}


function getAdditionalParameters(value, dataType, key, optional, level = 1) {
    if (typeof (value) == "string") {
        level > 1 && console.table({ value, dataType });
        if (isDate(value)) {
            var parsedDate = new Date(value)
            var isDateTime = parsedDate.getUTCHours() !== 0 || parsedDate.getUTCMinutes() !== 0 || parsedDate.getUTCSeconds() !== 0 || parsedDate.getUTCMilliseconds() !== 0;
            if (isDateTime) {
                return 'inputType : InputType.both,';
            }
            return 'inputType : InputType.date,';
        }
        else if (isTimeOfDay(value)) {
            return 'inputType : InputType.time,';
        }
        return level > 1 ? '' : ``;
    }
    if (typeof (value) == "object" && !Array.isArray(value)) {
        const eDatatype = dataType.replace('List<', '').replace('>', '');
        return `
            dropdownBuilder: (context, item) => Text('$item'),
      itemAsString: (item) => ${eDatatype != 'String' ? '\'$item\'' : 'item'},
      items: List<${dataType}>.generate(10, (index) => ${getRandomFactory(value, key, dataType, optional, 1)}),
            `
    }
    if (typeof (value) == "object" && Array.isArray(value)) {
        const eDatatype = dataType.replace('List<', '').replace('>', '');
        return `
            dropdownBuilder: (context, item) => Text('$item'),
      itemAsString: (item) => ${eDatatype != 'String' ? '\'$item\'' : 'item'},
      items: List<${eDatatype}>.generate(10, (index) => ${getRandomFactory(value, key, dataType, optional, 1)}),
            `
    }
    return '';
}
module.exports = {
    isDate,
    isTimeOfDay,
    isInteger,
    isValidEmail,
    isValidURL,
    getRandomIntInclusive,
    getRandomFactory,
    getAdditionalParameters,
    listRegExp
}