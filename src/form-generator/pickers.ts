export function datePicker() {
  return `Future<DateTime?> datePicker(
  BuildContext context,
  String hintText, {
  DateTime? firstDate,
  DateTime? lastDate,
}) async {
  DateTime? pickResult = await showDatePicker(
    firstDate: firstDate ?? DateTime(1970),
    lastDate: lastDate ?? DateTime(2070),
      initialDatePickerMode: DatePickerMode.day,
      context: context,
      helpText: hintText,
      locale: Get.locale,
      initialEntryMode: DatePickerEntryMode.calendar,
      initialDate: DateTime.now(),
    );
    return pickResult;
  }`;
}
export function timePicker() {
  return `Future<TimeOfDay?> timeOfDayPicker(BuildContext context, String hintText) async {
    TimeOfDay? pickResult = await showTimePicker(
      context: context,
      helpText: hintText,
      initialTime: TimeOfDay.now(),
    );
    return pickResult;
  }`;
}
export function datetimePicker() {
  return `Future<DateTime?> datetimePicker(
    BuildContext context,
    String hintText, {
    DateTime? firstDate,
    DateTime? lastDate,
  }) async {
    DateTime? date = await datePicker(context, hintText);
    if (date == null) {
      return null;
    }

    if (!mounted) return null;
    TimeOfDay? time = await timeOfDayPicker(context, hintText);
    if (time == null) return date;

    DateTime finalDateTime = date.copyWith(
      hour: time.hour,
      minute: time.minute,
    );
    return finalDateTime;
  }`;
}