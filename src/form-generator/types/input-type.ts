

export enum DartInputs {
    text = 'text',
    number = 'number',
    datetime = 'datetime',
    phone = 'phone',
    emailAddress = 'emailAddress',
    url = 'url',
    //
    multiline = 'multiline',
    visiblePassword = 'visiblePassword',
    name = 'name',
    streetAddress = 'streetAddress',
    none = 'none',
};


export function isDate(str: string): boolean {
    const timestamp = Date.parse(str);
    return !isNaN(timestamp);
}
export function getInputtype(variableValue: any) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let dataType = 'dynamic';
    if (typeof variableValue === 'number') {
        return `TextInputType.${DartInputs.number}`;
    }
    // 
    else if (typeof variableValue === 'string') {
        if (isDate(`${variableValue}`)) {
            return `TextInputType.${DartInputs.datetime}`;
        }
        else if (variableValue === '*'.repeat(variableValue.length)) {
            return `TextInputType.${DartInputs.text},
                    obscureText: true`;
        }
        else if (emailRegex.test(variableValue)) {
            return `TextInputType.${DartInputs.emailAddress}`;
        }
        else if (urlRegex.test(variableValue)) {
            return `TextInputType.${DartInputs.url}`;
        }
        else if (phoneRegex.test(variableValue)) {
            return `TextInputType.${DartInputs.phone}`;
        }
        dataType = `TextInputType.${DartInputs.text}`;
    }
    // 

    return dataType;
}