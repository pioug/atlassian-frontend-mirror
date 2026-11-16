import { createElement } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/common';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { nodeMargins } from '../ui/consts';
import {
	DropTarget,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET,
} from '../ui/drop-target';
import type { DropTargetProps } from '../ui/drop-target';
import { DropTargetLayout, DropTargetLayoutNativeAnchorSupport } from '../ui/drop-target-layout';
import type { DropTargetLayoutProps } from '../ui/drop-target-layout';
import { TYPE_DROP_TARGET_DEC } from './decorations-common';
import type { AnchorRectCache } from './utils/anchor-utils';

const getNodeMargins = (node?: PMNode) => {
	if (!node) {
		return nodeMargins['default'];
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return nodeMargins[`heading${node.attrs.level}`] || nodeMargins['default'];
	}

	return nodeMargins[nodeTypeName] || nodeMargins['default'];
};

const shouldCollapseMargin = (prevNode?: PMNode, nextNode?: PMNode) => {
	if (
		(prevNode?.type.name === 'mediaSingle' || nextNode?.type.name === 'mediaSingle') &&
		prevNode?.type.name !== nextNode?.type.name
	) {
		return false;
	}

	return true;
};

const getGapAndOffset = (prevNode?: PMNode, nextNode?: PMNode, parentNode?: PMNode | null) => {
	if (!prevNode && nextNode) {
		// first node - adjust for bodied containers
		let offset = 0;
		if (parentNode?.type.name === 'bodiedSyncBlock') {
			offset += 4;
		}
		return { gap: 0, offset };
	} else if (prevNode && !nextNode) {
		// last node - adjust for bodied containers
		let offset = 0;
		if (parentNode?.type.name === 'bodiedSyncBlock') {
			offset -= 4;
		}
		return { gap: 0, offset };
	}

	const top = getNodeMargins(nextNode).top || 4;
	const bottom = getNodeMargins(prevNode).bottom || 4;

	const gap = shouldCollapseMargin(prevNode, nextNode) ? Math.max(top, bottom) : top + bottom;

	let offset = top - gap / 2;

	if (prevNode?.type.name === 'mediaSingle' && nextNode?.type.name === 'mediaSingle') {
		offset = -offset;
	} else if (prevNode?.type.name && ['tableCell', 'tableHeader'].includes(prevNode?.type.name)) {
		offset = 0;
	}

	return { gap, offset };
};

/**
 * Find drop target decorations in the pos range between from and to
 * @param decorations
 * @param from
 * @param to
 * @returns
 */
export const findDropTargetDecs = (
	decorations: DecorationSet,
	from?: number,
	to?: number,
): Decoration[] => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_DROP_TARGET_DEC);
};

export const createDropTargetDecoration = (
	pos: number,
	props: Omit<DropTargetProps, 'getPos'>,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	side?: number,
	anchorRectCache?: AnchorRectCache,
	isSameLayout?: boolean,
): Decoration => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const key = uuid();
	return Decoration.widget(
		pos,
		(_, getPosUnsafe) => {
			const getPos = () => {
				try {
					return getPosUnsafe();
				} catch (e) {
					return undefined;
				}
			};
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.setAttribute('data-blocks-drop-target-key', key);
			element.style.clear = 'unset';
			const { gap, offset } = getGapAndOffset(props.prevNode, props.nextNode, props.parentNode);
			element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET, `${offset}px`);
			element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP, `${gap}px`);
			element.style.setProperty('display', 'block');

			nodeViewPortalProviderAPI.render(
				() => createElement(DropTarget, { ...props, getPos, anchorRectCache, isSameLayout }),
				element,
				key,
				undefined,
				// @portal-render-immediately
				true,
			);

			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
			side,
			destroy: () => {
				nodeViewPortalProviderAPI.remove(key);
			},
		},
	);
};

export const createLayoutDropTargetDecoration = (
	pos: number,
	props: Omit<DropTargetLayoutProps, 'getPos'>,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	anchorRectCache?: AnchorRectCache,
): Decoration => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const key = uuid();
	return Decoration.widget(
		pos,
		(_, getPosUnsafe) => {
			const getPos = () => {
				try {
					return getPosUnsafe();
				} catch (e) {
					return undefined;
				}
			};
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.setAttribute('data-blocks-drop-target-key', key);
			element.style.clear = 'unset';
			const DropTargetLayoutComponent =
				expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) ||
				isExperimentEnabled('platform_editor_block_control_migration')
					? DropTargetLayoutNativeAnchorSupport
					: DropTargetLayout;

			nodeViewPortalProviderAPI.render(
				() => createElement(DropTargetLayoutComponent, { ...props, getPos, anchorRectCache }),
				element,
				key,
				undefined,
				// @portal-render-immediately
				true,
			);
			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
			destroy: () => {
				nodeViewPortalProviderAPI.remove(key);
			},
		},
	);
};
