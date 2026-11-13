/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

import { cssMap as compiledCssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { messages } from '@atlaskit/editor-common/messages/block-controls';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { isEmptyNode } from '@atlaskit/editor-common/utils';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import AddIcon from '@atlaskit/icon/core/add';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { QuickInsertPlugin } from '../quickInsertPluginType';
import { openQuickInsertInSingleTransaction } from './open-quick-insert-in-single-transaction';

const TEXT_PARENT_TYPES = ['paragraph', 'heading', 'blockquote', 'taskItem', 'decisionItem'];

// @atlaskit/css intentionally restricts height and width values, so Compiled owns only the
// dimensions that scale at runtime with the editor's dense-mode font-size custom property.
const quickInsertButtonContainerStyles = compiledCssMap({
	root: {
		display: 'flex',
		height: 'calc(24 * var(--ak-editor-base-font-size, 16px) / 16)',
		width: 'calc(24 * var(--ak-editor-base-font-size, 16px) / 16)',
	},
	reservedDragHandleSpace: {
		// Keep Quick Insert fixed when the drag handle moves to a nested surface. This reserves the
		// migrated handle's scaled 12px width plus the left-surface space.025 gap.
		marginInlineEnd: `calc(12 * var(--ak-editor-base-font-size, 16px) / 16 + ${token('space.025')})`,
	},
});

const quickInsertButtonStyles = cssMap({
	root: {
		alignItems: 'center',
		backgroundColor: token('color.background.neutral.subtle'),
		border: 'none',
		borderRadius: token('radius.full'),
		boxSizing: 'border-box',
		color: token('color.text.subtle'),
		cursor: 'pointer',
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
		width: '100%',
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			transition: token('motion.button.pressed'),
		},
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			outlineOffset: token('space.025'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
		},
		transition: token('motion.button.hovered'),
	},
});

const createNewLine =
	(start: number): EditorCommand =>
	({ tr }) => {
		const nodeSize = tr.doc.nodeAt(start)?.nodeSize;
		if (nodeSize === undefined) {
			return tr;
		}
		const position = start + nodeSize;
		tr.insert(position, tr.doc.type.schema.nodes.paragraph.create());
		return tr.setSelection(TextSelection.near(tr.doc.resolve(position)));
	};

const isSelectionInNode = (start: number, view: EditorView): boolean => {
	const node = view.state.doc.nodeAt(start);
	if (!node) {
		return false;
	}
	const { $from, $to } = view.state.selection;
	return $from.pos >= start && $to.pos <= start + node.nodeSize;
};

const isNonEditableBlock = (start: number, view: EditorView): boolean => {
	const node = view.state.doc.nodeAt(start);
	if (!node) {
		return false;
	}
	if (node.type.name === 'mediaGroup' || node.type.name === 'mediaSingle') {
		return true;
	}
	return node.isBlock && (node.isAtom || node.isLeaf);
};

const getNextEmptyParagraphPosition = (start: number, view: EditorView): number | undefined => {
	const node = view.state.doc.nodeAt(start);
	if (!node) {
		return undefined;
	}

	const positionAfterTarget = start + node.nodeSize;
	const nextNode = view.state.doc.resolve(positionAfterTarget).nodeAfter;
	if (nextNode?.type !== view.state.schema.nodes.paragraph || nextNode.marks.length > 0) {
		return undefined;
	}
	if (!isEmptyNode(view.state.schema)(nextNode)) {
		return undefined;
	}

	return positionAfterTarget + 1;
};

export const openQuickInsert = (
	api: ExtractInjectionAPI<QuickInsertPlugin>,
	view: EditorView,
	start: number,
	openTypeAhead: () => void,
): void => {
	if (
		isExperimentEnabled('platform_editor_collapsible_headings') &&
		api.blockCollapse?.sharedState.currentState()?.collapsedHeadingPositions.has(start)
	) {
		api.core.actions.execute(({ tr }) => {
			api.blockCollapse?.commands.expandHeading(start)({ tr });
			return createNewLine(start)({ tr });
		});
		openTypeAhead();
		return;
	}

	const isSelectionInsideNode = isSelectionInNode(start, view);
	const shouldCreateNewLine = !isSelectionInsideNode || isNonEditableBlock(start, view);
	const reusableParagraphPosition =
		shouldCreateNewLine && isExperimentEnabled('platform_editor_block_control_inp')
			? getNextEmptyParagraphPosition(start, view)
			: undefined;
	if (shouldCreateNewLine && reusableParagraphPosition === undefined) {
		api.core.actions.execute(createNewLine(start));
	} else if (
		reusableParagraphPosition !== undefined &&
		// Only skip when the cursor is already collapsed in the reused paragraph. A range selection
		// that merely starts there must still be collapsed, otherwise opening the typeahead deletes
		// the selected content (openTypeAheadAtCursor calls deleteSelection for non-cursor ranges).
		!(view.state.selection.empty && view.state.selection.from === reusableParagraphPosition)
	) {
		api.core.actions.execute(({ tr }) => {
			tr.setSelection(TextSelection.create(tr.doc, reusableParagraphPosition));
			return tr;
		});
	}

	const { codeBlock } = view.state.schema.nodes;
	const { selection } = view.state;
	const codeBlockParentNode = findParentNodeOfType(codeBlock)(selection);
	if (codeBlockParentNode) {
		api.core.actions.execute(createNewLine(codeBlockParentNode.pos));
	} else if (isSelectionInsideNode && reusableParagraphPosition === undefined) {
		const currentSelection = view.state.selection;

		if (
			(currentSelection instanceof TextSelection ||
				(currentSelection instanceof NodeSelection && currentSelection.node.isInline)) &&
			currentSelection.from !== currentSelection.to
		) {
			const currentParagraphNode = findParentNode((node) =>
				TEXT_PARENT_TYPES.includes(node.type.name),
			)(currentSelection);
			if (currentParagraphNode) {
				const newPos =
					currentSelection.anchor === currentSelection.to
						? currentParagraphNode.pos
						: currentParagraphNode.pos + currentParagraphNode.node.nodeSize - 1;
				api.core.actions.execute(({ tr }) => {
					tr.setSelection(TextSelection.create(view.state.selection.$from.doc, newPos));
					return tr;
				});
			}
		}

		if (currentSelection instanceof NodeSelection && currentSelection.$from.depth > 0) {
			if (isNonEditableBlock(view.state.selection.from, view)) {
				api.core.actions.execute(createNewLine(view.state.selection.from));
			} else {
				api.core.actions.execute(({ tr }) => {
					createNewLine(view.state.selection.from)({ tr });
					tr.setSelection(TextSelection.create(tr.doc, view.state.selection.from));
					return tr;
				});
			}
		}

		if (currentSelection instanceof CellSelection) {
			const lastInlinePosition = TextSelection.near(view.state.selection.$to, -1);
			if (lastInlinePosition) {
				api.core.actions.execute(({ tr }) => {
					if (!(lastInlinePosition instanceof TextSelection)) {
						createNewLine(lastInlinePosition.from)({ tr });
						tr.setSelection(TextSelection.create(tr.doc, lastInlinePosition.to));
					} else {
						tr.setSelection(lastInlinePosition);
					}
					return tr;
				});
			}
		}
	}

	openTypeAhead();
};

type Props = {
	api: ExtractInjectionAPI<QuickInsertPlugin>;
	openTypeAhead: () => void;
	reserveDragHandleSpace?: boolean;
	start: number;
	view: EditorView;
};

export const BlockControlQuickInsertButton = ({
	api,
	openTypeAhead,
	reserveDragHandleSpace = false,
	start,
	view,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const label = formatMessage(messages.insert);
	const handleMouseDown = useCallback(() => {
		if (api.typeAhead?.actions.isOpen(view.state)) {
			api.typeAhead.actions.close({ insertCurrentQueryAsRawText: false });
		}
	}, [api, view]);
	const handleClick = useCallback(() => {
		if (
			isExperimentEnabled('platform_editor_block_control_inp') &&
			openQuickInsertInSingleTransaction(api, start)
		) {
			return;
		}
		openQuickInsert(api, view, start, openTypeAhead);
	}, [api, openTypeAhead, start, view]);

	return (
		<Tooltip position="top" content={<ToolTipContent description={label} />}>
			<span
				css={[
					quickInsertButtonContainerStyles.root,
					reserveDragHandleSpace && quickInsertButtonContainerStyles.reservedDragHandleSpace,
				]}
			>
				<Pressable
					aria-label={label}
					onClick={handleClick}
					onMouseDown={handleMouseDown}
					testId="editor-quick-insert-button"
					type="button"
					xcss={quickInsertButtonStyles.root}
				>
					<AddIcon label="" color={token('color.icon.subtle')} size="small" />
				</Pressable>
			</span>
		</Tooltip>
	);
};
