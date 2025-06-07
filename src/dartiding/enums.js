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

module.exports = function generateEnums({ classInfo, genForms, jsonWild, basename, projectName, useSeparate }) {
    return `

    
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

