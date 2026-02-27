const assert = require('assert');
const JsonToDartClassInfo = require('../../src/get_infos');
const { generateExtensions, generateViews, generateStates } = require('../../src/dartiding');

suite('Other Generators Test Suite', () => {
    const json = {
        "status": "ready"
    };
    const info = new JsonToDartClassInfo(json, 'StatusModel').result;
    
    const data = {
        classInfo: info,
        genForms: 'No',
        jsonWild: json,
        basename: 'status_model',
        projectName: 'my_project',
        useSeparate: false
    };

    test('generateExtensions', () => {
        const result = generateExtensions(data);
        assert.ok(typeof result === 'string');
    });

    test('generateViews', () => {
        const result = generateViews({...data, genForms: 'Yes'});
        assert.ok(typeof result === 'string');
        // Views typically produce Dart classes for Flutter forms
        assert.ok(result.includes('extends StatelessWidget') || result.includes('extends StatefulWidget') || result.includes('import'), 'Should contain typical Flutter View syntax');
    });

    test('generateStates', () => {
        const result = generateStates({...data, genForms: 'Yes'});
        assert.ok(typeof result === 'string');
    });
});
