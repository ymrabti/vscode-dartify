require('module-alias/register');

const { writeFile } = require('fs');
const { yesPlease, nooThanks } = require('.');
// const { resolve } = require('path');
const generateClass = require("@src/json_to_dart");
const JsonToDartClassInfo = require("@src/get_class_info_from_json");
const json = require('@outs/example.json');

function test() {
    const dartData = new JsonToDartClassInfo(json, "TestSectionPharmagest").result
    const dart = generateClass(dartData, yesPlease, JSON.stringify(json))
    // const dirr = resolve(__dirname, '../outs', 'example.dart');
    const farma = 'C:/Users/youmt/Programminng/Flutter/my-apps/pharmagest/lib/espace_pharmacien/models/screen_test.dart'
    writeFile(farma,
        dart, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Data has been written to file');
        }
    );
    return dart;
}
test()