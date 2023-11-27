import { FormGeneratedModel } from "./model";

export function timeOnTap(element: FormGeneratedModel) {
    return `
        /* Time Selection */
        TimeOfDay? time = await timeOfDayPicker(context, '${element.name}');
        ${element.required ? 'if (time == null) return;' : `if (${element.name}.value != null && time == null) return;`}
        ${element.name}.value = time;
        if (!mounted) return;
        ${element.required ? '' : 'if (time == null) return;'}
        ${element.name}TextController.text = time.format(context);
    `;
}
export function dateOnTap(element: FormGeneratedModel) {
    return `
        /* Date Selection */
        DateTime? date = await datePicker(context, '${element.name}');
        ${element.required ? 'if (date == null) return;' : `if (${element.name}.value != null && date == null) return;`}
        ${element.name}.value = date;
        ${element.required ? '' : 'if (date == null) return;'}
        ${element.name}TextController.text = DateFormat.yMEd().format(date);
    `;
}
export function datetimeOnTap(element: FormGeneratedModel) {
    return `
        /* DateTime Selection */
          DateTime? date = await datetimePicker(context, '${element.name}');
          if (date == null) return;
          ${element.name}.value = date;
          var time = !date.isDateOnly ? ' \${DateFormat.Hm().format(date)}' : '';
          dateTimeExpirationTextController.text = '\${DateFormat.yMEd().format(date)}$time';
    `;
}
export function getOnTap(element: FormGeneratedModel) {
    switch (element.dartType) {
        case 'TimeOfDay':
        case 'TimeOfDay?':
            return timeOnTap(element);

        case 'DateTime':
        case 'DateTime?':
            return element.isPureDate ? dateOnTap(element) : datetimeOnTap(element);

        default:
            return '';
    }
}
export function onTap(element: FormGeneratedModel) {
    return ['TimeOfDay', 'TimeOfDay?', 'DateTime', 'DateTime?'].includes(element.dartType) ? `
    readOnly: true,
    onTap: () async {
        ${getOnTap(element)}
    },`: '';
}

// 00330 51886 94813 AAOEM
// 283B1