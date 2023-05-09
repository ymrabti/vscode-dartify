import { FormGeneratedModel } from "../model";
import { getSaveChange } from "../save-change";
import { validator } from "../validators";

export function textFormField(element: FormGeneratedModel) {
    return `
        TextFormField(
            keyboardType: ${element.iputType},
            /* ${element.name} */
            ${validator(element)}
            ${getSaveChange(element.dartType, element.required, element.name)}
            decoration: InputDecoration(
                hintText: '${element.name}',
                labelText: '${element.name}',
                suffix: Container(),
            ),
            textInputAction: TextInputAction.next,
        ),
        `;
}
export function boolFormField(element: FormGeneratedModel) {
    return `
    
      SwitchListTile(
          /* ${element.name} */
        value: ${element.name}.value,
        title: Text('active \${${element.name}.value}'),
        onChanged: (value) {
          ${element.name}.value = value;
        },
      ),
      
        `;
}
export function boolNullableFormField(element: FormGeneratedModel) {
    return `
    
      CheckboxListTile(
          /* ${element.name} */
        value: ${element.name}.value,
        tristate: true,
        title: Text('active \${${element.name}.value}'),
        onChanged: (value) {
          ${element.name}.value = value;
        },
      ),
      
        `;
}
    // ${element.required ? `initialValue: '${element.defaultValue}',` : ''}