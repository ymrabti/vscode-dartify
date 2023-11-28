const { writeFile } = require('fs');
const { resolve } = require('path');
const json = require('@outs/example.json');
const generateClass = require("@src/json_to_dart");
const JsonToDartClassInfo = require("@src/get_class_info_from_json")
module.exports = {
    test() {
        const dartData = new JsonToDartClassInfo(json, "ABCX").result
        const dart = generateClass(dartData)
        writeFile(resolve(__dirname,'../outs', 'example.dart'),
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
}