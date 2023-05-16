import { FormGeneratedModel } from "./model";
import { DartInputs } from "./type-and-value";

function intValidator() {
    return `
        if (!value.isNum) {
            return 'Error';
        }
        final n = int.tryParse(value);
        if (n == null) {
            return 'Error';
        }
    `;
}
function doubleValidator() {
    return `
        if (!value.isNum) {
            return 'Error';
        }
        final n = double.tryParse(value);
        if (n == null) {
            return 'Error';
        }
    `;
}
function datetimeValidator() {
    return `
        if (!value.isDateTime) {
            return 'Error';
        }
        DateTime? parsedDate = DateTime.tryParse(value);
        if (parsedDate == null) {
            return 'Error';
        }
    `;
}
function emailValidator() {
    return `
        if (!value.isEmail) {
            return 'Error';
        }
    `;
}
function urlValidator() {
    return `
        if (!value.isURL) {
            return 'Error';
        }
    `;
}
function phoneValidator() {
    return `
        if (!value.isPhoneNumber) {
            return 'Error';
        }
    `;
}
function passwordValidator() {
    return `
        if (value.length < 8 || value.isAlphabetOnly) {
            return 'Error';
        }
    `;
}
function getValidatorByType(element: FormGeneratedModel) {
    switch (element.dartType) {
        case 'int':
            return intValidator();
        case 'double':
            return doubleValidator();
        case 'DateTime':
            return datetimeValidator();

        default:
            return '';
    }
}
function getValidatorByInput(element: FormGeneratedModel) {
    switch (element.iputType) {
        case `TextInputType.${DartInputs.emailAddress}`:
            return emailValidator();
        case `TextInputType.${DartInputs.phone}`:
            return phoneValidator();
        case `TextInputType.${DartInputs.url}`:
            return urlValidator();

        default:
            return '';
    }
}
function getOtherValidators(element: FormGeneratedModel) {
    if (element.isPassword) { return passwordValidator(); }
    else { return ''; }
}

export function validator(element: FormGeneratedModel) {
    return `validator: (value) {
        ${element.required ?
            `if (value == null) return 'Error';
        if (value.isEmpty) return 'Error';`: 'if (value == null) return  null;'}

        ${getValidatorByType(element)}
        ${getValidatorByInput(element)}
        ${getOtherValidators(element)}
        return null;
    },`;
}
