import { toPascalCase } from "../functions";
import { FormGeneratedModel } from "./model";
import { change } from "./on-change";
import { save } from "./on-save";
import { validator } from "./validate";

export function textFormField(element: FormGeneratedModel) {
  return `
        TextFormField(
            keyboardType: ${element.iputType},
            initialValue: '',
            /* ${element.name} */
            ${validator(element)}
            ${save(element.dartType, element.required, element.name)}
            ${change(element.dartType, element.required, element.name)}
            decoration: InputDecoration(
                hintText: '${element.name}',
                label: labelRichText(text: '${element.name}', context: context, required: ${element.required}),
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
export function dropdownFormField(e: FormGeneratedModel) {
  const enumName = toPascalCase(e.name);
  return `
    DropdownButtonFormField<${enumName}>(
        isExpanded: true,
        decoration: InputDecoration(
          label: labelRichText(
            context: context,
            required: ${e.required},
            text: '${e.name}',
          ),
        ),
        value: ${e.name}.value,
        icon: const Icon(Icons.arrow_downward),
        elevation: 16,
        onChanged: (value) {
          if (value == null) return;
          ${e.name}.value = value;
        },
        validator: (value) {
          if (value == null) return 'Error';
          if (value == ${enumName}.select) return 'Error';
          return null;
        },
        onTap: () {
          return;
        },
        hint: Text(
          '${e.name}',
          locale: Get.locale,
        ),
        items: ${enumName}.values.map<DropdownMenuItem<${enumName}>>((${enumName} value) {
          return DropdownMenuItem<${enumName}>(
            value: value,
            child: Text(
              value.label,
              locale: Get.locale,
            ),
          );
        }).toList(),
      ),
        `;
}
// ${element.required ? `initialValue: '${element.defaultValue}',` : ''}



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
      return dropdownFormField(element);
  }
}