const { yesPlease } = require(".");
const { isDate, isTimeOfDay, isInteger } = require("./functions");

const listRegExp = RegExp(/^List<[a-zA-Z]+[\?]{0,1}>[\?]{0,1}$/);
module.exports = function generateClass(classInfo, genForms, jsonWild) {
    return `
    ${genForms === yesPlease ? `
import "package:flutter/material.dart";
import "package:flutter_form_builder/flutter_form_builder.dart";
import "package:gap/gap.dart";
import "dart:async";
import "package:flutter_hooks/flutter_hooks.dart" hide Store;
import "package:pharmagest/lib.dart";
import "package:power_geojson/power_geojson.dart";
`: ''}
    
/*    
    ${jsonWild}
*/
    ${classInfo.class.map((myClass, indx) => {
        const className = myClass.className
        const classNameEnum = `${className}Enum`
        const params = myClass.parameters
        return `

class ${className} ${indx == 0 ? ' extends PharmagestAbstractModel' : ''} {
${params.map((parameter) => {
            const paramName = parameter.name
            return `
            ${myClass.mutable ? "" : "final"} ${parameter.dataType} ${paramName};`
        }).join("\n")
            }
    ${myClass.mutable ? "" : "const"} ${className}({
    ${indx == 0 ? 'required super.id,' : ''}
        ${params.map((parameter) => {
                const reaq = !parameter.required ? '' : 'required'
                return `\t\t${reaq} this.${parameter.name},`
            }).join("\n")
            }
});

    ${className} copyWith({
        ${params.map((parameter) => {
                const endsWith = parameter.dataType.endsWith("?")
                const dataType = parameter.dataType
                const paramDtype = dataType + (dataType == "dynamic" ? "" : "?")
                return `\t\t${endsWith ? dataType : paramDtype} ${parameter.name}, `;

            }).join("\n")
            }}){
    return ${className}(
    ${indx == 0 ? 'id: id,' : ''}
    ${params.map((parameter) => `${parameter.name}:${parameter.name} ?? this.${parameter.name},`).join("\n")}
    );
    }
        
    Map<String,Object?> toJson(){
        return {
            ${params.map((parameter) => `${classNameEnum}.${parameter.name}.name: ${parameter.inbuilt ? parameter.name : toJsonForClass(parameter)}`).join(",\n")

            },};
}

factory ${className}.fromJson(Map<String , Object?> json){
    return ${className}(
    ${indx == 0 ? `id: json['id'] as String,` : ''}
            ${params.map((parameter) => {
                const jsonKey = `json[${myClass.className}Enum.${parameter.name}.name]`;
                // const inBuilt = `${jsonKey} as ${parameter.dataType}`;
                return `${parameter.name}:${parameter.inbuilt ? getDartFromJSON(parameter, jsonKey) : `${fromJsonForClass(parameter, myClass.className)}`}`;
            }).join(",\n")},
    );
}
@override
String toString(){
    return PowerJSON(toJson()).toText();
}


String stringify(){
    return '${className}(${params.map((parameter) => `${parameter.name}:${parameter.inbuilt ? `$${parameter.name}` : `\${${parameter.name}.toString()\}`}`).join(", ")})';
}

@override
bool operator ==(Object other){
    return other is ${className} && 
        other.runtimeType == runtimeType &&
        ${params.map((parameter) => `other.${parameter.name} == ${parameter.name}`).join(" &&// \n")};
}
      
@override
int get hashCode {
    return Object.hash(
                runtimeType,
                ${params.length < 20 ? params.map((parameter) => parameter.name).join(", \n") : params.slice(0, 19).map((parameter) => parameter.name).join(", \n")},
    );
}
    
}

enum ${classNameEnum}{
    ${params.map((parameter) => {
                const paramName = parameter.name
                return `${paramName},`
            }).join("\n")
            }
    none,
}


class ${className}_Views {
final ${className} model;

${className}_Views({required this.model});


${genForms === yesPlease ? `
static  final  List<Widget> formElements = [
  ${params.map((parameter) => {
                const paramName = parameter.name
                return `${parameter.entryClass}(
        name: ${classNameEnum}.${paramName}.name ,
        hintText: 'tr \${${classNameEnum}.${paramName}.name}' ,
        labelText: 'tr \${${classNameEnum}.${paramName}.name}' ,
        formEdition: null,
        codeMatch: false,
        optional: ${!parameter.required},
        ),`
            }).join("\n")
                }
];
static Widget formCreation(GlobalKey formBuilderKey, {Map<String, Object?> initialValue = const {}}){
    return FormBuilder(
      key: formBuilderKey,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      initialValue: initialValue,
      child: ListView.separated(
        physics: NeverScrollableScrollPhysics(),
        separatorBuilder: (context, index) => Gap(getPropHeight(30)),
        itemBuilder: (context, index) => formElements.elementAt(index),
        itemCount: formElements.length,
        shrinkWrap: true,
      ),
    );
}
Widget formEdition({required FutureOr<bool> Function(${className} data) submit}){
    return ${className}FormEdition(
      initial: model,
      submit: submit,
    );
}
`: ''}

}

${genForms === yesPlease ? `

class ${className}FormEdition extends StatefulHookWidget {
  const ${className}FormEdition({
    Key? key,
    required this.initial,
    required this.submit,
}) : super(key: key);
  final ${className} initial;
  final FutureOr<bool> Function(${className} data) submit;
  @override
  State<StatefulWidget> createState() {
    return _${className}FormEditionState();
  }
}
class _${className}FormEditionState extends State<${className}FormEdition>{
final GlobalKey<FormBuilderState> formKey = GlobalKey<FormBuilderState>();
  @override
  Widget build(BuildContext context) {

  final ValueNotifier<PhormState> phormState = useState(PhormState.none);

  final ValueNotifier<${classNameEnum}> codeEdit = useState(${classNameEnum}.none);
    final ValueNotifier<bool> changed = useState(false);
    return FormBuilder(
        key: formKey,
        initialValue: widget.initial.toJson(),
        autovalidateMode: AutovalidateMode.onUserInteraction,
        onChanged: () {
          try {
            ${className} change = ${className}.fromJson(formKey.currentState?.instantValue as Map<String, Object?>);
            changed.value = change != widget.initial;
          } catch (e) {
            changed.value = true;
            phormState.value = PhormState.error;
          }
        },
        onWillPop: () async {
          return !changed.value;
        },
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10.0),
              child: Text /** TV **/ (
                translate(AppTranslation.accesRapide),
                textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                locale: Get.locale,
                style: TextStyle(
                  fontSize: getPropWidth(20),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            ...[
                ${params.map((parameter) => {
                    const paramName = parameter.name
                    return `Builder(builder: (context) {
                ${classNameEnum} fieldCode = ${classNameEnum}.${paramName};
                bool codeMatch = codeEdit.value == fieldCode;
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      paddingDivider(),
                      ${parameter.entryClass}(
                        name: fieldCode.name ,
                    hintText: 'tr \${${classNameEnum}.${paramName}.name}' ,
                    labelText: 'tr \${${classNameEnum}.${paramName}.name}' ,
                    optional: ${!parameter.required},
                        formEdition: GestureDetector(
                          child: Icon(
                            codeMatch ? Icons.check : CupertinoIcons.pencil_circle,
                            color: primaryColor,
                          ),
                          onTap: () {
                            formKey.currentState?.save();
                            codeMatch ? ${classNameEnum}.none : fieldCode;
                          },
                        ),
                        codeMatch: codeMatch,
                      ),
                    ],
                ),
                );
              }),`
                }).join("\n")
                }
            ],
            Padding(
              padding: const EdgeInsets.all(14.0),
              child: Visibility(
                visible: phormState.value == PhormState.error,
                child: labelRichText(
                  required: false,
                  text: translate(AppTranslation.erreurValidationFormule),
                  textStyle: TextStyle(
                    color: Colors.red,
                    fontSize: getPropWidth(25),
                  ),
                ),
              ),
            ),
            Visibility(
              visible: changed.value,
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  children: [
                    ElevatedButton(
                      onPressed: () async{
                        if (formKey.currentState?.validate() ?? false) {
                          formKey.currentState?.save();
                          phormState.value = PhormState.valide;
                          ${className} formValue = ${className}.fromJson(formKey.currentState?.instantValue as Map<String, Object?>);
                          bool result = await widget.submit(formValue);
                          if (result) {
                            phormState.value = PhormState.valide;
                            changed.value = false;
                          } else {
                            phormState.value = PhormState.error;
                          }
                        } else {
                          phormState.value = PhormState.error;
                        }
                      },
                      child: Row(
                        children: [
                          Text /** TV **/ (
                            translate(AppTranslation.valider),
                            textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                            locale: Get.locale,
                          ),
                          Gap(10),
                          Icon(
                            CupertinoIcons.checkmark_alt_circle,
                            color: primaryColor.shade300,
                          ),
                        ],
                      ),
                    ),
                    Expanded(child: const SizedBox()),
                    TextButton(
                      onPressed: () {
                        formKey.currentState?.reset();
                        changed.value = false;
                      },
                      child: Text /** TV **/ (
                        translate(AppTranslation.cancel),
                        textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                        locale: Get.locale,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
  }

}
`: ''}
extension ${className}Sort on List<${className}>{
    List<${className}> sorty(${classNameEnum} caseField, {bool desc = false}){
      return this
      ..sort((a, b) {
        int fact = (desc? -1 : 1);
        switch (caseField) {
          
          ${params.filter(e => e.inbuilt).map((parameter) => {
                    const paramName = parameter.name
                    return `case ${classNameEnum}.${paramName}:
            // ${parameter.sortable ? 'sortable' : 'unsortable'}
            
            ${parameter.sort != "" ? `
            ${parameter.dataType} akey = a.${parameter.name};
            ${parameter.dataType} bkey = b.${parameter.name};
            ${parameter.sort}
            ` : ''}
            `
                }).join("\n")
            }
          ${params.filter(e => !e.inbuilt).map((parameter) => {
                const paramName = parameter.name
                return `case ${classNameEnum}.${paramName}:
            // ${parameter.sortable ? 'sortable' : 'unsortable'}
            `
            }).join("\n")
            }
            case ${classNameEnum}.none:
            return 0;
        }
      });
  }
}
      `
    }).join("\n")
        }
  
     `
}



function removeQuestion(str) {
    if (str.endsWith("?")) {
        return str.substring(0, str.length - 1)
    }
    return str;
}

function toJsonForClass(parameter) {
    if (listRegExp.test(parameter.dataType)) {
        var optional = !parameter.required ? `?` : '';
        var param = parameter.name;
        return `${param}${optional}.map<Map<String,dynamic>>((data)=> data.toJson()).toList()`
    } else if (`${parameter.dataType}`.endsWith("?")) {
        var paranam = `${parameter.name}`;
        return `${paranam}?.toJson()`
    }
    return `${parameter.name}.toJson()`
}
function fromJsonForClass(parameter, className) {
    const asmap = ' as Map<String,Object?>';
    const jsonKey = `json[${classNameEnum}.${parameter.name}.name]`;
    const pfj = `${parameter.className}.fromJson`;
    const pl = `(${jsonKey} as List).map<${parameter.className}>((data)=> ${pfj}(data ${asmap})).toList()`;
    const isOptDataType = isOptionalDataType(parameter.dataType)
    const checkedType = checkType(parameter.dataType)
    if (listRegExp.test(parameter.dataType)) {
        return isOptDataType ? `${jsonKey} == null ? ${checkedType} :${pl}` : pl
    }
    return isOptDataType ? `${jsonKey} == null ? ${checkedType} : ${pfj}(${jsonKey} ${asmap})` : `${pfj}(${jsonKey} ${asmap})`
}


function isOptionalDataType(dataType) {
    return dataType.endsWith("?")
}
function checkType(variable) {
    if (variable === 'int') {
        return '0';
    }
    if (variable === 'double') {
        return '0.0';
    }
    if (variable === 'String') {
        return '""';
    }
    if (listRegExp.test(variable)) {
        return '[]';
    }
    if (variable === 'bool') {
        return 'false';
    }
    if (['int?', 'double?', 'String?', 'bool?'].includes(variable)) {
        return 'null';
    }
    else {
        return `${removeQuestion(variable)}.fromJson({})`;
    }
}


function getDartFromJSON(p, key) {
    switch (typeof (p.value)) {
        case "string":
            if (isDate(p.value)) {
                return !p.required ? `DateTime.tryParse('\${${key}}')` : `DateTime.parse('\${${key}}')`;
            }
            else if (isTimeOfDay(p.value)) {
                return !p.required ? `(DateTime${p.required ? '' : '?'} date){
            if(date!==null){
                    return TimeOfDay.fromDateTime(date);
                }
                    return null;
            }(DateTime.tryParse('\${${key}}'))` : `TimeOfDay.fromDateTime(DateTime.parse('\${${key}}'))`;
            }
            return `${key} as String${p.required ? '' : '?'}`;
        case "number":
            if (isInteger(p.value)) {
                return !p.required ? `int.tryParse('\${${key}}')` : `int.parse('\${${key}}')`;
            }
            return !p.required ? `double.tryParse('\${${key}}')` : `double.parse('\${${key}}')`;
        case "boolean":
            return `${key} as bool${p.required ? '' : '?'}`;
        case "object":
            if (Array.isArray(p.value)) {
                return `(${key} as List<Object?>).map(
                (el)=> ${getDartFromJSON({
                    value: p.value[0],
                    required: p.required,
                }, 'el')}
                ).toList()`
            }

            return key
        default:
            return key
    }
}
