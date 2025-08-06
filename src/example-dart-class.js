require('module-alias/register');

const { writeFile } = require('fs');
const { yesPlease, nooThanks } = require('.');
// const { resolve } = require('path');
const JsonToDartClassInfo = require('@src/get_class_info_from_json');
const json = require('@outs/example.json');
const { generateClasses } = require('./dartiding');

function test() {
    const dartData = new JsonToDartClassInfo(json, 'TestSectionPharmagest').result;
    const dart = generateClasses({
        jsonWild: JSON.stringify(json),
        classInfo: dartData,
        useSeparate: nooThanks,
        projectName: 'citizens_reviews_2',
        genForms: nooThanks,
    });
    // const dirr = resolve(__dirname, '../outs', 'example.dart');
    const farma = 'C:/Users/youmt/Programminng/Flutter/my-apps/citizens_reviews_2/lib/shared/test.dart';
    writeFile(farma, dart, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data has been written to file');
    });
    return dart;
}
test();
