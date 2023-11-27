/* export function datetimeSave(required: boolean, variableName: string) {
    return `
          if(value == null) return;
          DateTime? tryParse = DateTime.tryParse(value);
          ${required ? `if (tryParse == null) return;` : ''}
          ${variableName}.value = tryParse;
    `;
}
export function timeofdaySave(required: boolean, variableName: string) {
    return `
          if(value == null) return;
          DateTime? tryParse = DateTime.tryParse(value);
          ${required ? `if (tryParse == null) return;` : ''}
          ${variableName}.value = tryParse;
    `;
} */
export function intSave(required: boolean, variableName: string) {
    return `
          if(value == null) return;
          int? tryParse = int.tryParse(value);
          ${required ? `if (tryParse == null) return;` : ''}
          ${variableName}.value = tryParse;
    `;
}
export function doubleSave(required: boolean, variableName: string) {
    return `
          if(value == null) return;
          double? tryParse = double.tryParse(value);
          ${required ? `if (tryParse == null) return;` : ''}
          ${variableName}.value = tryParse;
    `;
}

export function stringSave(required: boolean, variableName: string) {
    return `
          ${required ? `if(value == null) return;` : ``}
          ${variableName}.value = value;
    `;
}

function getSave(typeData: string, required: boolean, name: string) {
    switch (typeData) {
        case 'int':
        case 'int?':
            return intSave(required, name);
        case 'double':
        case 'double?':
            return doubleSave(required, name);
        case 'DateTime':
        case 'DateTime?':
        case 'TimeOfDay':
        case 'TimeOfDay?':
            return '';

        default:
            return stringSave(required, name);
    }
}
export function save(typeData: string, required: boolean, name: string) {
    return `
        onSaved: (value) {
          ${getSave(typeData, required, name)}
          return;
        },
    `;
}
