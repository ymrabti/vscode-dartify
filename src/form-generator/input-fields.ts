import { toPascalCase } from "../functions";
import { FormGeneratedModel } from "./model";
import { change } from "./on-change";
import { save } from "./on-save";
import { onTap } from "./on-tap";
import { validator } from "./validate";

export function textFormField(element: FormGeneratedModel) {
  const numberScale: string = `${element.dartType} ${element.name}Value = ${element.name}.value;
              ${!element.required ? `if(${element.name}Value == null) return;` : ''}`;
  const updateController: string = `${element.name}TextController.text = ${element.name}${element.required ? '.v' : 'V'}alue.toString();`;
  return `
        TextFormField(
            keyboardType: ${element.iputType},
            ${element.isTextEditingController ? `controller: ${element.name}TextController,` : ''}
            /* ${element.name} */
            ${validator(element)}
            ${save(element.dartType, element.required, element.name)}
            ${change(element.dataType, element.required, element.name)}
            ${onTap(element)}
            decoration: InputDecoration(
                hintText: '${element.name}',
                label: labelRichText(text: '${element.name}', context: context, required: ${element.required}),
                ${['int', 'double', 'num'].includes(element.dataType) ? `
                suffix: ActionChip(
            onPressed: () {
              ${element.required ? '' : `${numberScale}`}
              ${element.name}${element.required ? `.v` : `V`}alue++;
              ${updateController}
            },
            label: const Padding(
              padding: EdgeInsets.all(8),
              child: Icon(Icons.add),
            ),
          ),
          prefix: ActionChip(
            onPressed: () {
              ${element.required ? '' : `${numberScale}`}
              ${element.name}${element.required ? `.v` : `V`}alue--;
              ${updateController}
            },
            label: const Padding(
              padding: EdgeInsets.all(8),
              child: Icon(Icons.remove),
            ),
          ),
                `: ''} 
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

function otherFormInputs(e: FormGeneratedModel) {
  if (e.isDropdown) {
    return dropdownFormField(e);
  }
  else {
    return '';
  }
}

export function getFormInputElement({ element }: { element: FormGeneratedModel }): string {

  switch (element.dataType) {
    case 'int':
    case 'String':
    case 'double':
    case 'DateTime':
    case 'TimeOfDay':
      return textFormField(element);
    case 'bool':
      return element.required ? boolFormField(element) : boolNullableFormField(element);

    default:
      return otherFormInputs(element);
  }
}