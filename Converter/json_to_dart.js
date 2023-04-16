require("vscode")
module.exports = function generateClass(classInfo) {
    return `${classInfo.class.map((myClass) => {
        const className = myClass.className
        return `
class ${className} {
    ${myClass.parameters.map((parameter) => {
            return `${myClass.mutable ? "" : "final"} ${parameter.dataType} ${removeUnderscore(parameter.name)};`
        }).join("\n")
            }
    ${myClass.mutable ? "" : "const"} ${className}({${myClass.parameters.map((parameter) => `required this.${removeUnderscore(parameter.name)}`).join(", ")
            },});

    ${className} copyWith({
        ${myClass.parameters.map((parameter) => {
                const endsWith = parameter.dataType.endsWith("?")
                const paramDtype = parameter.dataType + "?"
                return `${endsWith ? parameter.dataType : paramDtype} ${removeUnderscore(parameter.name)}`;

            }).join(", ")
            },}){
    return ${className}(
            ${myClass.parameters.map((parameter) => `${removeUnderscore(parameter.name)}:${removeUnderscore(parameter.name)} ?? this.${removeUnderscore(parameter.name)}`).join(",\n")
            },);
    }
        
    Map<String,Object?> toJson(){
        return {
            ${myClass.parameters.map((parameter) => `'${removeUnderscore(parameter.parameterName)}': ${parameter.inbuilt ? removeUnderscore(parameter.name) : toJsonForClass(parameter)}`).join(",\n")

            },};
}

static ${className} fromJson(Map<String , Object?> json){
    return ${className}(
            ${myClass.parameters.map((parameter) => {
                return `${removeUnderscore(parameter.name)}:${parameter.inbuilt ? isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameter(parameter) : nullDataType(parameter) : parameter.isDefault ? defaultValueParameter(parameter) : notOptionalDataType(parameter) : `${fromJsonForClass(parameter)}`}`;
            }).join(",\n")},
    );
}

@override
String toString(){
    return '${className}(${myClass.parameters.map((parameter) => `${removeUnderscore(parameter.name)}:${parameter.inbuilt ? `$${removeUnderscore(parameter.name)}` : `\${${removeUnderscore(parameter.name)}.toString()\}`}`).join(", ")})';
}

@override
bool operator ==(Object other){
    return other is ${className} && 
        other.runtimeType == runtimeType &&
        ${myClass.parameters.map((parameter) => `other.${removeUnderscore(parameter.name)} == ${removeUnderscore(parameter.name)}`).join(" && \n")};
}
      
@override
int get hashCode {
    return Object.hash(
                runtimeType,
                ${myClass.parameters.length < 20 ? myClass.parameters.map((parameter) => removeUnderscore(parameter.name)).join(", \n") : myClass.parameters.slice(0, 19).map((parameter) => removeUnderscore(parameter.name)).join(", \n")},
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
        var sWU = `${parameter.name}`.startsWith('_');
        var param = removeUnderscore(parameter.name);
        return `${sWU ? `${param} == null ? null :` : ''}${param}${sWU ? '!' : ''}.map<Map<String,dynamic>>((data)=> data.toJson()).toList()`
    } else if (`${parameter.dataType}`.endsWith("?")) {
        var paranam = `${removeUnderscore(parameter.name)}`;
        return `${paranam} == null? null:${paranam}!.toJson()`
    }
    return `${removeUnderscore(parameter.name)}.toJson()`
}
function fromJsonForClass(parameter) {
    if (parameter.dataType.startsWith("List")) {
        return isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameterForClassDataTypeList(parameter) : `json['${removeUnderscore(parameter.parameterName)}'] == null ? ${checkType(parameter.dataType)} :(json['${removeUnderscore(parameter.name)}'] as List).map<${parameter.className}>((data)=> ${parameter.className}.fromJson(data  as Map<String,Object?>)).toList()` : parameter.isDefault ? defaultValueParameterForClassDataTypeList(parameter) : `(json['${removeUnderscore(parameter.name)}'] as List).map<${parameter.className}>((data)=> ${parameter.className}.fromJson(data as Map<String,Object?>)).toList()`
    }
    return isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameterForClassDataTypeDynamic(parameter) : `json['${removeUnderscore(parameter.parameterName)}'] == null ? ${checkType(parameter.dataType)} : ${parameter.className}.fromJson(json['${removeUnderscore(parameter.parameterName)}']  as Map<String,Object?>)` : parameter.isDefault ? defaultValueParameterForClassDataTypeDynamic(parameter) : `${parameter.className}.fromJson(json['${removeUnderscore(parameter.name)}']  as Map<String,Object?>)`
}
function defaultValueParameter(parameter) {
    return `json['${removeUnderscore(parameter.parameterName)}'] == null ? ${checkType(parameter.dataType)} : json['${removeUnderscore(parameter.parameterName)}'] as ${removeQuestion(parameter.dataType)}`
}
function defaultValueParameterForClassDataTypeList(parameter) {
    return `json['${removeUnderscore(parameter.parameterName)}'] == null ? ${checkType(parameter.dataType)} : json['${removeUnderscore(parameter.parameterName)}'].map<${parameter.className}>((data)=> (${parameter.className} as List).fromJson(data  as Map<String,Object?>)).toList()`
}

function defaultValueParameterForClassDataTypeDynamic(parameter) {
    return `json['${removeUnderscore(parameter.parameterName)}'] == null ? ${checkType(parameter.dataType)} : ${parameter.className}.fromJson(json['${removeUnderscore(parameter.parameterName)}'])`
}
function notOptionalDataType(parameter) {
    return `json['${removeUnderscore(parameter.parameterName)}'] as ${removeQuestion(parameter.dataType)}`
}
function nullDataType(parameter) {
    return `json['${removeUnderscore(parameter.parameterName)}'] == null ? ${checkType(parameter.dataType)} : json['${removeUnderscore(parameter.parameterName)}'] as ${removeQuestion(parameter.dataType)}`
}

function isOptionalDataType(dataType) {
    return dataType.endsWith("?")
    // return dataType.startsWith('_')
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
    if (['int?', 'double?', 'String?', 'bool?'].includes(variable)) {
        return 'null';
    }
    else {
        return `${removeQuestion(variable)}.fromJson({})`;
    }
}
function removeUnderscore(str) {
    if (str.startsWith('_')) {
        return str.slice(1);
    }
    return str;
}
