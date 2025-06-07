const { yesPlease } = require("../");
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

module.exports = function generateClasses(classInfo, genForms, jsonWild) {
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

class ${className} ${indx == 0 && genForms == yesPlease ? ' extends PharmagestAbstractModel' : ''} {
${params.map((parameter) => {
            const paramName = parameter.name
            return `
            ${myClass.mutable ? "" : "final"} ${parameter.dataType} ${paramName};`
        }).join("\n")
            }
     ${className}({
    ${indx == 0 && genForms == yesPlease ? 'required super.id,' : ''}
        ${params.map((parameter) => {
                const reaq = !parameter.required ? '' : 'required'
                return `\t\t${reaq} this.${parameter.name},`
            }).join("\n")
            }
    });

    ${className} copyWith({
        ${params.map((parameter) => {
                const endsWith = parameter.dataType.endsWith("?")
                const dataType = parameter.dataType
                const paramDtype = dataType + (dataType == "dynamic" ? "" : "?")
                return `\t\t${endsWith ? dataType : paramDtype} ${parameter.name}, `;

            }).join("\n")
            }}){
        return ${className}(
        ${indx == 0 && genForms == yesPlease ? 'id: id,' : ''}
        ${params.map((parameter) => `${parameter.name}:${parameter.name} ?? this.${parameter.name},`).join("\n")}
        );
    }
    
    ${indx == 0 && genForms == yesPlease ? '@override' : ''}
    Map<String,Object?> toJson(){
        return <String, Object?>{
            ${params.map((parameter) => {
                var nullSafety = `${!parameter.required ? `if (${parameter.name} != null) ` : ''}`
                return `${nullSafety}${classNameEnum}.${parameter.name}.name: ${parameter.inbuilt ? parameter.name
                    : toJsonForClass(parameter, parameter.className)}`;
            }).join(",\n")

            },
        };
    }

    ${indx == 0 && genForms == yesPlease ? '@override' : ''}
    ${genForms === yesPlease ? `Map<String,Object?> toMap(){
        return <String, Object?>{
            ${params.map((parameter) => {
                var nullSafety = `${!parameter.required ? `if (${parameter.name} != null) ` : ''}`
                return `${nullSafety}${classNameEnum}.${parameter.name}.name: ${parameter.name}${getToMAP(parameter.dataType)}`;
            }).join(",\n")

                },
        };
    }`: ''}

    factory ${className}.fromJson(Map<String , Object?> json){
        return ${className}(
    ${indx == 0 && genForms == yesPlease ? `id: json['id'] as String,` : ''}
            ${params.map((parameter) => {
                    const jsonKey = `json[${myClass.className}Enum.${parameter.name}.name]`;
                    // const inBuilt = `${jsonKey} as ${parameter.dataType}`;
                    return `${parameter.name}:${parameter.inbuilt ? getDartFromJSON(parameter, jsonKey) : `${fromJsonForClass(parameter, myClass.className)}`}`;
                }).join(",\n")},
        );
    }

   ${genForms === yesPlease ? ` factory ${className}.fromMap(Map<String , Object?> json, {String? id}){
        return ${className}(
    ${indx == 0 && genForms == yesPlease ? `id:id?? faker.guid.guid(),` : ''}
            ${params.map((parameter) => {
                    const jsonKey = `json[${myClass.className}Enum.${parameter.name}.name]`;
                    // const inBuilt = `${jsonKey} as ${parameter.dataType}`;
                    return `${parameter.name}: ${jsonKey} as ${parameter.dataType}`;
                }).join(",\n")},
        );
    }`: ''}

    ${genForms === yesPlease ? `factory ${className}.random(){
        return ${className}(
    ${indx == 0 && genForms == yesPlease ? `id: faker.guid.guid(),` : ''}
            ${params.map((parameter) => {
                    return `${parameter.name}: ${getRandomFactory(parameter.value, parameter.name, parameter.dataType, !parameter.required)}`;
                }).join(",\n")},
        );
    }`: ''}

    @override
    String toString(){
        return PowerJSON(toJson()).toText();
    }


    @override
    bool operator ==(Object other){
        return other is ${className} && 
            other.runtimeType == runtimeType &&
            ${params.map((parameter) => `other.${parameter.name} == ${parameter.name}`).join(" &&// \n")};
    }
      
    @override
    int get hashCode {
        return Object.hash(
            runtimeType,
            ${params.length < 20 ? params.map((parameter) => parameter.name).join(", \n") : params.slice(0, 19).map((parameter) => parameter.name).join(", \n")},
        );
    }

${indx == 0 && genForms === yesPlease ? `@override
  List<String> searchFields() {
    return <String>[${[...params].filter(e => e.inbuilt).map(e => `'\$${e.name}'`)},];
  }`: ''}

}



      `
    }).join("\n")
        }
  
     `
}

