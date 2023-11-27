import { toCamelCase, toPascalCase } from "../functions";

export function enumerable(list: string[], name: string): string {
    return `
    
enum ${toPascalCase(name)} { 
  select,
  ${list.map(e => toCamelCase(e)).join(',\n')}
}

extension ${toPascalCase(name)}X on ${toPascalCase(name)} {
  String get label {
    switch (this) {
      ${list.map(e => `
      case ${toPascalCase(name)}.${toCamelCase(e)}:
        return '${e}';
      `).join('\n')}
      default:
        return 'Select';
    }
  }
}

    `;
}