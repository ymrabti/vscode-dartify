const assert = require('assert');
const JsonToDartClassInfo = require('../../src/get_infos');
const { generateEnums } = require('../../src/dartiding');

suite('generateEnums Test Suite', () => {
    test('Should generate Enum files without error', () => {
        const json = {
            "status": "active"
        };
        const info = new JsonToDartClassInfo(json, 'Model').result;
        
        const data = {
            classInfo: info,
            genForms: 'No',
            jsonWild: json,
            basename: 'model',
            projectName: 'my_project',
            useSeparate: false
        };

        const result = generateEnums(data);
        // Might be empty if no specific enum values are detected or whatever the generator outputs
        assert.ok(typeof result === 'string');
    });
});
