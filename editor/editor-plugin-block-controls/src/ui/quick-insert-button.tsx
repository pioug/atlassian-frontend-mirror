/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type CSSProperties, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import { type IntlShape } from 'react-intl-next';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages as messages } from '@atlaskit/editor-common/messages';
import { tableControlsSpacing } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import AddIcon from '@atlaskit/icon/core/add';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { type AnchorRectCache } from '../pm-plugins/utils/anchor-utils';
import {
	getControlBottomCSSValue,
	getControlHeightCSSValue,
	getNodeHeight,
	getTopPosition,
	shouldBeSticky,
} from '../pm-plugins/utils/drag-handle-positions';
import { getLeftPositionForRootElement } from '../pm-plugins/utils/widget-positions';

import {
	rootElementGap,
	topPositionAdjustment,
	QUICK_INSERT_DIMENSIONS,
	QUICK_INSERT_LEFT_OFFSET,
} from './consts';
import { refreshAnchorName } from './utils/anchor-name';
import {
	isInTextSelection,
	isNestedNodeSelected,
	isNonEditableBlock,
	isSelectionInNode,
} from './utils/document-checks';
import { createNewLine } from './utils/editor-commands';
import { VisibilityContainer } from './visibility-container';

const TEXT_PARENT_TYPES = ['paragraph', 'heading', 'blockquote', 'taskItem', 'decisionItem'];

const stickyButtonStyles = xcss({
	top: '0',
	position: 'sticky',
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: token('space.300'),
	width: token('space.300'),
	border: 'none',
	backgroundColor: 'color.background.neutral.subtle',
	borderRadius: '50%',
	zIndex: 'card',
	outline: 'none',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},

	':focus': {
		outline: `2px solid ${token('color.border.focused', '#388BFF')}`,
	},
});

const containerStaticStyles = xcss({
	position: 'absolute',
	zIndex: 'card',
});

const tooltipContainerStyles = css({
	top: '8px',
	bottom: '-8px',
	position: 'sticky',
	display: 'block',
	zIndex: 'card',
});

const tooltipContainerStylesStickyHeader = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-blocks-quick-insert-container]:has(~ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: tableControlsSpacing,
		},
});

// We need this to work around adjacent breakout marks wrapping the controls widget decorations
const tooltipContainerStylesStickyHeaderWithMarksFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[data-prosemirror-mark-name="breakout"]:has([data-blocks-quick-insert-container]):has(~ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			top: tableControlsSpacing,
		},
});

// TODO: ED-26959 - Share prop types between DragHandle - generic enough to create a type for block control decoration
type Props = {
	view: EditorView;
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	formatMessage: IntlShape['formatMessage'];
	getPos: () => number | undefined;
	nodeType: string;
	anchorName: string;
	rootAnchorName?: string;
	rootNodeType: string;
	anchorRectCache?: AnchorRectCache;
};

export const TypeAheadControl = ({
	view,
	api,
	formatMessage,
	getPos,
	nodeType,
	anchorName,
	rootAnchorName,
	rootNodeType,
	anchorRectCache,
}: Props) => {
	const macroInteractionUpdates = useSharedPluginStateSelector(
		api,
		'featureFlags.macroInteractionUpdates',
	);

	const [positionStyles, setPositionStyles] = useState<React.CSSProperties>({ display: 'none' });

	// Adapted from `src/ui/drag-handle.tsx` as positioning logic is similar
	// CHANGES - added an offset so quick insert button can be positioned beside drag handle
	// CHANGES - removed `editorExperiment('nested-dnd', true)` check and rootNodeType calculation
	// CHANGES - replace anchorName with rootAnchorName
	// CHANGES - `removed editorExperiment('advanced_layouts', true) && isLayoutColumn` checks as quick insert button will not be positioned for layout column
	const calculatePosition = useCallback((): CSSProperties => {
		const supportsAnchor =
			CSS.supports('top', `anchor(${rootAnchorName} start)`) &&
			CSS.supports('left', `anchor(${rootAnchorName} start)`);

		const safeAnchorName = refreshAnchorName({ getPos, view, anchorName: rootAnchorName });

		const dom: HTMLElement | null = view.dom.querySelector(
			`[data-drag-handler-anchor-name="${safeAnchorName}"]`,
		);

		const hasResizer = rootNodeType === 'table' || rootNodeType === 'mediaSingle';
		const isExtension = rootNodeType === 'extension' || rootNodeType === 'bodiedExtension';
		const isBlockCard = rootNodeType === 'blockCard';
		const isEmbedCard = rootNodeType === 'embedCard';

		const isMacroInteractionUpdates = macroInteractionUpdates && isExtension;

		let innerContainer: HTMLElement | null = null;
		if (dom) {
			if (isEmbedCard) {
				innerContainer = dom.querySelector('.rich-media-item');
			} else if (hasResizer) {
				innerContainer = dom.querySelector('.resizer-item');
			} else if (isExtension) {
				innerContainer = dom.querySelector('.extension-container[data-layout]');
			} else if (isBlockCard) {
				//specific to datasource blockCard
				innerContainer = dom.querySelector('.datasourceView-content-inner-wrap');
			}
		}

		const isEdgeCase = (hasResizer || isExtension || isEmbedCard || isBlockCard) && innerContainer;
		const isSticky = shouldBeSticky(rootNodeType);
		const bottom = getControlBottomCSSValue(safeAnchorName || anchorName, isSticky, true);

		if (supportsAnchor) {
			return {
				left: isEdgeCase
					? `calc(anchor(${safeAnchorName} start) + ${getLeftPositionForRootElement(dom, rootNodeType, QUICK_INSERT_DIMENSIONS, innerContainer, isMacroInteractionUpdates)} + -${QUICK_INSERT_LEFT_OFFSET}px)`
					: `calc(anchor(${safeAnchorName} start) - ${QUICK_INSERT_DIMENSIONS.width}px - ${rootElementGap(rootNodeType)}px + -${QUICK_INSERT_LEFT_OFFSET}px)`,

				top: `calc(anchor(${safeAnchorName} start) + ${topPositionAdjustment(rootNodeType)}px)`,
				...bottom,
			} as CSSProperties;
		}

		// expensive, calls offsetHeight
		const nodeHeight = getNodeHeight(dom, safeAnchorName || anchorName, anchorRectCache) || 0;

		const height = getControlHeightCSSValue(nodeHeight, isSticky, true, token('space.300'));

		return {
			left: isEdgeCase
				? `calc(${dom?.offsetLeft || 0}px + ${getLeftPositionForRootElement(dom, rootNodeType, QUICK_INSERT_DIMENSIONS, innerContainer, isMacroInteractionUpdates)} + -${QUICK_INSERT_LEFT_OFFSET}px)`
				: `calc(${getLeftPositionForRootElement(
						dom,
						rootNodeType,
						QUICK_INSERT_DIMENSIONS,
						innerContainer,
						isMacroInteractionUpdates,
					)} + -${QUICK_INSERT_LEFT_OFFSET}px)`,
			top: getTopPosition(dom, rootNodeType),
			...height,
		} as CSSProperties;
	}, [
		rootAnchorName,
		getPos,
		view,
		rootNodeType,
		macroInteractionUpdates,
		anchorName,
		anchorRectCache,
	]);

	useEffect(() => {
		let cleanUpTransitionListener: () => void;

		if (rootNodeType === 'extension' || rootNodeType === 'embedCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[data-drag-handler-anchor-name="${rootAnchorName}"]`,
			);
			if (!dom) {
				return;
			}
			cleanUpTransitionListener = bind(dom, {
				type: 'transitionend',
				listener: () => {
					setPositionStyles(calculatePosition());
				},
			});
		}

		const calcPos = requestAnimationFrame(() => {
			setPositionStyles(calculatePosition());
		});

		return () => {
			cancelAnimationFrame(calcPos);
			cleanUpTransitionListener?.();
		};
	}, [calculatePosition, view.dom, rootAnchorName, rootNodeType]);

	const handleQuickInsert = useCallback(() => {
		// if the selection is not within the node this decoration is rendered at
		// then insert a newline and trigger quick insert
		const start = getPos();

		if (start !== undefined) {
			// if the selection is not within the node this decoration is rendered at
			// or the node is non-editable, then insert a newline and trigger quick insert
			const isSelectionInsideNode = isSelectionInNode(start, view);

			if (!isSelectionInsideNode || isNonEditableBlock(start, view)) {
				api.core.actions.execute(createNewLine(start));
			}

			const { codeBlock } = view.state.schema.nodes;
			const { selection } = view.state;
			const codeBlockParentNode = findParentNodeOfType(codeBlock)(selection);
			if (codeBlockParentNode) {
				// Slash command is not meant to be triggered inside code block, hence always insert slash in a new line following
				api.core.actions.execute(createNewLine(codeBlockParentNode.pos));
			} else if (isSelectionInsideNode) {
				// text or element with be deselected and the / added immediately after the paragraph
				// unless the selection is empty
				const currentSelection = view.state.selection;

				if (isInTextSelection(view) && currentSelection.from !== currentSelection.to) {
					const currentParagraphNode = findParentNode((node) =>
						TEXT_PARENT_TYPES.includes(node.type.name),
					)(currentSelection);

					if (currentParagraphNode) {
						const newPos =
							//if the current selection is selected from right to left, then set the selection to the start of the paragraph
							currentSelection.anchor === currentSelection.to
								? currentParagraphNode.pos
								: currentParagraphNode.pos + currentParagraphNode.node.nodeSize - 1;

						api.core.actions.execute(({ tr }) => {
							tr.setSelection(TextSelection.create(view.state.selection.$from.doc, newPos));
							return tr;
						});
					}
				}

				if (isNestedNodeSelected(view)) {
					// if the nested selected node is non-editable, then insert a newline below the selected node
					if (isNonEditableBlock(view.state.selection.from, view)) {
						api.core.actions.execute(createNewLine(view.state.selection.from));
					} else {
						// otherwise need to force the selection to be at the start of the node, because
						// prosemirror is keeping it as NodeSelection for nested nodes. Do this to keep it
						// consistent NodeSelection for root level nodes.
						api.core.actions.execute(({ tr }) => {
							createNewLine(view.state.selection.from)({ tr });
							tr.setSelection(TextSelection.create(tr.doc, view.state.selection.from));
							return tr;
						});
					}
				}

				if (currentSelection instanceof CellSelection) {
					// find the last inline position in the selection
					const lastInlinePosition = TextSelection.near(view.state.selection.$to, -1);

					lastInlinePosition &&
						api.core.actions.execute(({ tr }) => {
							if (!(lastInlinePosition instanceof TextSelection)) {
								// this will create a new line after the node
								createNewLine(lastInlinePosition.from)({ tr });
								// this will find the next valid text position after the node
								tr.setSelection(TextSelection.create(tr.doc, lastInlinePosition.to));
							} else {
								tr.setSelection(lastInlinePosition);
							}
							return tr;
						});
				}
			}
		}

		api.quickInsert?.actions.openTypeAhead('blockControl', true);
	}, [api, getPos, view]);

	const handleMouseDown = useCallback(() => {
		// close typeahead if it is open, must happen in mouseDown otherwise typeAhead popup will be dismissed and text is left
		if (api.typeAhead?.actions.isOpen(view.state)) {
			api.typeAhead.actions.close({ insertCurrentQueryAsRawText: false });
		}
	}, [api, view.state]);

	const tooltipPressable = () => (
		<Tooltip
			position="top"
			content={<ToolTipContent description={formatMessage(messages.insert)} />}
		>
			<Pressable
				testId="editor-quick-insert-button"
				type="button"
				aria-label={formatMessage(messages.insert)}
				xcss={[stickyButtonStyles]}
				onClick={handleQuickInsert}
				onMouseDown={handleMouseDown}
			>
				<AddIcon label="add" color={token('color.icon.subtle')} size="small" />
			</Pressable>
		</Tooltip>
	);

	return (
		<Box
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={positionStyles}
			xcss={[containerStaticStyles]}
		>
			<span
				css={[
					tooltipContainerStyles,
					tooltipContainerStylesStickyHeader,
					tooltipContainerStylesStickyHeaderWithMarksFix,
				]}
			>
				{tooltipPressable()}
			</span>
		</Box>
	);
};

export const QuickInsertWithVisibility = ({
	view,
	api,
	formatMessage,
	getPos,
	nodeType,
	anchorName,
	rootAnchorName,
	rootNodeType,
	anchorRectCache,
}: Props) => {
	return (
		<VisibilityContainer api={api}>
			<TypeAheadControl
				view={view}
				api={api}
				formatMessage={formatMessage}
				getPos={getPos}
				nodeType={nodeType}
				anchorName={anchorName}
				rootAnchorName={rootAnchorName}
				rootNodeType={rootNodeType}
				anchorRectCache={anchorRectCache}
			/>
		</VisibilityContainer>
	);
};
