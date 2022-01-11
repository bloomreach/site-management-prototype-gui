import {ContentType, ContentTypeField} from "../api/models/contenttype";

const typeHead = 'import { Document, ImageSet, Reference } from \'@bloomreach/spa-sdk\';\n\n' +
    'export interface SelectionValue {\n' +
    '    key: string;\n' +
    '    label: string;\n' +
    '}\n' +
    '\n' +
    'export interface SelectableString {\n' +
    '    sourceName?: any;\n' +
    '    selectionValues: SelectionValue[];\n' +
    '}\n' +
    '\n' +
    'export interface DocumentContent {\n' +
    '  value: string;\n' +
    '}\n'

export function createInterfacesFromContentTypes(contentTypes: Array<ContentType>): string {
    return typeHead.concat('\n').concat(contentTypes.map(contentType => {
        return `${createInterfaceFromContentType(contentType, contentTypes)}`
    }).join('\n'));
}

export function createInterfaceFromContentType(contentType: ContentType, contentTypes: Array<ContentType>): string {
    const fields = contentType.fields?.map((field) => {
        return `\t${field.name}: ${getFieldType(field, contentTypes)}`
    }).join('\n');
    const template = `export interface ${contentType.name} {
${fields}
}\n`
    return template;
}

const map: Record<string, string> = {
    'OpenUiExtension': 'string',
    'String': 'string',
    'RichText': 'DocumentContent',
    'Integer': 'bigint',
    'Double': 'number',
    'Link': 'Reference',
    // 'SelectableFieldGroup': 'any[]'
}

export function getFieldType(field: ContentTypeField, types: Array<ContentType>): string {
    if (map[field.type] !== undefined) {
        return `${map[field.type]}${field.multiple ? '[]' : ''}`;
    } else if (field.type === 'SelectableFieldGroup') {
        return `[${field.fieldGroupTypes.join(" | ")}]`;
    } else if (field.type === 'FieldGroup') {
        const fieldGroupTemplate = types.some((element) => element.name === field.fieldGroupType) ? field.fieldGroupType : 'any';
        return `${fieldGroupTemplate}${field.multiple ? '[]' : ''}`
    } else{
        return field.type;
    }
}
