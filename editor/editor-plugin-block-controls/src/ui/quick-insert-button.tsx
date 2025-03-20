import React, { useCallback, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';
import { type IntlShape } from 'react-intl-next';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AddIcon from '@atlaskit/icon/utility/add';
import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getTopPosition } from '../pm-plugins/utils/drag-handle-positions';
import { getLeftPositionForRootElement } from '../pm-plugins/utils/widget-positions';

import {
	rootElementGap,
	topPositionAdjustment,
	QUICK_INSERT_DIMENSIONS,
	QUICK_INSERT_LEFT_OFFSET,
} from './consts';
import {
	isNestedNodeSelected,
	isNonEditableBlock,
	isSelectionInNode,
} from './utils/document-checks';
import { createNewLine } from './utils/editor-commands';

const buttonStyles = xcss({
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
};

export const TypeAheadControl = ({
	view,
	api,
	formatMessage,
	getPos,
	rootAnchorName,
	rootNodeType,
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
	const calculatePosition = useCallback(() => {
		const supportsAnchor =
			CSS.supports('top', `anchor(${rootAnchorName} start)`) &&
			CSS.supports('left', `anchor(${rootAnchorName} start)`);
		const dom: HTMLElement | null = view.dom.querySelector(
			`[data-drag-handler-anchor-name="${rootAnchorName}"]`,
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

		if (supportsAnchor) {
			return {
				left: isEdgeCase
					? `calc(anchor(${rootAnchorName} start) + ${getLeftPositionForRootElement(dom, rootNodeType, QUICK_INSERT_DIMENSIONS, innerContainer, isMacroInteractionUpdates)} + -${QUICK_INSERT_LEFT_OFFSET}px)`
					: `calc(anchor(${rootAnchorName} start) - ${QUICK_INSERT_DIMENSIONS.width}px - ${rootElementGap(rootNodeType)}px + -${QUICK_INSERT_LEFT_OFFSET}px)`,

				top: `calc(anchor(${rootAnchorName} start) + ${topPositionAdjustment(rootNodeType)}px)`,
			};
		}

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
		};
	}, [rootAnchorName, view.dom, rootNodeType, macroInteractionUpdates]);

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
			if (!isSelectionInNode(start, view) || isNonEditableBlock(start, view)) {
				api.core.actions.execute(createNewLine(start));
			}

			if (isSelectionInNode(start, view) && isNestedNodeSelected(view)) {
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
		}

		api.quickInsert?.actions.openTypeAhead('blockControl');
	}, [api, getPos, view]);

	const handleMouseDown = useCallback(() => {
		// close typeahead if it is open, must happen in mouseDown otherwise typeAhead popup will be dismissed and text is left
		if (api.typeAhead?.actions.isOpen(view.state)) {
			api.typeAhead.actions.close({ insertCurrentQueryAsRawText: false });
		}
	}, [api, view.state]);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<Box style={positionStyles} xcss={[containerStaticStyles]}>
			<Tooltip
				position="top"
				content={<ToolTipContent description={formatMessage(messages.insert)} />}
			>
				<Pressable
					type="button"
					aria-label={formatMessage(messages.insert)}
					xcss={[buttonStyles]}
					onClick={handleQuickInsert}
					onMouseDown={handleMouseDown}
				>
					<AddIcon label="add" color={token('color.icon.subtle')} />
				</Pressable>
			</Tooltip>
		</Box>
	);
};
