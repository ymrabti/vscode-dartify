require('module-alias/register');

const { writeFile } = require('fs');
const { yesPlease } = require('.');
// const { resolve } = require('path');
const generateClass = require("@src/json_to_dart");
const json = require('@outs/translations.json');
const { JsonToTranslations } = require('@src/generate_translations');
function test() {
    const dartData = new JsonToTranslations(json).result
    const farma = 'C:/Users/youmt/Programminng/Flutter/my-apps/pharmagest/lib/espace_personel/profile_test_trans.dart'
    writeFile(farma,
        dartData, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Data has been written to file');
        }
    );
    return dartData;
}
test()