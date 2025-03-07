const { isDate,
    isTimeOfDay,
    isInteger,
    getRandomIntInclusive,
    getAdditionalParameters,
    isValidPhoneNumber
} = require("./functions");
module.exports = class JsonToDartClassInfo {
    get result() {
        this.DartifyClassData.class.reverse()
        return this.DartifyClassData
    };
    constructor(json, className) {
        this.DartifyClassData = {
            class: [

            ]
        };
        this.DartifyClassData.class.push(this.getClassInfo(json, className))
    }

    getClassInfo(data, className = "DartifyGeneratedDataModel") {
        let classDetails = {
            className: className,
            mutable: false,
            parameters: []
        }

        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                let parameterName = this.getDartParameterName(key)
                let className = this.handelMap(element, key)
                const optional = parameterName.startsWith('_');
                const suffix = optional ? '?' : '';
                const name = optional ? parameterName.slice(1) : parameterName;
                const dartType = className.dataType === "dynamic" ? "dynamic" : `${className.dataType}${suffix}`;
                classDetails.parameters.push({
                    required: !optional,
                    name: name,
                    sort: this.getSort(element, key, optional),
                    sortable: key.endsWith('$'),
                    value: element,
                    dataType: dartType,
                    entryClass: this.getEntryClass(element, dartType),
                    additional: getAdditionalParameters(element, dartType, name, optional),
                    inbuilt: className.inbuilt,
                    includeSearch: key.endsWith('$'),
                    className: className.className
                })
            }
        }
        return classDetails;
    }

    getDartDataType(value, key) {
        switch (typeof (value)) {
            case "string":
                if (isDate(value)) {
                    return {
                        dataType: "DateTime",
                        inbuilt: true,
                        className: ""
                    };
                }
                else if (isTimeOfDay(value)) {
                    return {
                        dataType: "TimeOfDay",
                        inbuilt: true,
                        className: ""
                    };
                }
                return {
                    dataType: "String",
                    inbuilt: true,
                    className: ""
                };
            case "number":
                if (isInteger(value)) {
                    return {
                        dataType: "int",
                        inbuilt: true,
                        className: ""
                    };
                }
                return {
                    dataType: "double",
                    inbuilt: true,
                    className: ""
                };
            case "boolean":
                return {
                    dataType: "bool",
                    inbuilt: true,
                    className: ""
                };
            case "object":
                if (Array.isArray(value)) {
                    return this.handelList(value, key)
                }

                if (value == "null") return {
                    dataType: "dynamic",
                    inbuilt: true,
                    className: ""
                }
                return {
                    dataType: "dynamic",
                    inbuilt: true,
                    className: ""
                }
            default:
                return {
                    dataType: "dynamic",
                    inbuilt: true,
                    className: ""
                };
        }
    }


    getEntryClass(value, cls) {
        switch (typeof (value)) {
            case "string":
                if (isDate(value)) {
                    return 'FormPlusDateTimeField';
                }
                else if (isTimeOfDay(value)) {
                    return 'FormPlusDateTimeField';
                }
                /* else if (isValidPhoneNumber(value)) {
                    return 'FormPlusPhoneField';
                } */
                return 'FormPlusTextField';
            case "number":
                if (isInteger(value)) {
                    return 'FormPlusNumericField<int>';
                }
                return 'FormPlusNumericField<double>';
            case "boolean":
                return 'FormPlusCheckbox';
            default:
                const local = typeof (cls) == 'object' && !Array.isArray(cls) ? cls : cls.replace('List<', '').replace('>', '');
                return `FormPlusSearchableDropdown<${local}, dynamic>`;
        }
    }

    getSort(value, key, optional) {
        const ab = optional ? `if (akey == null || bkey == null) return fact;` : '';
        switch (typeof (value)) {
            case "string":
                if (isDate(value)) {
                    return `
                    ${ab}
                    return fact * bkey.compareTo(akey);`;
                }
                else if (isTimeOfDay(value)) {
                    return `
                    ${ab}
                        int aValue = akey.hour + 60 + akey.minute;
                        int bValue = bkey.hour + 60 + bkey.minute;
                        return  fact * (bValue - aValue);`
                        ;
                }
                else {
                    return `
                    ${ab}
                    return fact * (bkey.compareTo(akey));`;
                }
            case "number":
                if (isInteger(value)) {
                    return `
                    ${ab}return fact * (bkey - akey);`;
                }
                return `
                    ${ab}
                    return fact * bkey.compareTo(akey);`;
            case "boolean":
                return `
                ${ab}
                int aValue = akey ? 1 : 0;
                int bValue = bkey ? 1 : 0;
                return fact * (bValue - aValue);
                `;
            default:
                return "";
        }
    }

    handelMap(dataType, key) {
        let dataTypeString = JSON.stringify(dataType)
        if (dataTypeString.startsWith("{") && dataTypeString.endsWith("}")) {
            let className = this.getDartClassName(key)
            let data = this.getClassInfo(dataType, className)
            let duplicateClass = this.checkIsDuplicateClass(this.DartifyClassData.class, data)
            if (duplicateClass != null) {
                return {
                    className: duplicateClass.className,
                    dataType: duplicateClass.className,
                    inbuilt: false,
                };

            } else {

                this.DartifyClassData.class.push(data)
                return {
                    className: className,
                    dataType: className,
                    inbuilt: false,
                };
            }
        }
        return this.getDartDataType(dataType, key,);
    }

    handelList(dataType, key) {
        if (dataType.length <= 0) return {
            dataType: `List<dynamic>`,
            inbuilt: true,
            className: ""
        }
        let className = this.handelMap(dataType[0], key)
        let dataTypeInfo = className /* ?? this.getDartDataType(dataType[0], key) */
        return {
            dataType: `List<${dataTypeInfo.dataType}>`,
            inbuilt: dataTypeInfo.inbuilt,
            className: dataTypeInfo.className
        }
    }

    getDartParameterName(name) {
        if (name == null || name == "") throw Error("Please Enter a Valid Parameter Name")
        return this.replaceUnderScoreWithTitle(name)
    }

    getDartClassName(name) {
        if (name == null || name == "") throw Error("Please Enter a Valid Parameter Name")
        let result = this.replaceUnderScoreWithTitle(name, true)
        return (result.charAt(0).toUpperCase() + result.slice(1))
    }

    replaceUnderScoreWithTitle(name, isClassName = false) {
        var format = isClassName ? /[`!@$%^&*()+\-_=\[\]{};':"\\|,.<>\/?~{0-9}]/ : /[`!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?~{0-9}]/;
        const firstChar = name.charAt(0)
        if (format.test(firstChar)) {
            name = name.replace(firstChar, "")
        }
        let data = name.split(isClassName ? /[`!@$%^&*()+\-_=\[\]{};':"\\|,.<>\/?~]/ : /[`!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/);
        let finalString = "";
        if (data.length > 0) {
            data.map((p, index) => {
                finalString += index != 0 ? (p.charAt(0).toUpperCase() + p.slice(1)) : p;
            })
        }
        return finalString
    }

    checkIsDuplicateClass(array, search) {
        let jsonData = JSON.stringify(search.parameters)
        return array.find((data) => JSON.stringify(data.parameters) == jsonData)
    }
}
