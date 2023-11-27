import { isDate, isTimeOfDay, toPascalCase } from '../functions';
import { getDefaultValue, getInputtype } from './type-and-value';
export type DartType = 'dynamic' |
    'int' | 'int?' |
    'double' | 'double?' |
    'DateTime' | 'DateTime?' |
    'DateTimeRange' | 'DateTimeRange?' |
    'String' | 'String?' |
    'bool' | 'bool?';
export interface FormGeneratedModel {
    dartType: DartType | string;
    dataType: string;
    required: boolean;
    defaultValue: string;
    name: string;
    value: any,
    isDropdown: boolean,
    isMenuDropdown: boolean,
    isNumMinMax: boolean,
    isDateMinMax: boolean,
    isTimeMinMax: boolean,
    isNumRange: boolean,
    isDateRange: boolean,
    isTimeRange: boolean,
    isPureDate: boolean,
    isPassword: boolean;
    isTextEditingController: boolean;
    iputType: string;
}

function isPureDate(value: Date | undefined): boolean {
    return value instanceof Date
        && !isNaN(value.getTime())
        && value.getUTCHours() === 0
        && value.getUTCMinutes() === 0
        && value.getUTCSeconds() === 0
        && value.getUTCMilliseconds() === 0;
}

export function generateTheModel(obj: any): FormGeneratedModel[] {
    var model = Object.keys(obj).map((key) => {
        const optional = key.startsWith('_');
        const variableName = key.replace(/^_/, '');
        const variableValue = obj[key];
        const isArray = Array.isArray(variableValue);;
        const isMenuDropdown = (isArray && variableValue.length > 10);
        const isNumMinMax = isArray && variableValue.length === 2 && variableValue.every(e => ['bigint', 'number'].includes(typeof e));
        const isDateMinMax = isArray &&
            variableValue.length === 2 &&
            variableValue.every(e => (typeof e === 'string') && isPureDate(new Date(e)));
        const isTimeMinMax = isArray &&
            variableValue.length === 2 &&
            variableValue.every(e => (typeof e === 'string') && isTimeOfDay(e));
        const isNumRange = isArray && variableValue.length === 3 && variableValue.every(e => ['bigint', 'number'].includes(typeof e));
        const isDateRange = isArray &&
            variableValue.length === 1 &&
            Array.isArray(variableValue[0]) &&
            variableValue[0].length === 2 &&
            variableValue[0].every(e => (typeof e === 'string') && isDate(e) && isPureDate(new Date(e)));
        const isTimeRange = isArray &&
            variableValue.length === 1 &&
            Array.isArray(variableValue[0]) &&
            variableValue[0].length === 2 &&
            variableValue[0].every(e => (typeof e === 'string') && isTimeOfDay(e));
        const isDropdown = (isArray && variableValue.length <= 10) && !(
            isNumMinMax ||
            isDateMinMax ||
            isTimeMinMax ||
            isNumRange ||
            isDateRange ||
            isTimeRange
        );
        const getDatatype =function() {
            if (typeof variableValue === 'number') {
                if (Number.isInteger(variableValue)) {
                    return 'int';
                } else {
                    return 'double';
                }
            }
            else if (typeof variableValue === 'string') {
                if (isDate(`${variableValue}`)) {
                    return 'DateTime';
                }
                if (isTimeOfDay(`${variableValue}`)) {
                    return 'TimeOfDay';
                }
                return 'String';
            }
            else if (typeof variableValue === 'boolean') {
                return 'bool';
            }
            if (isDropdown) {
                return toPascalCase(variableName);
            }
            return 'dynamic';
        };
        const dataType = getDatatype();
        const nullable = (!optional || dataType === 'dynamic') ? '' : '?';
        const defaultValue = getDefaultValue(variableValue, variableName,isDropdown);
        const dartType = `${dataType}${nullable}`;
        const isDat = isDate(variableValue);
        let dateParsed;
        if (isDat) {
            dateParsed = new Date(Date.parse(variableValue));
        }
        const isPureDat = isDat && isPureDate(dateParsed);

        return {
            dartType: dartType,
            dataType: dataType,
            required: !optional,
            value: variableValue,
            defaultValue,
            isDropdown: isDropdown,
            isMenuDropdown,
            isNumMinMax,
            isDateMinMax,
            isTimeMinMax,
            isNumRange,
            isDateRange,
            isTimeRange,
            isPureDate: isPureDat,
            name: variableName,
            iputType: getInputtype(variableValue),
            isTextEditingController: ['int', 'double', 'num', 'String', 'DateTime', 'TimeOfDay',].includes(dataType) || isMenuDropdown,
            isPassword: variableValue === '*'.repeat(variableValue.length),
        };
    });
    return model;
}