import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	HeadingLevels,
	HeadingLevelsAndNormalText,
} from '@atlaskit/editor-common/types';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { BlockTypePlugin } from '../blockTypePluginType';

import {
	BLOCK_QUOTE,
	CODE_BLOCK,
	HEADING_1,
	HEADING_2,
	HEADING_3,
	HEADING_4,
	HEADING_5,
	HEADING_6,
	HEADINGS_BY_LEVEL,
	NORMAL_TEXT,
	OTHER,
	PANEL,
	TEXT_BLOCK_TYPES,
	WRAPPER_BLOCK_TYPES,
	getBlockTypesInDropdown,
} from './block-types';
import { setHeadingWithAnalytics, setNormalTextWithAnalytics } from './commands/block-type';
import { HEADING_KEYS, HEADING_NUMPAD_KEYS } from './consts';
import type { BlockType } from './types';
import { areBlockTypesDisabled, checkFormattingIsPresent, hasBlockQuoteInOptions } from './utils';

export type BlockTypeState = {
	availableBlockTypes: BlockType[];
	availableBlockTypesInDropdown: BlockType[];
	availableWrapperBlockTypes: BlockType[];
	blockTypesDisabled: boolean;
	currentBlockType: BlockType;
	formattingIsPresent?: boolean;
};

const blockTypeForNode = (node: Node, schema: Schema): BlockType => {
	if (node.type === schema.nodes.heading) {
		const maybeNode = HEADINGS_BY_LEVEL[node.attrs['level'] as keyof typeof HEADINGS_BY_LEVEL];
		if (maybeNode) {
			return maybeNode;
		}
	} else if (node.type === schema.nodes.paragraph) {
		return NORMAL_TEXT;
	} else if (node.type === schema.nodes.blockquote) {
		return BLOCK_QUOTE;
	}
	return OTHER;
};

const isBlockTypeSchemaSupported = (blockType: BlockType, state: EditorState) => {
	switch (blockType) {
		case NORMAL_TEXT:
			return !!state.schema.nodes.paragraph;
		case HEADING_1:
		case HEADING_2:
		case HEADING_3:
		case HEADING_4:
		case HEADING_5:
		case HEADING_6:
			return !!state.schema.nodes.heading;
		case BLOCK_QUOTE:
			return !!state.schema.nodes.blockquote;
		case CODE_BLOCK:
			return !!state.schema.nodes.codeBlock;
		case PANEL:
			return !!state.schema.nodes.panel;
	}
	return;
};

const detectBlockType = (availableBlockTypes: BlockType[], state: EditorState): BlockType => {
	// Before a document is loaded, there is no selection.
	if (!state.selection) {
		return NORMAL_TEXT;
	}
	let blockType: BlockType | undefined;
	const { $from, $to } = state.selection;
	state.doc.nodesBetween($from.pos, $to.pos, (node) => {
		const nodeBlockType = availableBlockTypes.filter(
			(blockType) => blockType === blockTypeForNode(node, state.schema),
		);
		if (nodeBlockType.length > 0) {
			if (!blockType) {
				blockType = nodeBlockType[0];
			} else if (blockType !== OTHER && blockType !== nodeBlockType[0]) {
				blockType = OTHER;
			}
			return false;
		}
	});
	return blockType || OTHER;
};

const autoformatHeading = (
	headingLevel: HeadingLevelsAndNormalText,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): EditorCommand => {
	if (headingLevel === 0) {
		return setNormalTextWithAnalytics(INPUT_METHOD.FORMATTING, editorAnalyticsApi);
	}
	return setHeadingWithAnalytics(
		headingLevel as HeadingLevels,
		INPUT_METHOD.FORMATTING,
		editorAnalyticsApi,
	);
};

export const pluginKey = new PluginKey<BlockTypeState>('blockTypePlugin');
export const createPlugin = (
	editorAPI: ExtractInjectionAPI<BlockTypePlugin> | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dispatch: (eventName: string | PluginKey, data: any) => void,
	lastNodeMustBeParagraph?: boolean,
	includeBlockQuoteAsTextstyleOption?: boolean,
) => {
	const editorAnalyticsApi = editorAPI?.analytics?.actions;
	let altKeyLocation = 0;

	return new SafePlugin({
		appendTransaction(
			_transactions: readonly Transaction[],
			_oldState: EditorState,
			newState: EditorState,
		) {
			if (lastNodeMustBeParagraph) {
				const pos = newState.doc.resolve(newState.doc.content.size - 1);
				const lastNode = pos.node(1);
				const { paragraph } = newState.schema.nodes;
				if (lastNode && lastNode.isBlock && lastNode.type !== paragraph) {
					if (fg('platform_editor_fix_insert_paragraph_undo')) {
						return newState.tr.insert(
							newState.doc.content.size,
							newState.schema.nodes.paragraph.create(),
						);
					} else {
						return newState.tr
							.insert(newState.doc.content.size, newState.schema.nodes.paragraph.create())
							.setMeta('addToHistory', false);
					}
				}
			}
		},

		state: {
			init(_config, state: EditorState) {
				const availableBlockTypes = TEXT_BLOCK_TYPES.filter((blockType) =>
					isBlockTypeSchemaSupported(blockType, state),
				);
				const availableWrapperBlockTypes = WRAPPER_BLOCK_TYPES.filter((blockType) =>
					isBlockTypeSchemaSupported(blockType, state),
				);
				const BLOCK_TYPES_IN_DROPDOWN = getBlockTypesInDropdown(includeBlockQuoteAsTextstyleOption);
				const availableBlockTypesInDropdown = BLOCK_TYPES_IN_DROPDOWN.filter((blockType) =>
					isBlockTypeSchemaSupported(blockType, state),
				);

				const formattingIsPresent = hasBlockQuoteInOptions(availableBlockTypesInDropdown)
					? checkFormattingIsPresent(state)
					: undefined;

				return {
					currentBlockType: detectBlockType(availableBlockTypesInDropdown, state),
					blockTypesDisabled: areBlockTypesDisabled(state),
					availableBlockTypes,
					availableWrapperBlockTypes,
					availableBlockTypesInDropdown,
					formattingIsPresent,
				};
			},

			apply(_tr, oldPluginState: BlockTypeState, _oldState: EditorState, newState: EditorState) {
				const newPluginState = {
					...oldPluginState,
					currentBlockType: detectBlockType(oldPluginState.availableBlockTypesInDropdown, newState),
					blockTypesDisabled: areBlockTypesDisabled(newState),
					formattingIsPresent: hasBlockQuoteInOptions(oldPluginState.availableBlockTypesInDropdown)
						? checkFormattingIsPresent(newState)
						: undefined,
				};

				if (
					newPluginState.currentBlockType !== oldPluginState.currentBlockType ||
					newPluginState.blockTypesDisabled !== oldPluginState.blockTypesDisabled ||
					newPluginState.formattingIsPresent !== oldPluginState.formattingIsPresent
				) {
					dispatch(pluginKey, newPluginState);
				}

				return newPluginState;
			},
		},

		key: pluginKey,

		props: {
			/**
			 * As we only want the left alt key to work for headings shortcuts on Windows
			 * we can't use prosemirror-keymap and need to handle these shortcuts specially
			 * Shortcut on Mac: Cmd-Opt-{heading level}
			 * Shortcut on Windows: Ctrl-LeftAlt-{heading level}
			 */
			handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
				let headingLevel = HEADING_KEYS.indexOf(event.keyCode);
				if (headingLevel === -1) {
					// Check for numpad keys if not found in digits row
					headingLevel = HEADING_NUMPAD_KEYS.indexOf(event.keyCode);
				}

				const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
					? getBrowserInfo()
					: browserLegacy;

				if (headingLevel > -1 && event.altKey) {
					if (browser.mac && event.metaKey) {
						return (
							editorAPI?.core?.actions.execute(
								autoformatHeading(headingLevel as HeadingLevels, editorAnalyticsApi),
							) ?? false
						);
					} else if (
						!browser.mac &&
						event.ctrlKey &&
						altKeyLocation !== event.DOM_KEY_LOCATION_RIGHT
					) {
						return (
							editorAPI?.core?.actions.execute(
								autoformatHeading(headingLevel as HeadingLevels, editorAnalyticsApi),
							) ?? false
						);
					}
				} else if (event.key === 'Alt') {
					// event.location is for the current key only; when a user hits Ctrl-Alt-1 the
					// location refers to the location of the '1' key
					// We store the location of the Alt key when it is hit to check against later
					altKeyLocation = event.location;
				} else if (!event.altKey) {
					altKeyLocation = 0;
				}

				return false;
			},
		},
	});
};
