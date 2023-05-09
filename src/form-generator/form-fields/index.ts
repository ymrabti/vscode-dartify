import { DartType, FormGeneratedModel } from "../model";
import { boolFormField, boolNullableFormField, textFormField } from "./text";



export function getFormInputElement({ element }: { element: FormGeneratedModel }): string {
    switch (element.dartType) {
        case 'int':
        case 'int?':
        case 'double':
        case 'double?':
        case 'String':
        case 'String?':
        case 'DateTime':
        case 'DateTime?':
            return textFormField(element);
        case 'bool':
            return boolFormField(element);
        case 'bool?':
            return boolNullableFormField(element);

        default:
            return '';
    }
}