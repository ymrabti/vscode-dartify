# Dartify: JSON to Dart (VS Code Extension & Code Generator)
![Image](https://github.com/ymrabti/vscode-dartify/blob/main/assets/dartify_02.jpg)
Welcome to **JSON to Dart (Dartify)**—a powerful VS Code extension and code generator that effortlessly transforms standard JSON objects and arrays into robust Dart data models.

## Features & Capabilities

- **Automated Data Models**: Instantly generate structured Dart classes from JSON.
- **Null Safety Support**: Complete support for Dart's null-safety out of the box.
- **Nested Structures**: Flawlessly handles nested objects and arrays within JSON.
- **De/Serialization Framework**: Includes standard `fromJson` and `toJson` pipelines.
- **Forms Generation**: Produce ready-to-use Flutter Forms (Creation & Edition).
- **Enums & Extensions**: Automatically parse values and generate strongly-typed enums and relative extensions (`enums.dart`, `extensions.dart`).
- **State Management Boilerplate**: Optionally configure output to produce robust View and State classes (`views.dart`, `states.dart`).
- **Standard Overrides**: Overrides `toString`, `operator ==`, and `hashCode` automatically.
- **Object Cloning**: Gives you a powerful `copyWith` method across generated models.
- **Smart Imports**: Automatically locates your `pubspec.yaml` to deduce your active Flutter project name, setting up correct imports seamlessly.
- **Modular vs Monolithic Files**: Supports grouping your Dart constructs in a single file vs modularly separated generated files right from the interactive prompts.

## Usage

1. Open (or create) a Dart file where you want to insert the data models.
2. Select or copy your JSON content to the clipboard.
3. Bring up the Command Palette using `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and search for **"DARTIFY"**. Alternatively, hit **`Ctrl+Shift+Alt+T`**.
4. You will be prompted to enter the desired root **class name** (defaults to `DartifyGeneratedCode`).
5. Choose whether to automatically generate Flutter Forms.
6. Choose whether to group results in separate modular files or keep them in one file.

## Examples

### Input JSON

```json
{
    "name": "praveenD",
    "age": "22",
    "isAdmin": true,
    "order_ids": [1, 2, 3, 4, 9, 7]
}
```

### Result Dart generated implementation

```dart
class User {
  final String? name;
  final String? age;
  final bool? isAdmin;
  final List<int>? orderIds;

  const User({
    required this.name,
    required this.age,
    required this.isAdmin,
    required this.orderIds
  });

  User copyWith({
    String? name,
    String? age,
    bool? isAdmin,
    List<int>? orderIds
  }) {
    return User(
      name: name ?? this.name,
      age: age ?? this.age,
      isAdmin: isAdmin ?? this.isAdmin,
      orderIds: orderIds ?? this.orderIds
    );
  }

  Map<String, Object?> toJson() {
    return {
      'name': name,
      'age': age,
      'isAdmin': isAdmin,
      'order_ids': orderIds
    };
  }

  factory User.fromJson(Map<String, Object?> json) {
    return User(
      name: json['name'] == null ? "" : json['name'] as String,
      age: json['age'] == null ? "" : json['age'] as String,
      isAdmin: json['isAdmin'] == null ? false : json['isAdmin'] as bool,
      orderIds: json['order_ids'] == null ? [] : json['order_ids'] as List<int>
    );
  }

  @override
  String toString() {
    return '''User(
      name:$name,
      age:$age,
      isAdmin:$isAdmin,
      orderIds:$orderIds
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is User &&
      other.runtimeType == runtimeType &&
      other.name == name &&
      other.age == age &&
      other.isAdmin == isAdmin &&
      other.orderIds == orderIds;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, name, age, isAdmin, orderIds);
  }
}
```

## Shortcuts
- Trigger code generation effortlessly via **`Ctrl+Shift+Alt+T`**.

Enjoy an automated boilerplate developer experience!
