import { type IntlShape } from 'react-intl-next';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { blockControlsMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { VanillaTooltip } from '@atlaskit/editor-common/vanilla-tooltip';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import {
	isInTextSelection,
	isNestedNodeSelected,
	isNonEditableBlock,
	isSelectionInNode,
} from '../ui/utils/document-checks';
import { createNewLine } from '../ui/utils/editor-commands';

import { calculatePosition } from './quick-insert-calculate-position';
import { type AnchorRectCache } from './utils/anchor-utils';

type VanillaQuickInsertProps = {
	anchorName: string;
	anchorRectCache?: AnchorRectCache;
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	cleanupCallbacks: ((() => void) | undefined)[];
	formatMessage: IntlShape['formatMessage'];
	getPos: () => number | undefined;
	rootAnchorName: string;
	rootNodeType: string;
	view: EditorView;
};

// Based on platform/packages/design-system/icon/svgs/utility/add.svg
const plusButtonDOM: DOMOutputSpec = [
	'http://www.w3.org/2000/svg svg',
	{
		width: '12',
		height: '12',
		fill: 'none',
		viewBox: '0 0 12 12',
		style: 'pointer-events: none;',
	},
	[
		'http://www.w3.org/2000/svg path',
		{
			fill: 'currentcolor',
			'fill-rule': 'evenodd',
			d: 'M5.25 6.75V11h1.5V6.75H11v-1.5H6.75V1h-1.5v4.25H1v1.5z',
			'clip-rule': 'evenodd',
			style: 'pointer-events: none;',
		},
	],
];

const vanillaQuickInsert = ({
	view,
	getPos,
	rootNodeType,
	anchorRectCache,
	anchorName,
	rootAnchorName,
	api,
}: VanillaQuickInsertProps): DOMOutputSpec => [
	'div',
	{
		style: convertToInlineCss({
			position: 'absolute',
			...calculatePosition({
				rootAnchorName,
				anchorName,
				view,
				getPos,
				rootNodeType: rootNodeType,
				macroInteractionUpdates:
					api?.featureFlags?.sharedState.currentState()?.macroInteractionUpdates ?? false,
				anchorRectCache,
			}),
		}),
	},
	[
		'button',
		{
			class: 'blocks-quick-insert-button',
			'data-testid': 'editor-quick-insert-button',
		},
		plusButtonDOM,
	],
];

/**
 * Create a Node which contains the quick insert button
 */
export const createVanillaButton = (props: VanillaQuickInsertProps): Node => {
	const { dom } = DOMSerializer.renderSpec(document, vanillaQuickInsert(props));

	if (dom instanceof HTMLElement) {
		const button = dom.querySelector('button[data-testid="editor-quick-insert-button"]');
		if (button instanceof HTMLButtonElement) {
			button.onclick = () => handleQuickInsert(props);

			const tooltip = new VanillaTooltip(
				button,
				props.formatMessage(messages.insert),
				'quick-insert-button-tooltip',
				'blocks-quick-insert-tooltip',
			);
			props.cleanupCallbacks.push(() => {
				tooltip.destroy();
			});
		}
	}

	// Dynamically control the visibility of the node
	let isTypeAheadOpen = props.api.typeAhead?.sharedState.currentState()?.isOpen;
	let isEditing = props.api.blockControls?.sharedState.currentState()?.isEditing;

	const changeDOMVisibility = () => {
		if (!(dom instanceof HTMLElement)) {
			return;
		}
		if (isTypeAheadOpen || isEditing) {
			dom.classList.add('blocks-quick-insert-invisible-container');
			dom.classList.remove('blocks-quick-insert-visible-container');
		} else {
			dom.classList.add('blocks-quick-insert-visible-container');
			dom.classList.remove('blocks-quick-insert-invisible-container');
		}
	};

	changeDOMVisibility();
	props.cleanupCallbacks.push(
		props.api.typeAhead?.sharedState.onChange(({ nextSharedState }) => {
			isTypeAheadOpen = nextSharedState?.isOpen;
			changeDOMVisibility();
		}),
	);
	props.cleanupCallbacks.push(
		props.api.blockControls?.sharedState.onChange(({ nextSharedState }) => {
			isEditing = nextSharedState?.isEditing;
			changeDOMVisibility();
		}),
	);
	return dom;
};

const TEXT_PARENT_TYPES = ['paragraph', 'heading', 'blockquote', 'taskItem', 'decisionItem'];

const handleQuickInsert = ({ api, view, getPos }: VanillaQuickInsertProps) => {
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
};
