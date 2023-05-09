import { isDate } from "./input-type";

export function getDatatype(variableValue: any) {
    let dataType = 'dynamic';
    if (typeof variableValue === 'number') {
        if (Number.isInteger(variableValue)) {
            dataType = 'int';
        } else {
            dataType = 'double';
        }
    }
    // 
    else if (typeof variableValue === 'string') {
        if (isDate(`${variableValue}`)) {
            return 'DateTime';
        }
        dataType = 'String';
    }
    // 
    else if (typeof variableValue === 'boolean') {
        dataType = 'bool';
    }
    if (Array.isArray(variableValue)) {
        dataType = 'List';
    }
    return dataType;
}
export function getDefaultValue(variableValue: any) {
    let defaultValue = '';
    if (typeof variableValue === 'number') {
        if (Number.isInteger(variableValue)) {
            defaultValue = '0';
        } else {
            defaultValue = '0.0';
        }
    } else if (typeof variableValue === 'string') {
        defaultValue = '""';
    } else if (typeof variableValue === 'boolean') {
        defaultValue = 'false';
    }
    return defaultValue;
}
