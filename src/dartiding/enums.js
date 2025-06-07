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
    checkType,
    getDartFromJSON,
    getToMAP,
    listRegExp,
} = require("../functions");

module.exports = function generateEnums(classInfo, genForms, jsonWild) {
    return `
import "package:flutter/material.dart";
import 'package:flutter/foundation.dart' show listEquals;
import "package:pharmagest/lib.dart";
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
    
    ${classInfo.class.map((myClass, indx) => {
        const className = myClass.className
        const classNameEnum = `${className}Enum`
        const params = myClass.parameters
        return `



enum ${classNameEnum}{
    ${params.map((parameter) => {
                    const paramName = parameter.name
                    return `${paramName},`
                }).join("\n")
            }
    none,
}

      `
    }).join("\n")
        }
  
     `
}

