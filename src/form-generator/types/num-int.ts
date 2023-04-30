function generateTheModel(obj: any) {
    var model = Object.keys(obj).map((key) => {
        const variableName = key.replace(/^_/, '');
        const variableValue = obj[key];
        let dataType = getDatatype(variableValue);
        const optional = obj[variableName] === null;
        const nullable = (!optional || dataType === 'dynamic') ? '' : '?';
        const defaultValue = getDefaultValue(variableValue);
        return {
            dartType: `${dataType}${nullable}`,
            required: !optional,
            defaultValue,
            name: variableName,
            iputType: getInputtype(variableValue)
        };
    });
    return model;
}
function _generateForm(json: any) {
    const models = generateTheModel(json);
    return `
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:pharmagest/lib.dart';


class FormPlusGenerated extends HookWidget {
  final GlobalKey<FormState> formKey;

  final DateTime selectedDateTime = DateTime.now();

  FormPlusGenerated({
    Key? key,
    required this.formKey,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ${models.map(e => {
        return `ValueNotifier<${e.dartType}> ${e.name} = useState<${e.dartType}>(${!e.required ? 'null' : e.defaultValue});`;
    }).join('\n')}

    
    var formElements = [
      ${models.map(e => {
        return `
        TextFormField(
        textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
        keyboardType: ${e.iputType},
        validator: (value) {
          if (value!.isEmpty) {
            return kFNullError;
          }
          return null;
        },
        onSaved: (value) {
          prixBR.value = double.tryParse(value!) ?? 0;
          return;
        },
        onChanged: (value) {
          prixBR.value = double.tryParse(value) ?? 0;
          return;
        },
        ${e.required && `initialValue: '${e.defaultValue}',`}
        textInputAction: TextInputAction.next,
      ),
        `;
    }).join('\n')}
    ].map(
      (e) => Padding(
        padding: const EdgeInsets.all(8),
        child: e,
      ),
    );
    return Form(
      key: formKey,
      autovalidateMode: AutovalidateMode.always,
      child: ListView.separated(
        physics: const BouncingScrollPhysics(),
        separatorBuilder: (context, index) {
          return const Padding(
            padding: EdgeInsets.symmetric(horizontal: 12),
          );
        },
        itemCount: formElements.length,
        itemBuilder: (context, index) => formElements.elementAt(index),
      ),
    );
  }
}
    `;
}
function isDate(str: string): boolean {
    const timestamp = Date.parse(str);
    return !isNaN(timestamp);
}
function getDatatype(variableValue: any) {
    let dataType = 'dynamic';
    if (typeof variableValue === 'number') {
        if (Number.isInteger(variableValue)) {
            dataType = 'int';
        } else {
            dataType = 'double';
        }
    }
    // 
    else if (typeof variableValue === 'string') {
        if (isDate(`${variableValue}`)) {
            return 'DateTime';
        }
        dataType = 'String';
    }
    // 
    else if (typeof variableValue === 'boolean') {
        dataType = 'bool';
    }
    return dataType;
}
function getInputtype(variableValue: any) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let dataType = 'dynamic';
    if (typeof variableValue === 'number') {
        return `TextInputType.${dartInputs.number}`;
    }
    // 
    else if (typeof variableValue === 'string') {
        if (isDate(`${variableValue}`)) {
            return `TextInputType.${dartInputs.datetime}`;
        }
        else if (variableValue === '*'.repeat(variableValue.length)) {
            return `TextInputType.${dartInputs.text},
                    obscureText: true,`;
        }
        else if (emailRegex.test(variableValue)) {
            return `TextInputType.${dartInputs.emailAddress}`;
        }
        else if (urlRegex.test(variableValue)) {
            return `TextInputType.${dartInputs.url}`;
        }
        else if (phoneRegex.test(variableValue)) {
            return `TextInputType.${dartInputs.phone}`;
        }
        dataType = `TextInputType.${dartInputs.text}`;
    }
    // 
    else if (typeof variableValue === 'boolean') {
        dataType = 'bool';
    }
    return dataType;
}
function getDefaultValue(variableValue: any) {
    let defaultValue = '';
    if (typeof variableValue === 'number') {
        if (Number.isInteger(variableValue)) {
            defaultValue = '0';
        } else {
            defaultValue = '0.0';
        }
    } else if (typeof variableValue === 'string') {
        defaultValue = '""';
    } else if (typeof variableValue === 'boolean') {
        defaultValue = 'false';
    }
    return defaultValue;
}
const dartInputs = {
    number: 'number',
    text: 'text',
    phone: 'phone',
    datetime: 'datetime',
    emailAddress: 'emailAddress',
    url: 'url',
    //
    multiline: 'multiline',
    visiblePassword: 'visiblePassword',
    name: 'name',
    streetAddress: 'streetAddress',
    none: 'none',
};

// download osm tiles
const json = {
    "nom": "DOLIPRANE",
    "prixBR": 128.33,
    "_code": 12235,
    "_type": "PARACITAMOL",
    "_forme": "Forme1",
    "_posologie": "Posologie de med",
    "_quantiteEnStock": 150,
    "_isInStock": true,
    "_prixPH": "younesmrabti@gmail.com",
    "_ppv": 123.45,
    "princepsGenerique": "Medicament generique",
    "dateTimeExpiration": "2024-12-12T10:30",
    "_dateTimeAchatMedicament": "2020-12-12T11:30:59",
    "password": "***********",
    "_dosage": 125.0,
    "_uniteDose": "mg",
    "_tauxDeRemboursement": 70
};
const dartCode = _generateForm(json);

// copy(dartCode);
