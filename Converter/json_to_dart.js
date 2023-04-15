require("vscode")
module.exports = function generateClass(classInfo) {
    return `${classInfo.class.map((myClass) => {
        const className = myClass.className
        return `
class ${className} {
    ${myClass.parameters.map((parameter) => {
            return `${myClass.mutable ? "" : "final"} ${parameter.dataType} ${parameter.name};`
        }).join("\n")
            }
    ${myClass.mutable ? "" : "const"} ${className}({${myClass.parameters.map((parameter) => `required this.${parameter.name}`).join(", ")
            }});

    ${className} copyWith({
        ${myClass.parameters.map((parameter) => {
                const endsWith = parameter.dataType.endsWith("?")
                const paramDtype = parameter.dataType + "?"
                return `${endsWith ? parameter.dataType : paramDtype} ${parameter.name}`;

            }).join(", ")
            }}){
    return ${className}(
            ${myClass.parameters.map((parameter) => `${parameter.name}:${parameter.name} ?? this.${parameter.name}`).join(",\n")
            });
    }
        
    Map<String,Object?> toJson(){
        return {
            ${myClass.parameters.map((parameter) => `'${parameter.parameterName}': ${parameter.inbuilt ? parameter.name : toJsonForClass(parameter)}`).join(",\n")

            }};
}

static ${className} fromJson(Map<String , Object?> json){
    return ${className}(
            ${myClass.parameters.map((parameter) => {
                return `${parameter.name}:${parameter.inbuilt ? isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameter(parameter) : nullDataType(parameter) : parameter.isDefault ? defaultValueParameter(parameter) : notOptionalDataType(parameter) : `${fromJsonForClass(parameter)}`}`;
            }).join(",\n")}
    );
}

@override
String toString(){
    return '''${className}(
                ${myClass.parameters.map((parameter) => `${parameter.name}:${parameter.inbuilt ? `$${parameter.name}` : `\${${parameter.name}.toString()\}`}`).join(",\n")}
    ) ''';
}

@override
bool operator ==(Object other){
    return other is ${className} && 
        other.runtimeType == runtimeType &&
        ${myClass.parameters.map((parameter) => `other.${parameter.name} == ${parameter.name}`).join(" && \n")};
}
      
@override
int get hashCode {
    return Object.hash(
                runtimeType,
                ${myClass.parameters.length < 20 ? myClass.parameters.map((parameter) => parameter.name).join(", \n") : myClass.parameters.slice(0, 19).map((parameter) => parameter.name).join(", \n")}
    );
}
    
}
      
      `
    }).join("\n")
        }
  
     `
}



function removeQuestion(str) {
    if (str.endsWith("?")) {
        return str.substring(0, str.length - 1)
    }
    return str;
}

function toJsonForClass(parameter) {
    if (parameter.dataType.startsWith("List")) {
        return `${parameter.name}.map<Map<String,dynamic>>((data)=> data.toJson()).toList()`
    } else if (parameter.dataType.startsWith("Map")) {
        var paranam = `${parameter.name}['${parameter.parameterName}']`;
        return `${paranam} == null? '':${paranam}.toJson()`
    }
    return `${parameter.name}.toJson()`
}
function fromJsonForClass(parameter) {
    if (parameter.dataType.startsWith("List")) {
        return isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameterForClassDataTypeList(parameter) : `json['${parameter.parameterName}'] == null ? ${checkType(parameter.dataType)} :(json['${parameter.name}'] as List).map<${parameter.className}>((data)=> ${parameter.className}.fromJson(data  as Map<String,Object?>)).toList()` : parameter.isDefault ? defaultValueParameterForClassDataTypeList(parameter) : `(json['${parameter.name}'] as List).map<${parameter.className}>((data)=> ${parameter.className}.fromJson(data as Map<String,Object?>)).toList()`
    }
    return isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameterForClassDataTypeDynamic(parameter) : `json['${parameter.parameterName}'] == null ? ${checkType(parameter.dataType)} : ${parameter.className}.fromJson(json['${parameter.parameterName}']  as Map<String,Object?>)` : parameter.isDefault ? defaultValueParameterForClassDataTypeDynamic(parameter) : `${parameter.className}.fromJson(json['${parameter.name}']  as Map<String,Object?>)`
}
function defaultValueParameter(parameter) {
    return `json['${parameter.parameterName}'] == null ? ${checkType(parameter.dataType)} : json['${parameter.parameterName}'] as ${removeQuestion(parameter.dataType)}`
}
function defaultValueParameterForClassDataTypeList(parameter) {
    return `json['${parameter.parameterName}'] == null ? ${checkType(parameter.dataType)} : json['${parameter.parameterName}'].map<${parameter.className}>((data)=> (${parameter.className} as List).fromJson(data  as Map<String,Object?>)).toList()`
}

function defaultValueParameterForClassDataTypeDynamic(parameter) {
    return `json['${parameter.parameterName}'] == null ? ${checkType(parameter.dataType)} : ${parameter.className}.fromJson(json['${parameter.parameterName}'])`
}
function notOptionalDataType(parameter) {
    return `json['${parameter.parameterName}'] as ${removeQuestion(parameter.dataType)}`
}
function nullDataType(parameter) {
    return `json['${parameter.parameterName}'] == null ? ${checkType(parameter.dataType)} : json['${parameter.parameterName}'] as ${removeQuestion(parameter.dataType)}`
}

function isOptionalDataType(dataType) {
    console.log(dataType);
    // return dataType.endsWith("?")
    return true
}
function checkType(variable) {
    var regExp = RegExp(/^List<[a-zA-Z]+[\?]{0,1}>[\?]{0,1}$/);
    if (variable === 'int') {
        return '0';
    }
    if (variable === 'double') {
        return '0.0';
    }
    if (variable === 'String') {
        return '""';
    }
    if (regExp.test(variable)) {
        return '[]';
    }
    if (variable === 'bool') {
        return 'false';
    }
    else {
        return `${variable}.fromJson({})`;
    }
}
