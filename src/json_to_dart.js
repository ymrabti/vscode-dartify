const { yesPlease } = require(".");

const listRegExp = RegExp(/^List<[a-zA-Z]+[\?]{0,1}>[\?]{0,1}$/);
module.exports = function generateClass(classInfo, genForms) {
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
    
    ${classInfo.class.map((myClass) => {
        const className = myClass.className
        const params = myClass.parameters
        return `
enum ${className}Enum{
    ${params.map((parameter) => {
            const paramName = parameter.name
            return `${paramName},`
        }).join("\n")
            }
    none,
}
class ${className} {
${params.map((parameter) => {
                const paramName = parameter.name
                return `
            ${myClass.mutable ? "" : "final"} ${parameter.dataType} ${paramName};`
            }).join("\n")
            }
    ${myClass.mutable ? "" : "const"} ${className}({
        ${params.map((parameter) => {
                const reaq = !parameter.required ? '' : 'required'
                return `\t\t${reaq} this.${parameter.name},`
            }).join("\n")
            }});

    ${className} copyWith({
        ${params.map((parameter) => {
                const endsWith = parameter.dataType.endsWith("?")
                const dataType = parameter.dataType
                const paramDtype = dataType + (dataType == "dynamic" ? "" : "?")
                return `\t\t${endsWith ? dataType : paramDtype} ${parameter.name}, `;

            }).join("\n")
            }}){
    return ${className}(${params.map((parameter) => `${parameter.name}:${parameter.name} ?? this.${parameter.name},`).join("\n")});
    }
        
    Map<String,Object?> toJson(){
        return {
            ${params.map((parameter) => `${className}Enum.${parameter.name}.name: ${parameter.inbuilt ? parameter.name : toJsonForClass(parameter)}`).join(",\n")

            },};
}

${genForms === yesPlease ? `
static  final  List<Widget> formElements = [
  ${params.map((parameter) => {
                const paramName = parameter.name
                const option = !parameter.required ? ',optional: true' : '';
                return `EPWTemplateFormField(name: ${className}Enum.${paramName}.name ${option}),`
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
      initial: this,
      submit: submit,
    );
}
`: ''}

factory ${className}.fromJson(Map<String , Object?> json){
    return ${className}(
            ${params.map((parameter) => {
                    const jsonKey = `json[${myClass.className}Enum.${parameter.name}.name]`;
                    const inBuilt = `${jsonKey} ${!parameter.required ? `==''?null:${jsonKey}` : ''} ${`as ${parameter.dataType}`}`;
                    return `${parameter.name}:${parameter.inbuilt ? inBuilt : `${fromJsonForClass(parameter, myClass.className)}`}`;
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
        ${params.map((parameter) => `other.${parameter.name} == ${parameter.name}`).join(" && \n")};
}
      
@override
int get hashCode {
    return Object.hash(
                runtimeType,
                ${params.length < 20 ? params.map((parameter) => parameter.name).join(", \n") : params.slice(0, 19).map((parameter) => parameter.name).join(", \n")},
    );
}
    
}
extension ${className}Sort on List<${className}>{
    List<${className}> sort(${className}Enum caseField, {bool desc = false}){
      return this
      ..sort((a, b) {
        int fact = (desc? -1 : 1);
        switch (caseField) {
          
          ${params.map((parameter) => {
                    const paramName = parameter.name
                    return `case ${className}Enum.${paramName}:
            // ${parameter.sortable ? 'sortable' : 'unsortable'}
            ${parameter.dataType} akey = a.${parameter.name};
            ${parameter.dataType} bkey = b.${parameter.name};
            ${!parameter.required ? `if (akey == null) return fact;` : ''}
            ${parameter.sort}
            `
                }).join("\n")
            }
          default:
            return 0;
        }
      });
  }
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

  final ValueNotifier<${className}Enum> codeEdit = useState(${className}Enum.none);
    final ValueNotifier<bool> changed = useState(false);
    return StoreBuilder(builder: (BuildContext context, Store<AppState> store) {
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
                const option = !parameter.required ? ',optional: true' : '';
                return `Builder(builder: (context) {
                ${className}Enum fieldCode = ${className}Enum.${paramName};
                bool codeMatch = codeEdit.value == fieldCode;
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      paddingDivider(),
                      EPWTemplateFormField(name: fieldCode.name ${option},
                        formEdition: GestureDetector(
                          child: Icon(
                            codeMatch ? Icons.check : CupertinoIcons.pencil_circle,
                            color: primaryColor,
                          ),
                          onTap: () {
                            formKey.currentState?.save();
                            codeMatch ? ${className}Enum.none : fieldCode;
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
    });
  }

}
`: ''}
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
    const jsonKey = `json[${className}Enum.${parameter.name}.name]`;
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

