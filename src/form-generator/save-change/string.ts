export function stringSaveChange(required: boolean, variableName: string) {
    return required ? `
        onSaved: (value) {
          if (value == null) return;
          ${variableName}.value = value;
          return;
        },
        onChanged: (value) {
          ${variableName}.value = value;
          return;
        },
    `: `
        onSaved: (value) {
          ${variableName}.value = value;
          return;
        },
        onChanged: (value) {
          ${variableName}.value = value;
          return;
        },
    `;
}
