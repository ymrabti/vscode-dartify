import { getInputtype } from './types/input-type';
import { getDatatype, getDefaultValue } from './types/type-and-value';
export type DartType = 'dynamic' |
    'int' | 'int?' |
    'double' | 'double?' |
    'DateTime' | 'DateTime?' |
    'DateTimeRange' | 'DateTimeRange?' |
    'String' | 'String?' |
    'bool' | 'bool?' | 'List';
export interface FormGeneratedModel {
    dartType: DartType | string;
    required: boolean;
    defaultValue: string;
    name: string;
    isPassword: boolean;
    iputType: string;
}
export function generateTheModel(obj: any): FormGeneratedModel[] {
    var model = Object.keys(obj).map((key) => {
        const optional = key.startsWith('_');
        const variableName = key.replace(/^_/, '');
        const variableValue = obj[key];
        let dataType = getDatatype(variableValue);
        const nullable = (!optional || dataType === 'dynamic') ? '' : '?';
        const defaultValue = getDefaultValue(variableValue);
        return {
            dartType: `${dataType}${nullable}`,
            required: !optional,
            defaultValue,
            isPassword: variableValue === '*'.repeat(variableValue.length),
            name: variableName,
            iputType: getInputtype(variableValue)
        };
    });
    return model;
}