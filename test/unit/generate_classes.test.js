const assert = require('assert');
const JsonToDartClassInfo = require('../../src/get_infos');
const { generateClasses } = require('../../src/dartiding');

suite('generateClasses Test Suite', () => {
    test('Should generate a basic Dart class', () => {
        const json = {
            "title": "testing",
            "count": 5
        };
        const info = new JsonToDartClassInfo(json, 'BasicClass').result;
        
        const data = {
            classInfo: info,
            genForms: 'No',
            jsonWild: json,
            basename: 'basic',
            projectName: 'my_project',
            useSeparate: false
        };

        const result = generateClasses(data);

        assert.ok(result.includes('class BasicClass'), 'Missing class structure');
        assert.ok(result.includes('final String title;'), 'Missing title field');
        assert.ok(result.includes('final int count;'), 'Missing count field');
        
        // Check for general methods
        assert.ok(result.includes('BasicClass copyWith({'), 'Missing copyWith');
        assert.ok(result.includes('Map<String,Object?> toJson()') || result.includes('Map<String, Object?> toJson()'), 'Missing toJson');
        assert.ok(result.includes('factory BasicClass.fromJson(Map<String , Object?> json)') || result.includes('factory BasicClass.fromJson(Map<String, Object?> json)'), 'Missing fromJson');
    });

    test('Should generate multiple classes for nested structures', () => {
        const json = {
            "name": "tester",
            "metadata": {
                "version": 1.0,
                "created": "2024-01-01"
            }
        };
        const info = new JsonToDartClassInfo(json, 'ComplexClass').result;
        
        const data = {
            classInfo: info,
            genForms: 'No',
            jsonWild: json,
            basename: 'complex',
            projectName: 'my_project',
            useSeparate: false
        };

        const result = generateClasses(data);
        assert.ok(result.includes('class ComplexClass'));
        assert.ok(result.includes('class Metadata'));
        assert.ok(result.includes('final Metadata metadata;'), 'Missing metadata inner field');
    });
});
