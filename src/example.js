require('module-alias/register');

const { writeFile } = require('fs');
// const { resolve } = require('path');
const json = require('@outs/example.json');
const generateClass = require("@src/json_to_dart");
const JsonToDartClassInfo = require("@src/get_class_info_from_json");
const { yesPlease, nooThanks } = require('.');
console.log({ yesPlease, nooThanks });

function test() {
    const dartData = new JsonToDartClassInfo(json, "ABCX").result
    const dart = generateClass(dartData, nooThanks)
    // const dirr = resolve(__dirname, '../outs', 'example.dart');
    writeFile('C:/Users/USER/Coding/Flutter/my-apps/pharmagest/lib/espace_personel/components/auth_screens/screen_signup/components/test.dart',
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