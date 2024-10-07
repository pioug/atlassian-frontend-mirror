import type {
	DOMOutputSpec,
	MarkSpec,
	NodeSpec,
	Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MarkConfig, NodeConfig } from '../types/pm-config';
import { sanitizeNodes } from '../utils/sanitizeNodes';

import { fixExcludes } from './create-editor';
import { sortByOrder } from './sort-by-order';

export const createGenericMetada = (node: PMNode) => {
	const commonAttributes = {
		['data-prosemirror-node-name']: node.type.name,
	};
	if (!node.type.isBlock) {
		return commonAttributes;
	}

	return {
		...commonAttributes,
		['data-prosemirror-node-block']: true,
	};
};

type toDOMType = (node: PMNode) => DOMOutputSpec;
export const wrapToDOMProxy = (toDOM: toDOMType): toDOMType => {
	const toDOMProxy = new Proxy(toDOM, {
		apply(target, thisArg, argumentsList) {
			const result = Reflect.apply(target, thisArg, argumentsList);

			if (!Array.isArray(result)) {
				return result;
			}

			const node = argumentsList[0];
			const hasAttributes = typeof result[1] === 'object' && !Array.isArray(result[1]);

			if (hasAttributes) {
				result[1] = Object.assign(result[1], createGenericMetada(node));
			} else {
				result.splice(1, 0, createGenericMetada(node));
			}

			return result;
		},
	});

	return toDOMProxy;
};

export const wrapNodeSpecProxy = (spec: NodeSpec): NodeSpec => {
	const nodeSpecProxy = new Proxy(spec, {
		get: function (target, prop, receiver) {
			const result = Reflect.get(target, prop, receiver);
			if (prop !== 'toDOM' || !result) {
				return result;
			}

			return wrapToDOMProxy(result);
		},
	});

	return nodeSpecProxy;
};

export function createSchema(editorConfig: { marks: MarkConfig[]; nodes: NodeConfig[] }) {
	const marks = fixExcludes(
		editorConfig.marks.sort(sortByOrder('marks')).reduce(
			(acc, mark) => {
				acc[mark.name] = mark.mark;
				return acc;
			},
			{} as { [nodeName: string]: MarkSpec },
		),
	);
	const nodes = sanitizeNodes(
		editorConfig.nodes.sort(sortByOrder('nodes')).reduce(
			(acc, node) => {
				if (fg('platform_editor_breakout_use_css')) {
					acc[node.name] = wrapNodeSpecProxy(node.node);
				} else {
					acc[node.name] = node.node;
				}
				return acc;
			},
			{} as { [nodeName: string]: NodeSpec },
		),
		marks,
	);

	return new Schema({ nodes, marks });
}
