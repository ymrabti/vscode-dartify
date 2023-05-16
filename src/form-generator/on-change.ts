export function datetimeChange(required: boolean, variableName: string) {
    return  `
          DateTime? tryParse = DateTime.tryParse(value);
          ${required ?`if (tryParse == null) return;`:''}
          ${variableName}.value = tryParse;
    `;
}
export function intChange(required: boolean, variableName: string) {
    return  `
          int? tryParse = int.tryParse(value);
          ${required ?`if (tryParse == null) return;`:''}
          ${variableName}.value = tryParse;
    `;
}
export function doubleChange(required: boolean, variableName: string) {
    return  `
          double? tryParse = double.tryParse(value);
          ${required ? `if (tryParse == null) return;` : ''}
          ${variableName}.value = tryParse;
        `;
}

export function stringChange(required: boolean, variableName: string) {
    return `
          ${variableName}.value = value;
    `;
}


function getChange(typeData: string, required: boolean, name: string) {
    switch (typeData) {
        case 'int':
            return intChange(required, name);
        case 'int?':
            return intChange(required, name);
        case 'double':
            return doubleChange(required, name);
        case 'double?':
            return doubleChange(required, name);
        case 'DateTime':
            return datetimeChange(required, name);
        case 'DateTime?':
            return datetimeChange(required, name);

        default:
            return stringChange(required, name);
    }
}
export function change(typeData: string, required: boolean, name: string) {
    return `
        onChanged: (value) {
          ${getChange(typeData,required,name)}
          return;
        },
    `;
}