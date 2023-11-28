import { writeFile } from 'fs';
import { FormGeneratedModel, generateTheModel } from './model';
import * as exampleData from './example.json';
import { submitButton } from './submit-button';
import { getFormInputElement } from './input-fields';
import { enumerable } from './enums';
import { datePicker, datetimePicker, timePicker } from './pickers';
import { resolve } from 'path';

function toMap(e: FormGeneratedModel): string {
  const value = `${e.name}Value`;
  if (e.dartType === 'DateTime') {
    return `${value}.toStringFormat()`;
  }
  else if (e.dartType === 'DateTime?') {
    return `${value} == null ? null : ${value}.toStringFormat()`;
  }
  else if (e.dartType === 'TimeOfDay?') { return `${value}?.format(context)`; }
  else if (e.dartType === 'TimeOfDay') { return `${value}.format(context)`; }
  else if (e.isDropdown) {
    return `${!e.required ? `${value} == null ? null : ` : ''}${value}.label`;
  }
  else { return value; }
}


function generateMapData(models: FormGeneratedModel[]): string {
  return models.map(e => `'${e.name}': ${toMap(e)}, // ${e.dartType}`).join('\n');
}

function _generateForm(json: any) {
  const models = generateTheModel(json).sort((a, b) => {
    var aa = a.required ? 1 : 0;
    var bb = b.required ? 1 : 0;
    return bb - aa;
  });
  const timeElms = models.filter(e => ['TimeOfDay', 'TimeOfDay[]', 'DateTime', 'DateTime[]'].includes(e.dartType)).length;
  const dateElms = models.filter(e => ['DateTime', 'DateTime[]'].includes(e.dartType)).length;
  return `
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

extension DateTimeX on DateTime {
  bool get isDateOnly {
    return hour == 0 && minute == 0 && millisecond == 0 && microsecond == 0;
  }

  bool get isTimeOnly {
    return year == 0 && month == 0 && day == 0;
  }

  String toStringFormat() {
    return DateFormat(isDateOnly ? 'yyyy-MMMM-dddd' : (isTimeOnly ? 'Hm' : 'yyyy-MMMM-dddd')).format(this);
  }
}

${timeElms !== 0 ? timePicker() : ''}
${dateElms !== 0 ? datePicker() : ''}

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
${models.filter(e => e.isDropdown).map(e => enumerable(e.value, e.name)).join('')}
class FormPlusGenerated extends StatefulHookWidget {
  const FormPlusGenerated({super.key});

  @override
  State<StatefulWidget> createState() => _FormPlusGeneratedState();
}

class _FormPlusGeneratedState extends State<StatefulWidget> {
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  ${models.map(e => {
    return `final TextEditingController ${e.name}TextController = TextEditingController();`;
  }).join('\n')}

  ${models.filter(e => !e.isPureDate).length !== 0 ? datetimePicker() : ''}


  @override
  Widget build(BuildContext context) {
    ${models.map(e => {
    return `ValueNotifier<${e.dartType}> ${e.name} = useState<${e.dartType}>(${!e.required ? 'null' : e.defaultValue});`;
  }).join('\n')}

    
    List<Widget> formElements = [
      ${models.map(e => {
    return getFormInputElement({ element: e });
  }).join('\n')}
  ${submitButton(generateMapData(models), models.map(e => `${e.dartType} ${e.name}Value = ${e.name}.value;`).join('\n'))}
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
const ppath = 'C:/Users/USER/Coding/Flutter/my-apps/pharmagest/lib/espace_personel/components/auth_screens/screen_signup/';
writeFile(ppath + 'components/test-forms.dart',
  dartCode, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Data has been written to file');
  }
);


// copy(dartCode);
