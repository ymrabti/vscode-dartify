import { writeFile } from 'fs';
import { FormGeneratedModel, generateTheModel } from './model';
import * as exampleData from './example.json';
import { submitButton } from './submit-button';
import { getFormInputElement } from './input-fields';
import { enumerable } from './enums';
function generateMapData(models: FormGeneratedModel[]): string {
  return models.map(e => `'${e.name}': ${e.name}.value,`).join('\n');

}
function _generateForm(json: any) {
  const models = generateTheModel(json).sort((a, b) => {
    var aa = a.required ? 1 : 0;
    var bb = b.required ? 1 : 0;
    return bb - aa;
  });
  return `
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';


Widget labelRichText({required bool required, required String text, required BuildContext context, TextStyle? textStyle}) {
  return RichText(
    locale: Get.locale,
    text: TextSpan(
      locale: Get.locale,
      text: text,
      style: textStyle ?? Theme.of(context).textTheme.titleLarge,
      children: [
        if (required)
          TextSpan(
            locale: Get.locale,
            text: '*',
            style: const TextStyle(
              color: Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 24,
            ),
          ),
        
      ],
    ),
    textScaleFactor: 1,
    maxLines: null,
    strutStyle: const StrutStyle(fontWeight: FontWeight.bold),
    overflow: TextOverflow.fade,
  );
}
${models.filter(e => e.isList).map(e => enumerable(e.value, e.name)).join('')}
class FormPlusGenerated extends HookWidget {
  final GlobalKey<FormState> formKey;


  const FormPlusGenerated({
    Key? key,
    required this.formKey,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ${models.map(e => {
    return `ValueNotifier<${e.dartType}> ${e.name} = useState<${e.dartType}>(${!e.required ? 'null' : e.defaultValue});`;
  }).join('\n')}

    
    List<Widget> formElements = [
      ${models.map(e => {
    return getFormInputElement({ element: e });
  }).join('\n')}
  ${submitButton(generateMapData(models))}
    ].map(
      (e) => Padding(
        padding: const EdgeInsets.all(8),
        child: e,
      ),
    ).toList();
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

const dartCode = _generateForm(exampleData);
writeFile('C:/Users/dell3/Documents/Documents$4/Driving Code App/lib/automated.dart',
  dartCode, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Data has been written to file');
  }
);


// copy(dartCode);
