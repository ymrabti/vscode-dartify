enum ABCXEnum {
  gender,
  title,
  first,
  last,
  number,
  name,
  latitude,
  longitude,
  offset,
  city,
  state,
  country,
  postcode,
  uuid,
  username,
  password,
  salt,
  md5,
  sha1,
  sha256,
  age,
  date,
  value,
  large,
  medium,
  thumbnail,
  description,
  email,
  phone,
  cell,
  nat,
  none,
}

class ABCX {
  final String gender;

  final String title;

  final String first;

  final String last;

  final int? number;

  final String name;

  final String latitude;

  final String longitude;

  final String offset;

  final String city;

  final String? state;

  final String country;

  final int postcode;

  final String uuid;

  final String username;

  final String password;

  final String salt;

  final String? md5;

  final String sha1;

  final String? sha256;

  final int age;

  final String? date;

  final String value;

  final String large;

  final String? medium;

  final String thumbnail;

  final String description;

  final String email;

  final String phone;

  final String? cell;

  final String nat;
  const ABCX({
    required this.gender,
    required this.title,
    required this.first,
    required this.last,
    this.number,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.offset,
    required this.city,
    this.state,
    required this.country,
    required this.postcode,
    required this.uuid,
    required this.username,
    required this.password,
    required this.salt,
    this.md5,
    required this.sha1,
    this.sha256,
    required this.age,
    this.date,
    required this.value,
    required this.large,
    this.medium,
    required this.thumbnail,
    required this.description,
    required this.email,
    required this.phone,
    this.cell,
    required this.nat,
  });

  ABCX copyWith({
    String? gender,
    String? title,
    String? first,
    String? last,
    int? number,
    String? name,
    String? latitude,
    String? longitude,
    String? offset,
    String? city,
    String? state,
    String? country,
    int? postcode,
    String? uuid,
    String? username,
    String? password,
    String? salt,
    String? md5,
    String? sha1,
    String? sha256,
    int? age,
    String? date,
    String? value,
    String? large,
    String? medium,
    String? thumbnail,
    String? description,
    String? email,
    String? phone,
    String? cell,
    String? nat,
  }) {
    return ABCX(
      gender: gender ?? this.gender,
      title: title ?? this.title,
      first: first ?? this.first,
      last: last ?? this.last,
      number: number ?? this.number,
      name: name ?? this.name,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      offset: offset ?? this.offset,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      postcode: postcode ?? this.postcode,
      uuid: uuid ?? this.uuid,
      username: username ?? this.username,
      password: password ?? this.password,
      salt: salt ?? this.salt,
      md5: md5 ?? this.md5,
      sha1: sha1 ?? this.sha1,
      sha256: sha256 ?? this.sha256,
      age: age ?? this.age,
      date: date ?? this.date,
      value: value ?? this.value,
      large: large ?? this.large,
      medium: medium ?? this.medium,
      thumbnail: thumbnail ?? this.thumbnail,
      description: description ?? this.description,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      cell: cell ?? this.cell,
      nat: nat ?? this.nat,
    );
  }

  Map<String, Object?> toJson() {
    return {
      ABCXEnum.gender.name: gender,
      ABCXEnum.title.name: title,
      ABCXEnum.first.name: first,
      ABCXEnum.last.name: last,
      ABCXEnum.number.name: number,
      ABCXEnum.name.name: name,
      ABCXEnum.latitude.name: latitude,
      ABCXEnum.longitude.name: longitude,
      ABCXEnum.offset.name: offset,
      ABCXEnum.city.name: city,
      ABCXEnum.state.name: state,
      ABCXEnum.country.name: country,
      ABCXEnum.postcode.name: postcode,
      ABCXEnum.uuid.name: uuid,
      ABCXEnum.username.name: username,
      ABCXEnum.password.name: password,
      ABCXEnum.salt.name: salt,
      ABCXEnum.md5.name: md5,
      ABCXEnum.sha1.name: sha1,
      ABCXEnum.sha256.name: sha256,
      ABCXEnum.age.name: age,
      ABCXEnum.date.name: date,
      ABCXEnum.value.name: value,
      ABCXEnum.large.name: large,
      ABCXEnum.medium.name: medium,
      ABCXEnum.thumbnail.name: thumbnail,
      ABCXEnum.description.name: description,
      ABCXEnum.email.name: email,
      ABCXEnum.phone.name: phone,
      ABCXEnum.cell.name: cell,
      ABCXEnum.nat.name: nat,
    };
  }

  factory ABCX.fromJson(Map<String, Object?> json) {
    return ABCX(
      gender: json[ABCXEnum.gender.name] as String,
      title: json[ABCXEnum.title.name] as String,
      first: json[ABCXEnum.first.name] as String,
      last: json[ABCXEnum.last.name] as String,
      number: json[ABCXEnum.number.name] as int?,
      name: json[ABCXEnum.name.name] as String,
      latitude: json[ABCXEnum.latitude.name] as String,
      longitude: json[ABCXEnum.longitude.name] as String,
      offset: json[ABCXEnum.offset.name] as String,
      city: json[ABCXEnum.city.name] as String,
      state: json[ABCXEnum.state.name] as String?,
      country: json[ABCXEnum.country.name] as String,
      postcode: json[ABCXEnum.postcode.name] as int,
      uuid: json[ABCXEnum.uuid.name] as String,
      username: json[ABCXEnum.username.name] as String,
      password: json[ABCXEnum.password.name] as String,
      salt: json[ABCXEnum.salt.name] as String,
      md5: json[ABCXEnum.md5.name] as String?,
      sha1: json[ABCXEnum.sha1.name] as String,
      sha256: json[ABCXEnum.sha256.name] as String?,
      age: json[ABCXEnum.age.name] as int,
      date: json[ABCXEnum.date.name] as String?,
      value: json[ABCXEnum.value.name] as String,
      large: json[ABCXEnum.large.name] as String,
      medium: json[ABCXEnum.medium.name] as String?,
      thumbnail: json[ABCXEnum.thumbnail.name] as String,
      description: json[ABCXEnum.description.name] as String,
      email: json[ABCXEnum.email.name] as String,
      phone: json[ABCXEnum.phone.name] as String,
      cell: json[ABCXEnum.cell.name] as String?,
      nat: json[ABCXEnum.nat.name] as String,
    );
  }

/* String stringify(){
    return CanonicJSON(toJson()).toText();
} */

  @override
  String toString() {
    return 'ABCX(gender:$gender, title:$title, first:$first, last:$last, number:$number, name:$name, latitude:$latitude, longitude:$longitude, offset:$offset, city:$city, state:$state, country:$country, postcode:$postcode, uuid:$uuid, username:$username, password:$password, salt:$salt, md5:$md5, sha1:$sha1, sha256:$sha256, age:$age, date:$date, value:$value, large:$large, medium:$medium, thumbnail:$thumbnail, description:$description, email:$email, phone:$phone, cell:$cell, nat:$nat)';
  }

  @override
  bool operator ==(Object other) {
    return other is ABCX &&
        other.runtimeType == runtimeType &&
        other.gender == gender &&
        other.title == title &&
        other.first == first &&
        other.last == last &&
        other.number == number &&
        other.name == name &&
        other.latitude == latitude &&
        other.longitude == longitude &&
        other.offset == offset &&
        other.city == city &&
        other.state == state &&
        other.country == country &&
        other.postcode == postcode &&
        other.uuid == uuid &&
        other.username == username &&
        other.password == password &&
        other.salt == salt &&
        other.md5 == md5 &&
        other.sha1 == sha1 &&
        other.sha256 == sha256 &&
        other.age == age &&
        other.date == date &&
        other.value == value &&
        other.large == large &&
        other.medium == medium &&
        other.thumbnail == thumbnail &&
        other.description == description &&
        other.email == email &&
        other.phone == phone &&
        other.cell == cell &&
        other.nat == nat;
  }

  @override
  int get hashCode {
    return Object.hash(
      runtimeType,
      gender,
      title,
      first,
      last,
      number,
      name,
      latitude,
      longitude,
      offset,
      city,
      state,
      country,
      postcode,
      uuid,
      username,
      password,
      salt,
      md5,
      sha1,
    );
  }
}
