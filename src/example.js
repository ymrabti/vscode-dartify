require('module-alias/register');

const { writeFile } = require('fs');
// const { resolve } = require('path');
const json = require('@outs/example.json');
const generateClass = require("@src/json_to_dart");
const JsonToDartClassInfo = require("@src/get_class_info_from_json");
const { yesPlease } = require('.');

function test() {
    const dartData = new JsonToDartClassInfo(json, "EPRSMPharmacienAdmin").result
    const dart = generateClass(dartData, yesPlease)
    // const dirr = resolve(__dirname, '../outs', 'example.dart');
    const farma = 'C:/Users/USER/Coding/Flutter/my-apps/pharmagest/lib/espace_personel/profile_test_section.dart'
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