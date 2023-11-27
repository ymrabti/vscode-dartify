

export function submitButton(map: string,mapValues: string) {
    return `
        ElevatedButton(
        onPressed: () {
          var currentState = formKey.currentState;
          if (currentState == null) return;
          if (currentState.validate()) {
            currentState.save();
            ${mapValues}
            Map<String, dynamic> data = {
                ${map}
            };
            debugPrint('$data');
          }
        },
        child: const AbsorbPointer(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Submit'),
              Padding(
                padding: EdgeInsets.all(12),
                child: Icon(Icons.telegram),
              ),
            ],
          ),
        ),
      ),
        `;
}