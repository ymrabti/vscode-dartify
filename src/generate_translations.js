
class JsonToTranslations {
    get result() {
        return this.DartifyTranslations
    };
    /**
     * 
     * @param {any[]} data Liste of translations items
     * @returns 
     */
    constructor(json) {
        var unics = json.reduce((prev, curr) => {
            if (prev.includes(curr)) {

            } else {
                prev.push(curr);
            }
            return prev;
        }, []);
        const enumExport = unics.map(e => {
            const camel = to_camelCase(e);
            console.log({ e: e });
            return ({ 'key': camel, 'fr': e.fr.replace(/\s/g, ' '), 'ar': '', 'en': '' });
        });
        this.DartifyTranslations = JSON.stringify(enumExport);
    }
}

function convertLettersREGEX(text) {
    // Use a regular expression to match all letter derivants
    const regex = /[ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÇçÑñ]/g;
    // Replace all letter derivants with their corresponding letters using a regular expression
    return text.key.replace(regex, (char) =>
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
            // de
            .replace(/De/g, '')
            .replace(/de/g, '')
            // la
            .replace(/La/g, '')
            .replace(/la/g, '')
            // le
            .replace(/Le/g, '')
            .replace(/le/g, '')
            // les
            .replace(/les/g, '')
            .replace(/Les/g, '')
            // N°
            .replace(/^N°/g, '')
    );
}

function to_snake_case(text) {
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

function to_camelCase(mot) {
    var str = convertLettersREGEX(mot)
    const replacement = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    });
    const words = `${replacement}`
        .match(/[a-zA-Z]+/g)
        .map(e => e.match(/[a-zA-Z]+/g));
    return words.slice(0, 6).join('');
}
function toPascalCase(str) {
    var txt = to_camelCase(str)
    return `${txt}`.charAt(0).toUpperCase() + `${txt}`.slice(1);
}
module.exports = { JsonToTranslations, toPascalCase, to_snake_case }