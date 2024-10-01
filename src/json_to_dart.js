const { yesPlease } = require(".");
const { isDate,
    isTimeOfDay,
    isInteger,
    getRandomIntInclusive,
    isValidEmail,
    isValidURL,
    getRandomFactory,
    listRegExp
} = require("./functions");

module.exports = function generateClass(classInfo, genForms, jsonWild) {
    return `
import 'package:flutter/foundation.dart' show listEquals;
import "package:pharmagest/lib.dart";
import "package:flutter/material.dart";
import "package:faker/faker.dart";
import "package:power_geojson/power_geojson.dart";
${genForms === yesPlease ? `
import "package:collection/collection.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:flutter_form_builder/flutter_form_builder.dart";
import "package:gap/gap.dart";
import "dart:async";
import "package:form_plus/form_plus.dart";
`: ''}
    
/*    
${JSON.stringify(typeof jsonWild == 'string' ? JSON.parse(jsonWild) : jsonWild, (key, value) => value, 4)}
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
     ${className}({
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
    
    ${indx == 0 ? '@override' : ''}
    Map<String,Object?> toJson(){
        return {
            ${params.map((parameter) => {
                var nullSafety = `${!parameter.required ? `if (${parameter.name} != null) ` : ''}`
                return `${nullSafety}${classNameEnum}.${parameter.name}.name: ${parameter.inbuilt ? parameter.name : toJsonForClass(parameter)}`;
            }).join(",\n")

            },
        };
    }

    ${indx == 0 ? '@override' : ''}
    Map<String,Object?> toMap(){
        return {
            ${params.map((parameter) => {
                var nullSafety = `${!parameter.required ? `if (${parameter.name} != null) ` : ''}`
                return `${nullSafety}${classNameEnum}.${parameter.name}.name: ${parameter.name}${getToMAP(parameter.dataType)}`;
            }).join(",\n")

            },
        };
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

    factory ${className}.fromMap(Map<String , Object?> json){
        return ${className}(
    ${indx == 0 ? `id: faker.guid.guid(),` : ''}
            ${params.map((parameter) => {
                const jsonKey = `json[${myClass.className}Enum.${parameter.name}.name]`;
                // const inBuilt = `${jsonKey} as ${parameter.dataType}`;
                return `${parameter.name}: ${jsonKey} as ${parameter.dataType}`;
            }).join(",\n")},
        );
    }

    factory ${className}.random(){
        return ${className}(
    ${indx == 0 ? `id: faker.guid.guid(),` : ''}
            ${params.map((parameter) => {
                return `${parameter.name}: ${getRandomFactory(parameter.value, parameter.name, parameter.dataType, !parameter.required)}`;
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





class ScreenState${className} extends PharmagestAbstractClass<${className}> {
  ScreenState${className}({
    required super.listItems,
    required super.sortFieldEnum,
    required super.sortDescending,
  });

  @override
  ScreenState${className} copyWith({
    bool? sortDescending,
    String? sortFieldEnum,
    List<${className}>? listItems,
  }) {
    return ScreenState${className}(
      listItems: listItems ?? this.listItems,
      sortDescending: sortDescending ?? this.sortDescending,
      sortFieldEnum: sortFieldEnum ?? this.sortFieldEnum,
    );
  }

  static Future<ScreenState${className}> initState() async {
    String sortField = ${className}Enum.${params[0].name}.name;
    bool sortDescend = false;
    final List<${className}> listItems = List<${className}>.generate(
    25,
      (e)=>${className}.random(),
    ).sorty(
      sortField,
      desc: sortDescend,
    );
    return ScreenState${className}(
      listItems: listItems,
      sortDescending: sortDescend,
      sortFieldEnum: sortField,
    );
  }

  static ScreenState${className} emptyState() => ScreenState${className}(
        listItems: List.empty(),
        sortDescending: false,
        sortFieldEnum: ${classNameEnum}.dateCreation.name,
      );
      
  @override
  bool operator ==(covariant ScreenState${className} other) {
    if (identical(this, other)) return true;
    return listEquals(other.listItems, listItems) && other.sortDescending == sortDescending && other.selectionMode == selectionMode && other.sortFieldEnum == sortFieldEnum;
  }

  @override
  int get hashCode {
    return listItems.hashCode ^ sortDescending.hashCode ^ selectionMode.hashCode ^ sortFieldEnum.hashCode;
  }

  @override
  List<${className}> sorty(
    String caseField, {
    bool desc = false,
  }) {
    return listItems.sorty(caseField, desc: desc);
  }
}

ScreenState${className} reducerScreenClass${className}(ScreenState${className} state, Object action,) {
  var reducer = PharmagestAbstractReducer<${className}>().reducer(state, action);
  return reducer as ScreenState${className};
}






enum ${classNameEnum}{
    ${params.map((parameter) => {
                const paramName = parameter.name
                return `${paramName},`
            }).join("\n")
            }
    none,
}


extension ${classNameEnum}X on ${classNameEnum}{
    String get labelTranslation{
    switch(this){
    ${params.map((parameter) => {
                const paramName = parameter.name
                return `case ${classNameEnum}.${paramName}:
        
        return translate(AppTranslation.${paramName});`
            }).join("\n")

            }
            default:
        return name;
            }
    }
    String get hintTranslation{
    switch(this){
    ${params.map((parameter) => {
                const paramName = parameter.name
                return `case ${classNameEnum}.${paramName}:
        
        return translate(AppTranslation.${paramName});`
            }).join("\n")

            }
            default:
        return name;
            }
    }
}


class ${className}_Views {
final ${className} model;

${className}_Views({required this.model});


${genForms === yesPlease ? `
static Widget formCreation({required FutureOr<bool> Function(${className} data) submit, Map<String, Object?> initial = const {},}){
    return ${className}FormCreation(
      initial: initial,
      submit: submit,
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

class ${className}FormCreation extends StatefulWidget {
  const ${className}FormCreation({
    Key? key,
    this.initial = const {},
    required this.submit,
}) : super(key: key);
  final Map<String, Object?> initial;
  final FutureOr<bool> Function(${className} data) submit;
  @override
  State<StatefulWidget> createState() {
    return _${className}FormCreationState();
  }
}
class _${className}FormCreationState extends State<${className}FormCreation>{
final GlobalKey<FormBuilderState> formKey = GlobalKey<FormBuilderState>();
final _formElements = [
${params.map((parameter) => {
                const paramName = parameter.name
                return `${parameter.entryClass}(
                    name: ${classNameEnum}.${paramName}.name ,
                    ${parameter.additional}
      hintText: ${classNameEnum}.${paramName}.hintTranslation ,
      label: ${classNameEnum}.${paramName}.labelTranslation ,
      optional: ${!parameter.required},
      ),`
            }).join("\n")
                }
];


  final ScrollController _scrollController = ScrollController();
  @override
  Widget build(BuildContext context) {
    List<Widget> items = [
        Gap(12.h),
        ..._formElements,
    ];
    return AppBarBuilderUI(
      reversed: true,
      scrollController: _scrollController,
      appBarContent: (context, opacity, offset) => Padding(
        padding: EdgeInsets.symmetric(vertical: 8.0.h),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text /** TV **/ (
              translate(AppTranslation.quickAcces),
              textAlign: TextAlign.center,
              textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
              locale: Get.locale,
              style: TextStyle(
                fontSize: getPropWidth(20),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
      builder: (context, opacity, offset) => FormBuilder(
        key: formKey,
        initialValue: widget.initial,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        onChanged: () {
        },
        onWillPop: () async {
          return !(formKey.currentState?.isDirty ?? false);
        },
        child: ReusableCustomScrollView(
          scrollController: _scrollController,
        fixedBottom: Padding(
            padding:  EdgeInsets.all(8.0.sp),
            child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
            TextButton(
                onPressed: () {
                formKey.currentState?.reset();
                Get.back();
                },
                child: Text /** TV **/ (
                translate(AppTranslation.cancel),
                textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                locale: Get.locale,
                ),
            ),
            ElevatedButton(/* FormCreation */
                onPressed: () async{
                if (formKey.currentState?.validate() ?? false) {
                    formKey.currentState?.save();
                    ${className} formValue = ${className}.fromMap(formKey.currentState?.instantValue as Map<String, Object?>);
                    bool result = await widget.submit(formValue);
                    logg(result);
                } 
                },
                  style: ButtonStyle(
                    backgroundColor: MaterialStatePropertyAll(primaryColor),
                    foregroundColor: MaterialStatePropertyAll(primaryColor.shade50),
                  ),
                child: Row(
                children: [
                    Text /** TV **/ (
                    translate(AppTranslation.valider),
                    textScaleFactor: 1.2,
                    textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                    locale: Get.locale,
                    ),
                    Gap(10),
                    Gap(10.sp),
                    Icon(CupertinoIcons.checkmark_alt_circle),
                ],
                ),
            ),
        ],
        ),
          ),
        children: items
              .mapIndexed(
                (i, e) => Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8.0.w, vertical: i == 0 ? 24.h : 8.h),
                  child: e,
                ),
              )
              .toList()
              .reversed
              .toList(),
        ),
      ),
    );
  }

}
`: ''}

${genForms === yesPlease ? `

class ${className}FormEdition extends StatefulWidget {
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


  final ScrollController _scrollController = ScrollController();
  @override
  Widget build(BuildContext context) {
  final List<Widget> editionFormElements = [
                ${params.map((parameter) => {
                    const paramName = parameter.name
                    return `${parameter.entryClass}(
                        name: ${classNameEnum}.${paramName}.name ,
                        ${parameter.additional}
                    hintText: ${classNameEnum}.${paramName}.hintTranslation ,
                    label: ${classNameEnum}.${paramName}.labelTranslation ,
                    optional: ${!parameter.required},
                        formEdition: true,
                      ),`
                }).join("\n")
                }
            formKey.showErrors,
            ];

    return AppBarBuilderUI(
      reversed: true,
      scrollController: _scrollController,
      appBarContent: (context, opacity, offset) => Padding(
        padding: EdgeInsets.symmetric(vertical: 8.0.h),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
              children: [
              Text /** TV **/ (
                translate(AppTranslation.quickAcces),
                textAlign: TextAlign.center,
                textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                locale: Get.locale,
                style: TextStyle(
                  fontSize: getPropWidth(20),
                  fontWeight: FontWeight.bold,
                ),
               ),
          ],
        ),
      ),
      builder: (context, opacity, offset) => Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8.0.w),
                  child: FormBuilder(
        key: formKey,
        initialValue: widget.initial.toMap(),
        autovalidateMode: AutovalidateMode.onUserInteraction,
        onChanged: () {
          try {
            // ${className} change = ${className}.fromMap(formKey.currentState?.instantValue as Map<String, Object?>);
            // change d.value = change != widget.initial;
          } catch (e) {
            // chang ed.value = true;
          }
        },
        onWillPop: () async {
              return !formKey.touched;
        },
        child: ReusableCustomScrollView(
          scrollController: _scrollController,
          fixedBottom: Padding(
                padding: EdgeInsets.all(8.0.sp),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () {
                        formKey.currentState?.reset();
                      },
                      child: Text /** TV **/ (
                        translate(AppTranslation.cancel),
                        textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                        locale: Get.locale,
                      ),
                    ),
                    ElevatedButton(
                    onPressed: !formKey.touched?null:
                    () async {
                        if (formKey.currentState?.validate() ?? false) {
                          formKey.currentState?.save();
                          ${className} formValue = ${className}.fromMap(formKey.currentState?.instantValue as Map<String, Object?>);
                          bool result = await widget.submit(formValue);
                          if (result) {
                          } else {
                          }
                        } else {
                        }
                      },
                        style: ButtonStyle(
                            backgroundColor: MaterialStatePropertyAll(formKey.formplusColorValue),
                            foregroundColor: MaterialStatePropertyAll(primaryColor.shade50),
                        ),
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
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          children: editionFormElements
              .joinByBuilder(
                (i) => Gap(i == 0 ? 30.h : 15.h),
              )
              .toList()
              .reversed
              .toList(),
        ),
      ),
                ),
    );
  }

}
`: ''}
extension ${className}Sort on List<${className}>{
    List<${className}> sorty(String caseField, {bool desc = false}){
      return this
      ..sort((a, b) {
        int fact = (desc? -1 : 1);
        
          
          ${params.filter(e => e.inbuilt).map((parameter) => {
                    const paramName = parameter.name
                    return `if(caseField== ${classNameEnum}.${paramName}.name){
            // ${parameter.sortable ? 'sortable' : 'unsortable'}
            
            ${parameter.sort != "" ? `
            ${parameter.dataType} akey = a.${parameter.name};
            ${parameter.dataType} bkey = b.${parameter.name};
            ${parameter.sort}
          }` : ''}
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
            return 0;
        
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
        return 'List.empty';
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

function getToMAP(dataType) {
    switch (dataType) {
        case "int":
        case "int?":
            return `.toString()`;
        case "TimeOfDay":
        case "TimeOfDay?":
            return `.toDateTime()`;

        case "double":
        case "double?":
            return `.toStringAsFixed(2)`;

        default:
            return ''
    }
}
