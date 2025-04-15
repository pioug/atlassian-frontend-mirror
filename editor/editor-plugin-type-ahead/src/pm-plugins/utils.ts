import type { IntlShape } from 'react-intl-next';

import { TypeAheadAvailableNodes, typeAheadListMessages } from '@atlaskit/editor-common/type-ahead';
import { type ExtractInjectionAPI, type TypeAheadItem } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type TypeAheadPlugin } from '../typeAheadPluginType';
import type { TypeAheadHandler } from '../types';

import { updateSelectedIndex } from './commands/update-selected-index';
import { itemIsDisabled } from './item-is-disabled';
import { pluginKey as typeAheadPluginKey } from './key';
import { StatsModifier } from './stats-modifier';

export const isTypeAheadHandler = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handler: any,
): handler is TypeAheadHandler => {
	return (
		handler &&
		Object.values(TypeAheadAvailableNodes).includes(handler.id) &&
		typeof handler.trigger === 'string' &&
		typeof handler.selectItem === 'function' &&
		typeof handler.getItems === 'function'
	);
};

/** Is a typeahead plugin open? */
export const isTypeAheadOpen = (editorState: EditorState) => {
	return !!typeAheadPluginKey?.getState(editorState)?.decorationSet?.find().length;
};

export const getPluginState = (editorState: EditorState) => {
	return typeAheadPluginKey.getState(editorState);
};

export const getTypeAheadHandler = (editorState: EditorState) => {
	return typeAheadPluginKey.getState(editorState)?.triggerHandler;
};

export const getTypeAheadQuery = (editorState: EditorState) => {
	return typeAheadPluginKey.getState(editorState)?.query;
};

export const isTypeAheadAllowed = (state: EditorState) => {
	const isOpen = isTypeAheadOpen(state);
	// if the TypeAhead is open
	// we should not allow it
	return !isOpen;
};

export const findHandler = (id: string, state: EditorState): TypeAheadHandler | null => {
	const pluginState = typeAheadPluginKey.getState(state);

	if (
		!pluginState ||
		!pluginState.typeAheadHandlers ||
		pluginState.typeAheadHandlers.length === 0
	) {
		return null;
	}

	const { typeAheadHandlers } = pluginState;

	return typeAheadHandlers.find((h: TypeAheadHandler) => h.id === id) || null;
};

export const skipForwardToSafeItem = ({
	currentIndex,
	nextIndex,
	listSize,
	itemIsDisabled,
}: {
	currentIndex: number;
	nextIndex: number;
	listSize: number;
	itemIsDisabled: (idx: number) => boolean;
}): number => {
	// Use a loop to find the next selectable item
	for (let idx = nextIndex; idx < listSize; idx++) {
		if (!itemIsDisabled(idx)) {
			return idx;
		}
	}

	// We got to the end of the list ^, now try from the start
	if (editorExperiment('platform_editor_offline_editing_web', true)) {
		for (let idx = 0; idx < nextIndex; idx++) {
			if (!itemIsDisabled(idx)) {
				return idx;
			}
		}
	}

	// If no selectable items are found, return currentIndex
	return currentIndex;
};

export const skipBackwardToSafeItem = ({
	currentIndex,
	nextIndex,
	listSize,
	itemIsDisabled,
}: {
	currentIndex: number;
	nextIndex: number;
	listSize: number;
	itemIsDisabled: (idx: number) => boolean;
}): number => {
	// Use a loop to find the next non-selectable item when going backwards
	for (let idx = nextIndex; idx >= 0; idx--) {
		if (!itemIsDisabled(idx)) {
			return idx;
		}
	}

	// We got to the start of the list ^, now try from the end
	if (editorExperiment('platform_editor_offline_editing_web', true)) {
		for (let idx = listSize; idx > nextIndex; idx--) {
			if (!itemIsDisabled(idx)) {
				return idx;
			}
		}
	}
	// If no non-selectable items are found, return currentIndex
	return currentIndex;
};

export const findHandlerByTrigger = ({
	trigger,
	editorState,
}: {
	trigger: string;
	editorState: EditorState;
}): TypeAheadHandler | null => {
	const pluginState = typeAheadPluginKey.getState(editorState);

	if (
		!pluginState ||
		!pluginState.typeAheadHandlers ||
		pluginState.typeAheadHandlers.length === 0
	) {
		return null;
	}

	const { typeAheadHandlers } = pluginState;

	return typeAheadHandlers.find((h: TypeAheadHandler) => h.trigger === trigger) || null;
};

type MoveSelectedIndexProps = {
	editorView: EditorView;
	direction: 'next' | 'previous';
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
};
export const moveSelectedIndex =
	({ editorView, direction, api }: MoveSelectedIndexProps) =>
	() => {
		const typeAheadState = getPluginState(editorView.state);
		if (!typeAheadState) {
			return;
		}
		const { selectedIndex, items } = typeAheadState;
		const stats =
			typeAheadState.stats instanceof StatsModifier ? typeAheadState.stats : new StatsModifier();

		let nextIndex;

		const isDisabled = (idx: number) => itemIsDisabled(items[idx], api);
		if (direction === 'next') {
			stats.increaseArrowDown();

			/**
			 * See: https://product-fabric.atlassian.net/browse/ED-17200
			 * `selectedIndex` is forced to -1 now to not immediately focus the typeahead
			 * and only do so when there is explicit logic to focus into the typeahead
			 * options.
			 *
			 * This check for "set index to 1 when -1"
			 * - is a temporary workaround to get back the previous behaviour without
			 *    entirely reverting the a11y improvements
			 *
			 */
			if (selectedIndex === -1 && items.length > 1) {
				// If the first item is disabled we actually want to skip to the 3rd item
				// on the first arrow down
				nextIndex = isDisabled(0) && items.length > 2 ? 2 : 1;
			} else {
				nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
			}
			nextIndex = skipForwardToSafeItem({
				currentIndex: selectedIndex,
				nextIndex,
				listSize: items.length,
				itemIsDisabled: isDisabled,
			});
		} else {
			stats.increaseArrowUp();
			nextIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
			nextIndex = skipBackwardToSafeItem({
				currentIndex: selectedIndex,
				nextIndex,
				listSize: items.length,
				itemIsDisabled: isDisabled,
			});
		}

		updateSelectedIndex(nextIndex, api)(editorView.state, editorView.dispatch);
	};

type TypeAheadAssistiveLabels = {
	popupAriaLabel: string;
	listItemAriaLabel?: string;
};

export const getTypeAheadListAriaLabels = (
	trigger: string | undefined,
	intl: IntlShape,
	item?: TypeAheadItem,
): TypeAheadAssistiveLabels => {
	switch (trigger) {
		case '@':
			return {
				popupAriaLabel: intl.formatMessage(typeAheadListMessages.mentionPopupLabel),
				listItemAriaLabel: intl.formatMessage(typeAheadListMessages.metionListItemLabel, {
					name: item?.mention?.name || '',
					shortName: item?.mention?.mentionName || '',
				}),
			};
		case '/':
			return {
				popupAriaLabel: intl.formatMessage(typeAheadListMessages.quickInsertPopupLabel),
				listItemAriaLabel: intl.formatMessage(typeAheadListMessages.emojiListItemLabel, {
					name: item?.title || '',
					shortcut: item?.emoji?.shortName || '',
				}),
			};
		case ':':
			return {
				popupAriaLabel: intl.formatMessage(typeAheadListMessages.emojiPopupLabel),
				listItemAriaLabel: intl.formatMessage(typeAheadListMessages.emojiListItemLabel, {
					name: item?.emoji?.name || '',
					shortcut: item?.emoji?.shortName || '',
				}),
			};
		default:
			return {
				popupAriaLabel: intl.formatMessage(typeAheadListMessages.typeAheadPopupLabel),
			};
	}
};
