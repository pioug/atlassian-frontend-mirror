import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ColorScheme, DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';

import {
	standardDecorationMarkerVariable,
	deletedDecorationMarkerVariable,
	editingStyleQuoteNode,
	editingStyleRuleNode,
	editingStyleCardBlockNode,
	editingStyleNode,
	deletedContentStyleNew,
	deletedStyleQuoteNode,
	addedCellOverlayStyle,
	deletedCellOverlayStyle,
	deletedCellOverlayRoundedStyle,
} from './colorSchemes/standard';
import {
	traditionalDecorationMarkerVariableActive,
	traditionalDecorationMarkerVariableNew,
	traditionalDeletedDecorationMarkerVariableActive,
	traditionalDeletedDecorationMarkerVariableNew,
	traditionalStyleQuoteNodeActive,
	traditionalStyleQuoteNodeNew,
	traditionalStyleRuleNodeActive,
	traditionalStyleRuleNodeNew,
	traditionalStyleCardBlockNodeActive,
	traditionalStyleCardBlockNodeNew,
	traditionalStyleNodeActive,
	traditionalStyleNodeNew,
	getDeletedTraditionalInlineStyle,
	deletedTraditionalStyleQuoteNode,
	traditionalAddedCellOverlayStyle,
	deletedTraditionalCellOverlayStyle,
	deletedTraditionalCellOverlayRoundedStyle,
} from './colorSchemes/traditional';
import { createBlockIndicatorAnchorWidgets } from './createAnchorDecorationWidgets';
import { buildDiffDecorationSpec } from './decorationKeys';

const displayNoneStyle = convertToInlineCss({
	display: 'none',
});

const getNodeClass = (name: string) => {
	switch (name) {
		case 'extension':
			return 'show-diff-changed-decoration-node';
		default:
			return undefined;
	}
};

const getBlockNodeStyle = ({
	nodeName,
	colorScheme,
	isInserted = true,
	isActive = false,
	diffType,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isActive?: boolean;
	isInserted?: boolean;
	nodeName: string;
}) => {
	const isTraditional = colorScheme === 'traditional';
	if (
		[
			'mediaSingle',
			'mediaGroup',
			'table', // Handle table separately to avoid border issues
			'tableRow',
			'paragraph', // Paragraph and heading nodes do not need special styling
			'heading',
			'hardBreak',
			'decisionList',
			'taskList',
			'bulletList',
			'orderedList',
			'layoutSection',
		].includes(nodeName)
	) {
		// Layout nodes do not need special styling
		return undefined;
	}
	// Media nodes inside mediaSingle should not get position:relative
	// as it shifts the image outside its parent container (e.g. panel)
	if (nodeName === 'media') {
		if (!isInserted && isExtendedEnabled(diffType)) {
			return isTraditional
				? getDeletedTraditionalInlineStyle(false)
				: deletedDecorationMarkerVariable;
		}
		return isTraditional
			? isActive
				? traditionalStyleNodeActive
				: traditionalStyleNodeNew
			: editingStyleNode;
	}
	if (['tableCell', 'tableHeader'].includes(nodeName)) {
		if (isExtendedEnabled(diffType)) {
			// This is used for positioning the cell overlay widget decorations
			return convertToInlineCss({
				position: 'relative',
			});
		}
		// When gate is off, it should return undefined as above
		return undefined;
	}
	if (nodeName === 'panel') {
		if (!isInserted && isExtendedEnabled(diffType)) {
			return isTraditional
				? getDeletedTraditionalInlineStyle(false)
				: deletedDecorationMarkerVariable;
		}
		return isTraditional
			? isActive
				? traditionalStyleNodeActive
				: traditionalStyleNodeNew
			: editingStyleNode;
	}
	if (['extension', 'embedCard', 'listItem'].includes(nodeName)) {
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional && isActive
					? traditionalDecorationMarkerVariableActive
					: isTraditional
						? traditionalDecorationMarkerVariableNew
						: standardDecorationMarkerVariable;
			} else {
				if (nodeName === 'listItem') {
					return isTraditional && isActive
						? traditionalDeletedDecorationMarkerVariableActive
						: isTraditional
							? traditionalDeletedDecorationMarkerVariableNew
							: deletedDecorationMarkerVariable;
				}
				return isTraditional && isActive
					? traditionalDeletedDecorationMarkerVariableActive
					: isTraditional
						? traditionalDeletedDecorationMarkerVariableNew
						: deletedContentStyleNew;
			}
		}
		return isTraditional && isActive
			? traditionalDecorationMarkerVariableActive
			: isTraditional
				? traditionalDecorationMarkerVariableNew
				: standardDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleQuoteNodeActive
						: traditionalStyleQuoteNodeNew
					: editingStyleQuoteNode;
			} else {
				return isTraditional ? deletedTraditionalStyleQuoteNode : deletedStyleQuoteNode;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleQuoteNodeActive
				: traditionalStyleQuoteNodeNew
			: editingStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleRuleNodeActive
						: traditionalStyleRuleNodeNew
					: editingStyleRuleNode;
			} else {
				return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleRuleNodeActive
				: traditionalStyleRuleNodeNew
			: editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleCardBlockNodeActive
						: traditionalStyleCardBlockNodeNew
					: editingStyleCardBlockNode;
			} else {
				return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleCardBlockNodeActive
				: traditionalStyleCardBlockNodeNew
			: editingStyleCardBlockNode;
	}
	if (isExtendedEnabled(diffType)) {
		if (isInserted) {
			return isTraditional
				? isActive
					? traditionalStyleNodeActive
					: traditionalStyleNodeNew
				: editingStyleNode;
		} else {
			return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
		}
	}
	return isTraditional
		? isActive
			? traditionalStyleNodeActive
			: traditionalStyleNodeNew
		: editingStyleNode;
};

/**
 * Node decoration used for block-level insertions. When isActive, uses emphasised (pressed) styling.
 *
 * @param change Node range and name
 * @param colorScheme Optional color scheme
 * @param isActive Whether this node is part of the currently active/focused change
 * @returns Prosemirror node decoration or undefined
 */
export const createBlockChangedDecoration = ({
	change,
	colorScheme,
	isInserted = true,
	isActive = false,
	shouldHideDeleted = false,
	showIndicators = false,
	doc,
	diffType,
}: {
	change: { from: number; name: string; to: number };
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc?: PMNode;
	isActive?: boolean;
	isInserted?: boolean;
	shouldHideDeleted?: boolean;
	showIndicators?: boolean;
}): Decoration[] => {
	const decorations: Decoration[] = [];
	const diffId = crypto.randomUUID();

	if (shouldHideDeleted) {
		return [
			Decoration.node(
				change.from,
				change.to,
				{ style: displayNoneStyle },
				buildDiffDecorationSpec({
					decorationType: 'block',
					diffId,
					isActive,
					nodeName: change.name,
					diffType,
				}),
			),
		];
	}

	let style: string | undefined;

	if (isExtendedEnabled(diffType) && ['tableCell', 'tableHeader'].includes(change.name)) {
		const cellOverlay = document.createElement('div');
		const isTraditional = colorScheme === 'traditional';
		const isRoundedTable = expValEquals(
			'platform_editor_table_diff_rounded_corners',
			'isEnabled',
			true,
		);

		const addedCellStyle = isTraditional ? traditionalAddedCellOverlayStyle : addedCellOverlayStyle;

		const deletedCellStyle = isTraditional
			? isRoundedTable
				? deletedTraditionalCellOverlayRoundedStyle
				: deletedTraditionalCellOverlayStyle
			: isRoundedTable
				? deletedCellOverlayRoundedStyle
				: deletedCellOverlayStyle;

		const cellOverlayStyle = isInserted ? addedCellStyle : deletedCellStyle;
		cellOverlay.setAttribute('style', cellOverlayStyle);
		decorations.push(
			// change.to - 1 to position the overlay inside the end of the cell
			// this key doesn't use the spec / key builder since this is just for
			// decorating the cells, this is part of a bigger table diff
			Decoration.widget(change.to - 1, cellOverlay, {
				key: 'cell-overlay-decoration',
			}),
		);
	}
	if (isExtendedEnabled(diffType)) {
		style = getBlockNodeStyle({
			nodeName: change.name,
			colorScheme,
			isInserted,
			isActive,
			diffType,
		});
	} else {
		style = getBlockNodeStyle({ nodeName: change.name, colorScheme, isActive, diffType });
	}
	const className = getNodeClass(change.name);
	if (style || className) {
		decorations.push(
			Decoration.node(
				change.from,
				change.to,
				{
					style: style,
					'data-testid': 'show-diff-changed-decoration-node',
					class: className,
				},
				buildDiffDecorationSpec({
					decorationType: 'block',
					diffId,
					isActive,
					nodeName: change.name,
					diffType,
				}),
			),
		);
	}

	if (decorations.length > 0 && showIndicators && doc && isExtendedEnabled(diffType)) {
		decorations.push(
			...createBlockIndicatorAnchorWidgets({ doc, from: change.from, to: change.to, diffId }),
		);
	}

	return decorations;
};
