const assert = require('assert');
const JsonToDartClassInfo = require('../../src/get_infos');

suite('JsonToDartClassInfo Test Suite', () => {
    test('Should parse simple json correctly', () => {
        const json = {
            "name": "praveen",
            "age": 22,
            "isAdmin": true
        };
        const info = new JsonToDartClassInfo(json, 'User');
        const result = info.result;
        
        assert.strictEqual(result.class.length, 1);
        assert.strictEqual(result.class[0].className, 'User');
        const params = result.class[0].parameters;
        
        assert.strictEqual(params.length, 3);
        
        assert.strictEqual(params[0].name, 'name');
        assert.strictEqual(params[0].dataType, 'String');
        
        assert.strictEqual(params[1].name, 'age');
        assert.strictEqual(params[1].dataType, 'int');
        
        assert.strictEqual(params[2].name, 'isAdmin');
        assert.strictEqual(params[2].dataType, 'bool');
    });

    test('Should parse nested json correctly', () => {
        const json = {
            "order": {
                "id": 1,
                "total": 50.5
            }
        };
        const info = new JsonToDartClassInfo(json, 'Product');
        const result = info.result;
        
        // it generates multiple classes: Order, Product
        assert.strictEqual(result.class.length, 2);
        
        // Output order is array reversed based on the getter:
        // get result() { this.DartifyClassData.class.reverse(); return this.DartifyClassData; }
        // Let's check classes based on name
        const productClass = result.class.find(c => c.className === 'Product');
        const orderClass = result.class.find(c => c.className === 'Order');
        
        assert.ok(productClass);
        assert.ok(orderClass);
        
        assert.strictEqual(productClass.parameters[0].name, 'order');
        assert.strictEqual(productClass.parameters[0].dataType, 'Order');
        
        assert.strictEqual(orderClass.parameters[0].name, 'id');
        assert.strictEqual(orderClass.parameters[0].dataType, 'int');
        
        assert.strictEqual(orderClass.parameters[1].name, 'total');
        assert.strictEqual(orderClass.parameters[1].dataType, 'double');
    });

    test('Should parse lists correctly', () => {
        const json = {
            "tags": ["a", "b", "c"],
            "points": [1.5, 2.0]
        };
        const info = new JsonToDartClassInfo(json, 'Metrics');
        const result = info.result;
        
        const params = result.class[0].parameters;
        
        assert.strictEqual(params[0].name, 'tags');
        assert.strictEqual(params[0].dataType, 'List<String>');
        
        assert.strictEqual(params[1].name, 'points');
        assert.strictEqual(params[1].dataType, 'List<double>');
    });
});
