# json to dart (Dartify)

Welcome to json to dart (Dartify), yet another code generator for data-classes.

## Motivation

- *convert json to dart data model*

- define a constructor + the properties
- Immutable and Mutable data types
- handling de/serialization
- Flutter forms(creation/Edition)
- implement a copyWith method to clone the object
- override toString, operator ==, hashCode

## Usage

- create data model dart file
- paste json
- run the command  "Dartify" or "ctrl+shift+alt+t"alt+ (keyboard shortcut)
- Enter a class name by default is DartifyGeneratedCode

## Command to execute is

### ((ctrl or cmd) + shift + p) or F1  then enter "DARTIFY" Or "ctrl + shift + alt + t"

**_NOTE:_**  key board shortcut is "ctrl+shift+alt+t"

## Examples

### Example 1

```json
{
    "name":"praveenD",
    "age":"22",
    "isAdmin":true,
    "order_ids":[1,2,3,4,9,7]
}
```

### Result (user.dart)

```dart
class User {
  final String? name;
  final String? age;
  final bool? isAdmin;
  final List<int>? orderIds;
  const User({required this.name, required this.age, required this.isAdmin, required this.orderIds});

  User copyWith({String? name, String? age, bool? isAdmin, List<int>? orderIds}) {
    return User(name: name ?? this.name, age: age ?? this.age, isAdmin: isAdmin ?? this.isAdmin, orderIds: orderIds ?? this.orderIds);
  }

  Map<String, Object?> toJson() {
    return {'name': name, 'age': age, 'isAdmin': isAdmin, 'order_ids': orderIds};
  }

  factory User.fromJson(Map<String, Object?> json) {
    return User(name: json['name'] == null ? "" : json['name'] as String, age: json['age'] == null ? "" : json['age'] as String, isAdmin: json['isAdmin'] == null ? false : json['isAdmin'] as bool, orderIds: json['order_ids'] == null ? [] : json['order_ids'] as List<int>);
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
    return other is User && other.runtimeType == runtimeType && other.name == name && other.age == age && other.isAdmin == isAdmin && other.orderIds == orderIds;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, name, age, isAdmin, orderIds);
  }
}

```

### Example 2

```json
{
    "name":"praveen",
    "age":22,
    "isAdmin":true,
    "order":{
        "order_id":233,
        "product_name":"productNAME",
        "product_price":233.4
    }
}
```

### Result Page (product.dart)

```dart
class Product {
  final String? name;
  final int? age;
  final bool? isAdmin;
  final Order? order;
  const Product({required this.name, required this.age, required this.isAdmin, required this.order});

  Product copyWith({String? name, int? age, bool? isAdmin, Order? order}) {
    return Product(name: name ?? this.name, age: age ?? this.age, isAdmin: isAdmin ?? this.isAdmin, order: order ?? this.order);
  }

  Map<String, Object?> toJson() {
    return {'name': name, 'age': age, 'isAdmin': isAdmin, 'order': order == null ? '' : order!.toJson()};
  }

  factory Product.fromJson(Map<String, Object?> json) {
    return Product(name: json['name'] == null ? "" : json['name'] as String, age: json['age'] == null ? 0 : json['age'] as int, isAdmin: json['isAdmin'] == null ? false : json['isAdmin'] as bool, order: json['order'] == null ? null : Order.fromJson(json['order'] as Map<String, Object?>));
  }

  @override
  String toString() {
    return '''Product(
    name:$name,
    age:$age,
    isAdmin:$isAdmin,
    order:${order.toString()}
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is Product && other.runtimeType == runtimeType && other.name == name && other.age == age && other.isAdmin == isAdmin && other.order == order;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, name, age, isAdmin, order);
  }
}

class Order {
  final int? orderId;
  final String? productName;
  final double? productPrice;
  const Order({required this.orderId, required this.productName, required this.productPrice});

  Order copyWith({int? orderId, String? productName, double? productPrice}) {
    return Order(orderId: orderId ?? this.orderId, productName: productName ?? this.productName, productPrice: productPrice ?? this.productPrice);
  }

  Map<String, Object?> toJson() {
    return {'order_id': orderId, 'product_name': productName, 'product_price': productPrice};
  }

  factory Order.fromJson(Map<String, Object?> json) {
    return Order(orderId: json['order_id'] == null ? 0 : json['order_id'] as int, productName: json['product_name'] == null ? "" : json['product_name'] as String, productPrice: json['product_price'] == null ? 0.0 : json['product_price'] as double);
  }

  @override
  String toString() {
    return '''Order(
                orderId:$orderId,
productName:$productName,
productPrice:$productPrice
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is Order && other.runtimeType == runtimeType && other.orderId == orderId && other.productName == productName && other.productPrice == productPrice;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, orderId, productName, productPrice);
  }
}

```
