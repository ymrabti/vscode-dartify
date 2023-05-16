export function convertLettersREGEX(text: string) {
    // Use a regular expression to match all letter derivants
    const regex = /[ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÇçÑñ]/g;
    // Replace all letter derivants with their corresponding letters using a regular expression
    return text.replace(regex, (char) =>
        // Use a regular expression to determine the corresponding letter for each derivant
        char.replace(/À|Á|Â|Ã|Ä|Å/g, 'A')
            .replace(/à|á|â|ã|ä|å/g, 'a')
            .replace(/È|É|Ê|Ë/g, 'E')
            .replace(/è|é|ê|ë/g, 'e')
            .replace(/Ì|Í|Î|Ï/g, 'I')
            .replace(/ì|í|î|ï/g, 'i')
            .replace(/Ò|Ó|Ô|Õ|Ö|Ø/g, 'O')
            .replace(/ò|ó|ô|õ|ö|ø/g, 'o')
            .replace(/Ù|Ú|Û|Ü/g, 'U')
            .replace(/ù|ú|û|ü/g, 'u')
            .replace(/Ç/g, 'C')
            .replace(/ç/g, 'c')
            .replace(/Ñ/g, 'N')
            .replace(/ñ/g, 'n')
    );
}
export function toSnakeCase(text: string) {
    // Replace all non-alphanumeric characters with a hyphen
    text = convertLettersREGEX(text).replace(/[^a-zA-Z0-9]/g, '_');
    // Convert the text to lowercase
    text = text.toLowerCase();
    // Remove any hyphens at the beginning or end of the text
    text = text.replace(/^-|-$/g, '');
    // Replace any multiple hyphens with a single hyphen
    text = text.replace(/-{2,}/g, '_');
    return `${text}`.replace(/(_{2,})/g, '_');
}
export function toCamelCase(mot: string) {
    var str = convertLettersREGEX(mot);
    const replacement = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    });
    const match = `${replacement}`
        .match(/[a-zA-Z]+/g);
    const words = match === null ? [''] : match.map(e => e.match(/[a-zA-Z]+/g));

    return words.join('');
}
export function toPascalCase(str: string) {
    var txt = toCamelCase(str);
    return `${txt}`.charAt(0).toUpperCase() + `${txt}`.slice(1);
}

export function isTimeOfDay(timeString: string): boolean {
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)?$/i;
    const match = timeString.match(timeRegex);

    if (!match) {
        return false;
    }

    const [_, hourString, minuteString, meridiem] = match;
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
