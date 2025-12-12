import type { ADFAttribute, ADFAttributes } from '../../types/ADFAttribute';
import { capitalize } from '../../utils/capitalize';

export const convertTypeToTypeName = (type: string, suffix = 'Definition'): string => {
	return `${type.split('_').map(capitalize).join('')}${suffix}`;
};

export const _codeBlock = (...blocks: string[]) => {
	return blocks.filter((b) => b !== '').join('\n\n');
};

function escape(str: string) {
	// handle special characters: \n
	return str.replace(/\n/gu, '\\n');
}

const buildADFAttributesType = (attrKey: string, attrValue: ADFAttribute): string[] => {
	const key = `${attrKey}${attrValue.optional ? '?' : ''}`;
	switch (attrValue.type) {
		case 'string':
		case 'number':
		case 'boolean':
			return [`${key}: ${attrValue.type}`];
		case 'enum':
			return [`${key}: ${attrValue.values.map((v) => `"${escape(v)}"`).join('|')}`];
		case 'array':
			return [`${key}: Array<${attrValue.items.type}>`];
		case 'object':
			return [`${key}: Record<string, unknown>`];
		default:
			throw new Error(
				`Unknown type for "${attrKey}". ADF Attributes must have a type defined in the DSL.`,
			);
	}
};

export const buildADFAttributesTypes = (attrs: ADFAttributes): string[] => {
	return Object.entries(attrs).flatMap(([attrKey, attrValue]) =>
		buildADFAttributesType(attrKey, attrValue),
	);
};

export const _interface = (name: string, body: string) => {
	return `export interface ${name} {${body}}`;
};

export const _type = (name: string, body: string) => {
	return `export type ${name} = ${body}`;
};

export const _functionCallToVariable = (
	variableName: string,
	functionName: string,
	args: string[],
) => {
	return `export const ${variableName} = ${functionName}(${args.join(',')})`;
};

export const _namedImport = (pkg: string, ...names: string[]) => {
	return `import { ${names.join(', ')} } from '${pkg}'`;
};

export const _namedTypeImport = (pkg: string, ...names: string[]) => {
	return `import type { ${names.join(', ')} } from '${pkg}'`;
};

/**
 * This helper function is used to keep undefined in the generated code,
 * because JSON.stringify will strip out undefined key-value pair by default.
 * @param obj object
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringifyWithUndefined(obj: any) {
	return JSON.stringify(obj, (_key, value) => {
		return value !== undefined ? value : 'undefined';
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}).replace(/"undefined"/gu, undefined as any);
}
