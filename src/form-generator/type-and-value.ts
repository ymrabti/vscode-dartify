import { isDate, isTimeOfDay, toPascalCase } from "../functions";
import { FormGeneratedModel } from "./model";

export enum DartInputs {
    text = 'text',
    number = 'number',
    datetime = 'datetime',
    phone = 'phone',
    emailAddress = 'emailAddress',
    url = 'url',
    //
    multiline = 'multiline',
    visiblePassword = 'visiblePassword',
    name = 'name',
    streetAddress = 'streetAddress',
    none = 'none',
};


export function getInputtype(variableValue: any) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let dataType = 'dynamic';
    if (typeof variableValue === 'number') {
        return `TextInputType.${DartInputs.number}`;
    }
    // 
    else if (typeof variableValue === 'string') {
        if (isDate(`${variableValue}`) || isTimeOfDay(`${variableValue}`)) {
            return `TextInputType.${DartInputs.datetime}`;
        }
        else if (variableValue === '*'.repeat(variableValue.length)) {
            return `TextInputType.${DartInputs.text},
                    obscureText: true`;
        }
        else if (emailRegex.test(variableValue)) {
            return `TextInputType.${DartInputs.emailAddress}`;
        }
        else if (urlRegex.test(variableValue)) {
            return `TextInputType.${DartInputs.url}`;
        }
        else if (phoneRegex.test(variableValue)) {
            return `TextInputType.${DartInputs.phone}`;
        }
        dataType = `TextInputType.${DartInputs.text}`;
    }
    // 

    return dataType;
}
export function getDefaultValue(value: any, name: string,isDropdown:boolean) {
    if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            return '0';
        } else {
            return '0.0';
        }
    } else if (typeof value === 'string') {
        if (isDate(`${value}`)) {
            return 'DateTime.now()';
        }
        if (isTimeOfDay(`${value}`)) {
            return 'TimeOfDay.now()';
        }
        return '""';
    } else if (typeof value === 'boolean') {
        return 'false';
    }
    if (isDropdown) {
        return `${toPascalCase(name)}.select`;
    }
    return 'null';
}
