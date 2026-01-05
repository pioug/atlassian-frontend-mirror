import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Check if the node has certain marks
 */
export function hasAnyOfMarks(node: PMNode, types: string[]): boolean {
	return node.marks.findIndex((m) => types.findIndex((t) => m.type.name === t) !== -1) !== -1;
}

export function isDigit(value: string) {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return !!value.match(/^\d$/);
}

export function isBlank(value: string | null) {
	return value === null || value.trim() === '';
}

export function isNotBlank(value: string | null) {
	return !isBlank(value);
}

/**
 * ESS-2375 Returns the beginning and closing symbol to parse a token
 */
export const getSurroundingSymbols = (
	trimmedInput: string,
	openingText: string,
	closingText: string,
): Record<string, string> => {
	const openingSymbol = trimmedInput.startsWith(`{${openingText}}`)
		? `{${openingText}}`
		: openingText;
	const endIndex = trimmedInput.indexOf(
		closingText,
		openingSymbol === `{${openingText}}` ? openingText.length + 2 : openingText.length,
	);
	const closingSymbol =
		endIndex > -1 &&
		trimmedInput.charAt(endIndex - 1) === '{' &&
		trimmedInput.charAt(endIndex + closingText.length) === '}'
			? `{${closingText}}`
			: closingText;
	return { openingSymbol, closingSymbol };
};

export class StringBuffer {
	constructor(private buffer: string = '') {}

	indexOf(value: string): number {
		return this.buffer.indexOf(value);
	}

	lastIndexOf(value: string): number {
		return this.buffer.lastIndexOf(value);
	}

	charAt(index: number): string {
		return this.buffer.charAt(index);
	}

	length(): number {
		return this.buffer.length;
	}

	delete(start: number, end: number): void {
		this.buffer = this.buffer.substring(0, start) + this.buffer.substring(end);
	}

	append(value: string): void {
		this.buffer += value;
	}

	substring(start: number, end?: number) {
		return this.buffer.substring(start, end);
	}

	deleteCharAt(index: number): void {
		this.delete(index, index + 1);
	}

	toString() {
		return this.buffer;
	}
}
