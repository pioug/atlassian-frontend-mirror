/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { ADNode } from '@atlaskit/editor-common/validator';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { Transformer } from '@atlaskit/editor-common/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

function createEncoder<T>(parser: Transformer<T>, encoder: Transformer<any>) {
	return (value: T) => encoder.encode(parser.parse(value));
}
export type TransformerProvider<T> = (schema: Schema) => Transformer<T>;
export class ADFEncoder<T> {
	encode: (value: T) => any;

	constructor(createTransformerWithSchema: TransformerProvider<T>) {
		const transformer = createTransformerWithSchema(defaultSchema);
		this.encode = createEncoder(transformer, new JSONTransformer());
	}
}

export const getText = (node: PMNode | ADNode): string => {
	return (
		node.text ||
		(node.attrs && (node.attrs.text || node.attrs.shortName)) ||
		`[${typeof node.type === 'string' ? node.type : node.type.name}]`
	);
};

export const getEventHandler = (
	eventHandlers?: EventHandlers,
	type?: keyof EventHandlers,
	eventName: string = 'onClick',
): any => {
	return eventHandlers && type && eventHandlers[type] && (eventHandlers as any)[type][eventName];
};

/**
 * Traverse through parent elements of element. Return element for which evaluate(element) returns
 * true. If topElement is reached before evaluate returns true, return false. Does not run evaluate
 * on topElement.
 * @param element Starting HTMLElement
 * @param topElement HTMLElement to end search at. evaluate is not called on this element
 * @param evaluate Function which returns true or false based on the given element. eg: Checks if
 * element has desired classname.
 */
export function findInTree(
	element: HTMLElement,
	topElement: HTMLElement,
	evaluate: (element: HTMLElement) => boolean,
): boolean {
	if (element === topElement) {
		return false;
	}
	if (evaluate(element)) {
		return true;
	}
	if (!element.parentElement) {
		return false;
	}
	return findInTree(element.parentElement, topElement, evaluate);
}
