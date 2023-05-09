export function intSaveChange(required: boolean, variableName: string) {
    return required ? `
        onSaved: (value) {
          if (value == null) return;
          var tryParse = int.tryParse(value);
          if (tryParse == null) return;
          ${variableName}.value = tryParse;
          return;
        },
        onChanged: (value) {
          var tryParse = int.tryParse(value);
          if (tryParse == null) return;
          ${variableName}.value = tryParse;
          return;
        },
        
        `: `
        onSaved: (value) {
          if(value == null) return;
          var parse = int.parse(value);
          ${variableName}.value = parse;
          return;
        },
        onChanged: (value) {
          var parse = int.parse(value);
          ${variableName}.value = parse;
          return;
        },
    `;
}
export function doubleSaveChange(required: boolean, variableName: string) {
    return required ? `
        onSaved: (value) {
          if (value == null) return;
          var tryParse = double.tryParse(value);
          if (tryParse == null) return;
          ${variableName}.value = tryParse;
          return;
        },
        onChanged: (value) {
          var tryParse = double.tryParse(value);
          if (tryParse == null) return;
          ${variableName}.value = tryParse;
          return;
        },
        
        `: `
        onSaved: (value) {
          if(value == null) return;
          var parse = double.parse(value);
          ${variableName}.value = parse;
          return;
        },
        onChanged: (value) {
          var parse = double.parse(value);
          ${variableName}.value = parse;
          return;
        },
    `;
}
