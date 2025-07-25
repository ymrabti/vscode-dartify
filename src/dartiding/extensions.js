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

module.exports = function generateExtensions({ classInfo, genForms, jsonWild, basename, projectName, useSeparate }) {
    return `
${useSeparate?`import "${basename}.enums.dart";`: ''}
${useSeparate?`import "${basename}.classes.dart";`: ''}

    ${classInfo.class.map((myClass, indx) => {
        const className = myClass.className
        const classNameEnum = `${className}Enum`
        const params = [...myClass.parameters].sort((a, b) => b.name.length - a.name.length);
        return `



${genForms === yesPlease ? `extension ${classNameEnum}X on ${classNameEnum}{
    String get labelTranslation{
    switch(this){
    ${params.map((parameter) => {
            const paramName = parameter.name
            return `case ${classNameEnum}.${paramName}:
        
        return translate(AppTranslation.${paramName});`
        }).join("\n")

                }
            default:
        return name;
            }
    }
    String get hintTranslation{
    switch(this){
    ${params.map((parameter) => {
                    const paramName = parameter.name
                    return `case ${classNameEnum}.${paramName}:
        
        return translate(AppTranslation.${paramName});`
                }).join("\n")

                }
            default:
        return name;
            }
    }
}`: ''}

extension ${className}Sort on List<${className}>{
    List<${className}> sorty(${className}Enum caseField, {bool desc = false}){
      return this
      ..sort((${className} a, ${className} b) {
        int fact = desc ? -1 : 1;
        
          
          ${params.filter(e => e.inbuilt).map((parameter) => {
                    const paramName = parameter.name
                    return `if(caseField == ${classNameEnum}.${paramName}){
            // ${parameter.sortable ? 'sortable' : 'unsortable'}
            
            ${parameter.sort != "" ? `
            ${parameter.dataType} akey = a.${parameter.name};
            ${parameter.dataType} bkey = b.${parameter.name};
            ${parameter.sort}
          ` : ''}
            }`
                }).join("\n")
            }
          ${params.filter(e => !e.inbuilt).map((parameter) => {
                const paramName = parameter.name
                return `if(caseField == ${classNameEnum}.${paramName}){
                    // ${parameter.sortable ? 'sortable' : 'unsortable'}
                }
            `
            }).join("\n")
            }
            return 0;
        
      });
  }
}
      `
    }).join("\n")
        }
  
     `
}

