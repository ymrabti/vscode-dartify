

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

function isValidPhoneNumber(input) {
    // Regular expression for phone number validation
    const phoneRegex = /^(?:\+?\d{1,3})?[-.\s]?(?:\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(input);
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

function removeQuestion(str) {
    if (str.endsWith("?")) {
        return str.substring(0, str.length - 1)
    }
    return str;
}

function toJsonForClass(parameter, className) {
    if (listRegExp.test(parameter.dataType)) {
        var optional = !parameter.required ? `?` : '';
        var param = parameter.name;
        return `${param}${optional}.map<Map<String,dynamic>>((${className} data)=> data.toJson()).toList()`
    } else if (`${parameter.dataType}`.endsWith("?")) {
        var paranam = `${parameter.name}`;
        return `${paranam}?.toJson()`
    }
    return `${parameter.name}.toJson()`
}

function fromJsonForClass(parameter, className) {
    const asmap = ' as Map<String,Object?>';
    const jsonKey = `json[${className}Enum.${parameter.name}.name]`;
    const pfj = `${parameter.className}.fromJson`;
    const pl = `(${jsonKey} as List<dynamic>).map<${parameter.className}>((dynamic data)=> ${pfj}(data ${asmap})).toList()`;
    const isOptDataType = isOptionalDataType(parameter.dataType)
    const checkedType = checkType(parameter.dataType)
    if (listRegExp.test(parameter.dataType)) {
        return isOptDataType ? `${jsonKey} == null ? ${checkedType} :${pl}` : pl
    }
    return isOptDataType ? `${jsonKey} == null ? ${checkedType} : ${pfj}(${jsonKey} ${asmap})` : `${pfj}(${jsonKey} ${asmap})`
}

function isOptionalDataType(dataType) {
    return dataType.endsWith("?")
}

function checkType(variable) {
    if (variable === 'int') {
        return '0';
    }
    if (variable === 'double') {
        return '0.0';
    }
    if (variable === 'String') {
        return '""';
    }
    if (listRegExp.test(variable)) {
        return 'List.empty';
    }
    if (variable === 'bool') {
        return 'false';
    }
    if (['int?', 'double?', 'String?', 'bool?'].includes(variable)) {
        return 'null';
    }
    else {
        return `${removeQuestion(variable)}.fromJson({})`;
    }
}

function getDartFromJSON(p, key) {
    switch (typeof (p.value)) {
        case "string":
            if (isDate(p.value)) {
                return !p.required ? `DateTime.tryParse('\${${key}}')` : `DateTime.parse('\${${key}}')`;
            }
            else if (isTimeOfDay(p.value)) {
                return !p.required ? `(DateTime${p.required ? '' : '?'} date){
              if(date!==null){
                      return TimeOfDay.fromDateTime(date);
                  }
                      return null;
              }(DateTime.tryParse('\${${key}}'))` : `TimeOfDay.fromDateTime(DateTime.parse('\${${key}}'))`;
            }
            return `${key} as String${p.required ? '' : '?'}`;
        case "number":
            if (isInteger(p.value)) {
                return !p.required ? `int.tryParse('\${${key}}')` : `int.parse('\${${key}}')`;
            }
            return !p.required ? `double.tryParse('\${${key}}')` : `double.parse('\${${key}}')`;
        case "boolean":
            return `${key} as bool${p.required ? '' : '?'}`;
        case "object":
            if (Array.isArray(p.value)) {
                return `(${key} as List<Object?>).map(
                  (Object? el)=> ${getDartFromJSON({
                    value: p.value[0],
                    required: p.required,
                }, 'el')}
                  ).toList()`
            }

            return key
        default:
            return key
    }
}

function getToMAP(dataType) {
    switch (dataType) {
        case "int":
        case "int?":
            return `.toString()`;
        case "TimeOfDay":
        case "TimeOfDay?":
            return `.toDateTime()`;

        case "double":
        case "double?":
            return `.toStringAsFixed(2)`;

        default:
            return ''
    }
}

module.exports = {
    isDate,
    isTimeOfDay,
    isInteger,
    isValidEmail,
    isValidURL,
    getRandomIntInclusive,
    getRandomFactory,
    isValidPhoneNumber,
    getAdditionalParameters,
    removeQuestion,
    toJsonForClass,
    fromJsonForClass,
    isOptionalDataType,
    checkType,
    getDartFromJSON,
    getToMAP,
    listRegExp
}
