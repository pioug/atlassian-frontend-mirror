import type { NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	mediaSingle as mediaSingleFactory,
	mediaSingleCaption as mediaSingleCaptionFactory,
	mediaSingleFull as mediaSingleFullFactory,
	mediaSingleWidthType as mediaSingleWidthTypeFactory,
} from '../../next-schema/generated/nodeTypes';
import { isDOMElement } from '../../utils/parseDOM';
import { uuid } from '../../utils/uuid';
import { WidthType } from './types/rich-media-common';

export const mediaSingleSpec = ({
	withCaption = false,
	withExtendedWidthTypes = false,
	generateLocalId = false,
}: {
	generateLocalId?: boolean | undefined;
	withCaption?: boolean | undefined;
	withExtendedWidthTypes?: boolean | undefined;
}): NodeSpec => {
	const getAttrs = (dom: string | Node) => {
		if (!isDOMElement(dom)) {
			// this should never happen
			return { layout: 'center' };
		}

		const layout = dom.getAttribute('data-layout') || 'center';
		const width = Number(dom.getAttribute('data-width')) || null;
		const widthType = dom.getAttribute('data-width-type');

		if (generateLocalId) {
			return { layout, width, widthType, localId: uuid.generate() };
		}

		if (withExtendedWidthTypes) {
			return { layout, width, widthType };
		} else if (widthType === WidthType.PIXEL) {
			// if editor does not support widthType attribute.
			// We ignore width and widthType together.
			return { layout };
		} else {
			return { layout, width };
		}
	};

	const getAttrsFromNode = (node: PMNode) => {
		const { layout, width } = node.attrs;
		const attrs: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			'data-layout': any;
			'data-local-id'?: string;
			'data-node-type': string;
			'data-width': string;
		} = {
			'data-node-type': 'mediaSingle',
			'data-layout': layout,
			'data-width': '',
		};

		if (generateLocalId) {
			attrs['data-local-id'] = node?.attrs?.localId || undefined;
		}

		if (width) {
			attrs['data-width'] =
				isFinite(width) && Math.floor(width) === width ? width : width.toFixed(2);
		}

		if (withExtendedWidthTypes && node.attrs.widthType) {
			const { widthType } = node.attrs;
			return {
				...attrs,
				'data-width-type': widthType || WidthType.PERCENTAGE,
			};
		}

		return attrs;
	};

	if (withExtendedWidthTypes && withCaption) {
		return mediaSingleFullFactory({
			parseDOM: [
				{
					tag: 'div[data-node-type="mediaSingle"]',
					getAttrs,
				},
			],
			toDOM(node) {
				return ['div', getAttrsFromNode(node), 0];
			},
		});
	}
	if (withExtendedWidthTypes && !withCaption) {
		return mediaSingleWidthTypeFactory({
			parseDOM: [
				{
					tag: 'div[data-node-type="mediaSingle"]',
					getAttrs,
				},
			],
			toDOM(node) {
				return ['div', getAttrsFromNode(node), 0];
			},
		});
	}
	if (!withExtendedWidthTypes && withCaption) {
		return mediaSingleCaptionFactory({
			parseDOM: [
				{
					tag: 'div[data-node-type="mediaSingle"]',
					getAttrs,
				},
			],
			toDOM(node) {
				return ['div', getAttrsFromNode(node), 0];
			},
		});
	}

	return mediaSingleFactory({
		parseDOM: [
			{
				tag: 'div[data-node-type="mediaSingle"]',
				getAttrs,
			},
		],
		toDOM(node: PMNode) {
			return ['div', getAttrsFromNode(node), 0];
		},
	});
};
