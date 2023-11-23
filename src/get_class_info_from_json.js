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

    getClassInfo(data, className) {
        let classDetails = {
            className: className ?? "DartifyGeneratedDataModel",
            mutable: false,
            parameters: []
        }

        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                let parameterName = this.getDartParameterName(key)
                let className = this.handelMap(element, key)
                let dataTypeInfo = className ?? this.getDartDataType(element, key)

                const suffix = parameterName.startsWith('_') ? '?' : '';
                classDetails.parameters.push({
                    required: false,
                    name: parameterName,
                    parameterName: key,
                    dataType: dataTypeInfo?.dataType === "dynamic" ? "dynamic" : `${dataTypeInfo?.dataType}${suffix}`,
                    inbuilt: dataTypeInfo.inbuilt ?? false,
                    className: dataTypeInfo.className ?? ""
                })
            }
        }
        return classDetails;
    }

    handelMap(dataType, key) {
        let dataTypeString = JSON.stringify(dataType)
        if (dataTypeString.startsWith("{") && dataTypeString.endsWith("}")) {
            let className = this.getDartClassName(key)
            let data = this.getClassInfo(dataType, className)
            let duplicateClass = this.checkIsDuplicateClass(this.DartifyClassData.class, data)
            if (duplicateClass != null) {
                return {
                    dataType: duplicateClass?.className, //`Map<${this.getMapKeyDataType(duplicateClass?.parameters)},${duplicateClass?.className}>`,
                    inbuilt: false,
                    className: duplicateClass?.className
                };

            } else {

                this.DartifyClassData.class.push(data)
                return {
                    dataType: className, //`Map<${this.getMapKeyDataType(data.parameters)},${className}>`,
                    inbuilt: false,
                    className: className
                };
            }
        }
        return null
    }

    getDartDataType(dataType, key) {
        switch (typeof (dataType)) {
            case "string":
                return {
                    dataType: "String",
                    inbuilt: true,
                    className: ""
                };
            case "number":
                if (this.isInteger(dataType))
                    return {
                        dataType: "int",
                        inbuilt: true,
                        className: ""
                    };
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
                if (Array.isArray(dataType)) {
                    return this.handelList(dataType, key)
                }

                if (dataType == "null") return {
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
    getMapKeyDataType(parameters) {
        if (parameters == null || parameters?.length <= 0) return 'String';
        return parameters[0].dataType?.replace("?", "")
    }
    handelList(dataType, key) {
        if (dataType.length <= 0) return {
            dataType: `List<dynamic>`,
            inbuilt: true,
            className: ""
        }
        let className = this.handelMap(dataType[0], key)
        let dataTypeInfo = className ?? this.getDartDataType(dataType[0], key)
        return {
            dataType: `List<${dataTypeInfo?.dataType}>`,
            inbuilt: dataTypeInfo.inbuilt,
            className: dataTypeInfo?.className
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


    isInteger(n) {
        return n === +n && n === (n | 0);
    }
}

