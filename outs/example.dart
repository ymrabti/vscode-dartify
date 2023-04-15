class DartifyGeneratedCode {
  final String name;
  final int age;
  final double float;
  final List<int> chaines;
  final bool isAdmin;
  final Alpha alpha;
  final Alpha order;
  final List<Alpha> commands;
  const DartifyGeneratedCode({required this.name, required this.age, required this.float, required this.chaines, required this.isAdmin, required this.alpha, required this.order, required this.commands});

  DartifyGeneratedCode copyWith({String? name, int? age, double? float, List<int>? chaines, bool? isAdmin, Alpha? alpha, Alpha? order, List<Alpha>? commands}) {
    return DartifyGeneratedCode(name: name ?? this.name, age: age ?? this.age, float: float ?? this.float, chaines: chaines ?? this.chaines, isAdmin: isAdmin ?? this.isAdmin, alpha: alpha ?? this.alpha, order: order ?? this.order, commands: commands ?? this.commands);
  }

  Map<String, Object?> toJson() {
    return {'name': name, 'age': age, 'float': float, 'chaines': chaines, 'isAdmin': isAdmin, 'alpha': alpha.toJson(), 'order': order.toJson(), 'commands': commands.map<Map<String, dynamic>>((data) => data.toJson()).toList()};
  }

  static DartifyGeneratedCode fromJson(Map<String, Object?> json) {
    return DartifyGeneratedCode(
        name: json['name'] == null ? "" : json['name'] as String,
        age: json['age'] == null ? 0 : json['age'] as int,
        float: json['float'] == null ? 0.0 : json['float'] as double,
        chaines: json['chaines'] == null ? [] : json['chaines'] as List<int>,
        isAdmin: json['isAdmin'] == null ? false : json['isAdmin'] as bool,
        alpha: json['alpha'] == null ? Alpha.fromJson({}) : Alpha.fromJson(json['alpha'] as Map<String, Object?>),
        order: json['order'] == null ? Alpha.fromJson({}) : Alpha.fromJson(json['order'] as Map<String, Object?>),
        commands: json['commands'] == null ? [] : (json['commands'] as List).map<Alpha>((data) => Alpha.fromJson(data as Map<String, Object?>)).toList());
  }

  @override
  String toString() {
    return '''DartifyGeneratedCode(
                name:$name,
age:$age,
float:$float,
chaines:$chaines,
isAdmin:$isAdmin,
alpha:${alpha.toString()},
order:${order.toString()},
commands:${commands.toString()}
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is DartifyGeneratedCode && other.runtimeType == runtimeType && other.name == name && other.age == age && other.float == float && other.chaines == chaines && other.isAdmin == isAdmin && other.alpha == alpha && other.order == order && other.commands == commands;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, name, age, float, chaines, isAdmin, alpha, order, commands);
  }
}

class Alpha {
  final int orderId;
  final String productName;
  final double productPrice;
  const Alpha({required this.orderId, required this.productName, required this.productPrice});

  Alpha copyWith({int? orderId, String? productName, double? productPrice}) {
    return Alpha(orderId: orderId ?? this.orderId, productName: productName ?? this.productName, productPrice: productPrice ?? this.productPrice);
  }

  Map<String, Object?> toJson() {
    return {'order_id': orderId, 'product_name': productName, 'product_price': productPrice};
  }

  static Alpha fromJson(Map<String, Object?> json) {
    return Alpha(orderId: json['order_id'] == null ? 0 : json['order_id'] as int, productName: json['product_name'] == null ? "" : json['product_name'] as String, productPrice: json['product_price'] == null ? 0.0 : json['product_price'] as double);
  }

  @override
  String toString() {
    return '''Alpha(
                orderId:$orderId,
productName:$productName,
productPrice:$productPrice
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is Alpha && other.runtimeType == runtimeType && other.orderId == orderId && other.productName == productName && other.productPrice == productPrice;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, orderId, productName, productPrice);
  }
}
