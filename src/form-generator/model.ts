import { getDatatype, getDefaultValue, getInputtype } from './type-and-value';
export type DartType = 'dynamic' |
    'int' | 'int?' |
    'double' | 'double?' |
    'DateTime' | 'DateTime?' |
    'DateTimeRange' | 'DateTimeRange?' |
    'String' | 'String?' |
    'bool' | 'bool?';
export interface FormGeneratedModel {
    dartType: DartType | string;
    required: boolean;
    defaultValue: string;
    name: string;
    value: any,
    isList: boolean,
    isPassword: boolean;
    iputType: string;
}
export function generateTheModel(obj: any): FormGeneratedModel[] {
    var model = Object.keys(obj).map((key) => {
        const optional = key.startsWith('_');
        const variableName = key.replace(/^_/, '');
        const variableValue = obj[key];
        let dataType = getDatatype(variableValue, variableName);
        const nullable = (!optional || dataType === 'dynamic') ? '' : '?';
        const defaultValue = getDefaultValue(variableValue, variableName);
        return {
            dartType: `${dataType}${nullable}`,
            required: !optional,
            value: variableValue,
            defaultValue,
            isList: Array.isArray(variableValue),
            isPassword: variableValue === '*'.repeat(variableValue.length),
            name: variableName,
            iputType: getInputtype(variableValue)
        };
    });
    return model;
}