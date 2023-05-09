import { writeFile } from 'fs';
import { generateTheModel } from './model';
import * as exampleData from './example.json';
import { getFormInputElement } from './form-fields';

function _generateForm(json: any) {
  const models = generateTheModel(json);
  return `
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';


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
  }).join('/n')}

    
    var formElements = [
      ${models.map(e => {
    return getFormInputElement({ element: e });
  }).join('/n')}
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
