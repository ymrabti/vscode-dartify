const { yesPlease } = require("..");
const { isDate,
  isTimeOfDay,
  isInteger,
  getRandomIntInclusive,
  isValidEmail,
  isValidURL,
  getRandomFactory,
  removeQuestion,
  toJsonForClass,
  fromJsonForClass,
  isOptionalDataType,
  getDartFromJSON,
  getToMAP,
  listRegExp,
} = require("../functions");

module.exports = function generateViews({ classInfo, genForms, jsonWild, basename, projectName, useSeparate }) {
  return `
import "package:flutter/material.dart";
import 'package:flutter/foundation.dart' show listEquals;
import "package:${projectName}/lib.dart";
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

${useSeparate ? `import "${basename}.enums.dart";` : ''}
${useSeparate ? `import "${basename}.classes.dart";` : ''}

    ${classInfo.class.map((myClass, indx) => {
    const className = myClass.className
    const classNameEnum = `${className}Enum`
    const params = [...myClass.parameters].sort((a, b) => b.name.length - a.name.length);
    return `


${genForms === yesPlease ? `class ${className}_Views {
final ${className} model;

${className}_Views({required this.model});



    static Widget formCreation({Map<String, Object?> initial = const {}}) {
        return StoreBuilder<AppState>(
        builder: (context, store) {
            return ${className}FormCreation(
            initial: initial,
            submit: (${className} data) {
                store.dispatch(PharmAction_Abstr_ChangeList(items: [data], add: true));
                return true;
            },
            );
        },
        );
    }


    Widget formEdition() {
        return StoreBuilder<AppState>(
        builder: (context, store) {
            return ${className}FormEdition(
            initial: model,
            submit: (data) {
                store.dispatch(PharmAction_Abstr_Update(item: data));
                return true;
            },
            );
        },
        );
    }

}`: ''}


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
final List<Widget> _formElements = [
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
    return Scaffold(
    body:AppBarBuilderUI(
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
          return !formKey.dirty;
        },
        child: ReusableCustomScrollView(
          scrollController: _scrollController,
        fixedBottom: Padding(
            padding:  EdgeInsets.all(8.0.sp),
            child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
            TextButton(
                onPressed: () => formKey.resetAndBack(),
                child: Text /** TV **/ (
                translate(AppTranslation.cancel),
                textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                locale: Get.locale,
                ),
            ),
            ElevatedButton(/* FormCreation */
                onPressed: () async{
                if (formKey.validateSave()) {
                    ${className} formValue = ${className}.fromMap(formKey.instantValue);
                    bool result = await widget.submit(formValue);
                    if (result) {
                        Get.back();
                      } 
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
        children: _formElements
              .mapIndexed(
                (i, e) => Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8.0.w, vertical: i == 0 ? 140.h : 8.h),
                  child: e,
                ),
              )
              .toList()
              .reversed
              .toList(),
        ),
      ),
    ),);
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

    return Scaffold(
    body:AppBarBuilderUI(
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
            // ${className} change = ${className}.from Map(formKey.instantValue);
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
                onPressed: () => formKey.resetAndBack(),
                      child: Text /** TV **/ (
                        translate(AppTranslation.cancel),
                        textDirection: isArabic() ? TextDirection.rtl : TextDirection.ltr,
                        locale: Get.locale,
                      ),
                    ),
                    ElevatedButton(
                    onPressed: !formKey.touched?null:
                    () async {
                        if (formKey.validateSave()) {
                          ${className} formValue = ${className}.fromMap(formKey.instantValue,
                                  id: widget.initial.id,
                                );
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
    ),);
  }

}
`: ''}

      `
  }).join("\n")
    }
  
     `
}

