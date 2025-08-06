const { yesPlease } = require("..");
const { isDate,
  isTimeOfDay,
  isInteger,
  getRandomIntInclusive,
  isValidEmail,
  isValidURL,
  getRandomFactory,
  removeQuestion,
  toJsonForClass,
  fromJsonForClass,
  isOptionalDataType,
  getDartFromJSON,
  getToMAP,
  listRegExp,
} = require("../functions");

module.exports = function generateStates({ classInfo, genForms, jsonWild, basename, projectName, useSeparate }) {
  return `
import "package:flutter/material.dart";
import 'package:flutter/foundation.dart' show listEquals;
import "package:${projectName}/lib.dart";
import "package:faker/faker.dart";
import "package:power_geojson/power_geojson.dart";
${genForms === yesPlease ? `
import "package:collection/collection.dart";
import "package:flutter_screenutil/flutter_screenutil.dart";
import "package:flutter_form_builder/flutter_form_builder.dart";
import "package:gap/gap.dart";
import "dart:async";
import "package:form_plus/form_plus.dart";
`: ''}
${useSeparate ? `import "${basename}.enums.dart";` : ''}
${useSeparate ? `import "${basename}.classes.dart";` : ''}
   
    ${classInfo.class.map((myClass, indx) => {
    const className = myClass.className
    const classNameEnum = `${className}Enum`
    const params = [...myClass.parameters].sort((a, b) => b.name.length - a.name.length);
    return `

${genForms === yesPlease ? `
class ScreenState${className} extends PharmagestAbstractClass<${className}> {
  ScreenState${className}({
    required super.listItems,
    required super.sortFieldEnum,
    required super.sortDescending,
  });

  @override
  ScreenState${className} copyWith({
    bool? sortDescending,
    String? sortFieldEnum,
    List<${className}>? listItems,
  }) {
    return ScreenState${className}(
      listItems: listItems ?? this.listItems,
      sortDescending: sortDescending ?? this.sortDescending,
      sortFieldEnum: sortFieldEnum ?? this.sortFieldEnum,
    );
  }

  static Future<ScreenState${className}> initState() async {
    String sortField = ${className}Enum.${params[0].name}.name;
    bool sortDescend = false;
    final List<${className}> listItems = List<${className}>.generate(
    25,
      (e)=>${className}.random(),
    ).sorty(
      sortField,
      desc: sortDescend,
    );
    return ScreenState${className}(
      listItems: listItems,
      sortDescending: sortDescend,
      sortFieldEnum: sortField,
    );
  }

  static ScreenState${className} emptyState() => ScreenState${className}(
        listItems: List.empty(),
        sortDescending: false,
        sortFieldEnum: ${classNameEnum}.${[...params].map(e => e.name)[0]}.name,
      );
      
  @override
  bool operator ==(covariant ScreenState${className} other) {
    if (identical(this, other)) return true;
    return listEquals(other.listItems, listItems) && other.sortDescending == sortDescending && other.selectionMode == selectionMode && other.sortFieldEnum == sortFieldEnum;
  }

  @override
  int get hashCode {
    return listItems.hashCode ^ sortDescending.hashCode ^ selectionMode.hashCode ^ sortFieldEnum.hashCode;
  }

  @override
  List<${className}> sorty(
    String caseField, {
    bool desc = false,
  }) {
    return listItems.sorty(caseField, desc: desc);
  }
}

ScreenState${className} reducerScreenClass${className}(ScreenState${className} state, Object action,) {
  var reducer = PharmagestAbstractReducer<${className}>().reducer(state, action);
  return reducer as ScreenState${className};
}

`: ''}


      `
  }).join("\n")
    }
  
     `
}

