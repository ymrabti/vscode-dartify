import { doubleSaveChange, intSaveChange } from "./num";
import { stringSaveChange } from "./string";

export function getSaveChange(typeData: string, required: boolean, name: string) {
    switch (typeData) {
        case 'int':
            return intSaveChange(required, name);
        case 'int?':
            return intSaveChange(required, name);
        case 'double':
            return doubleSaveChange(required, name);
        case 'double?':
            return doubleSaveChange(required, name);

        default:
            return stringSaveChange(required, name);
    }
}