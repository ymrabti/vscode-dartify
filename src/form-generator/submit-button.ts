

export function submitButton(map: string) {
    return `
        ElevatedButton(
        onPressed: () {
          var currentState = formKey.currentState;
          if (currentState == null) return;
          if (currentState.validate()) {
            currentState.save();
            Map<String, dynamic> data = {
                ${map}
            };
            debugPrint('$data');
          }
        },
        child: AbsorbPointer(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
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