const listRegExp = RegExp(/^List<[a-zA-Z]+[\?]{0,1}>[\?]{0,1}$/);
module.exports = function generateClass(classInfo) {
    return `
    /* ${JSON.stringify(classInfo)} */
    ${classInfo.class.map((myClass) => {
        const className = myClass.className
        return `
enum ${className}Enum{
    ${myClass.parameters.map((parameter) => {
            const paramName = parameter.name
            return `${paramName},`
        }).join("\n")
            }
}
class ${className} {
${myClass.parameters.map((parameter) => {
                const paramName = parameter.name
                return `
            ${myClass.mutable ? "" : "final"} ${parameter.dataType} ${paramName};`
            }).join("\n")
            }
    ${myClass.mutable ? "" : "const"} ${className}({
        ${myClass.parameters.map((parameter) => {
                const reaq = `${parameter.name}`.startsWith('_') ? '' : 'required'
                return `\t\t${reaq} this.${parameter.name},`
            }).join("\n")
            }});

    ${className} copyWith({
        ${myClass.parameters.map((parameter) => {
                const endsWith = parameter.dataType.endsWith("?")
                const dataType = parameter.dataType
                const paramDtype = dataType + (dataType == "dynamic" ? "" : "?")
                return `\t\t${endsWith ? dataType : paramDtype} ${parameter.name}, `;

            }).join("\n")
            }}){
    return ${className}(
            ${myClass.parameters.map((parameter) => `${parameter.name}:${parameter.name} ?? this.${parameter.name}`).join(",\n")
            },);
    }
        
    Map<String,Object?> toJson(){
        return {
            ${myClass.parameters.map((parameter) => `${className}Enum.${parameter.name}.name: ${parameter.inbuilt ? parameter.name : toJsonForClass(parameter)}`).join(",\n")

            },};
}

factory ${className}.fromJson(Map<String , Object?> json){
    return ${className}(
            ${myClass.parameters.map((parameter) => {
                const isOptionalDT = isOptionalDataType(parameter.dataType);
                const jsonKey = `json[${myClass.className}Enum.${parameter.name}.name]`;
                const inBuilt = `${jsonKey} ${isOptionalDT ? '' : `as ${removeQuestion(parameter.dataType)}`}`;
                return `${parameter.name}:${parameter.inbuilt ? inBuilt : `${fromJsonForClass(parameter, myClass.className)}`}`;
            }).join(",\n")},
    );
}

@override
String toString(){
    return '${className}(${myClass.parameters.map((parameter) => `${parameter.name}:${parameter.inbuilt ? `$${parameter.name}` : `\${${parameter.name}.toString()\}`}`).join(", ")})';
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
                ${myClass.parameters.length < 20 ? myClass.parameters.map((parameter) => parameter.name).join(", \n") : myClass.parameters.slice(0, 19).map((parameter) => parameter.name).join(", \n")},
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
    if (listRegExp.test(parameter.dataType)) {
        var sWU = !parameter.name.required;
        var param = parameter.name;
        return `${sWU ? `${param} == null ? null :` : ''}${param}${sWU ? '!' : ''}.map<Map<String,dynamic>>((data)=> data.toJson()).toList()`
    } else if (`${parameter.dataType}`.endsWith("?")) {
        var paranam = `${parameter.name}`;
        return `${paranam} == null? null:${paranam}!.toJson()`
    }
    return `${parameter.name}.toJson()`
}
function fromJsonForClass(parameter, className) {
    const cn = className;
    const asmap = '  as Map<String,Object?>';
    const jsonKey = `json[${parameter.className}Enum.${parameter.name}.name]`;
    const pfj = `${parameter.className}.fromJson`;
    const pl = `(${jsonKey} as List).map<${cn}>((data)=> ${pfj}(data ${asmap})).toList()`;
    const isOptDataType = isOptionalDataType(parameter.dataType)
    const checkedType = checkType(parameter.dataType)
    if (listRegExp.test(parameter.dataType)) {
        return isOptDataType ? `${jsonKey} == null ? ${checkedType} :${pl}` : pl
    }
    return isOptDataType ? `${jsonKey} == null ? ${checkedType} : ${pfj}(${jsonKey} ${asmap})` : `${pfj}(${jsonKey} ${asmap})`
}


function isOptionalDataType(dataType) {
    return dataType.endsWith("?")
}
function checkType(variable) {
    if (variable === 'int') {
        return '0';
    }
    if (variable === 'double') {
        return '0.0';
    }
    if (variable === 'String') {
        return '""';
    }
    if (listRegExp.test(variable)) {
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

