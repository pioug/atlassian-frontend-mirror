import { InsertTypeAheadStages, InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type {
	CreateTypeAheadDecorations,
	PopupMountPointReference,
	RemoveTypeAheadDecorations,
	TypeAheadHandler,
	TypeAheadInputMethod,
	TypeAheadPluginState,
} from '../types';

import { ACTIONS } from './actions';
import { pluginKey } from './key';
import { isTypeAheadHandler } from './utils';

export type ReducerOptions = {
	popupMountRef: PopupMountPointReference;
	createDecorations: CreateTypeAheadDecorations;
	removeDecorations: RemoveTypeAheadDecorations;
	typeAheadHandlers: Array<TypeAheadHandler>;
};

const shouldForceOpen = (step: InsertTypeAheadStep | null): boolean => {
	if (!(step instanceof InsertTypeAheadStep)) {
		return false;
	}

	const isDeletionRawQueryOperation =
		step.isInsertionStep() && step.stage === InsertTypeAheadStages.DELETING_RAW_QUERY;
	const isUndoingInsertionItem =
		step.isUndoingStep() && step.stage === InsertTypeAheadStages.INSERTING_ITEM;

	return isDeletionRawQueryOperation || isUndoingInsertionItem;
};

const shouldForceClose = (step: InsertTypeAheadStep | null): boolean => {
	if (!(step instanceof InsertTypeAheadStep)) {
		return false;
	}

	const isInsertingItem =
		step.isInsertionStep() && step.stage === InsertTypeAheadStages.INSERTING_ITEM;
	const isUndoingDeletionRawQuery =
		step.isUndoingStep() && step.stage === InsertTypeAheadStages.DELETING_RAW_QUERY;

	return isInsertingItem || isUndoingDeletionRawQuery;
};

const createFindHandler =
	(typeAheadHandlers: Array<TypeAheadHandler>) =>
	(step: InsertTypeAheadStep | null): TypeAheadHandler | null => {
		if (!(step instanceof InsertTypeAheadStep)) {
			return null;
		}
		const handler = typeAheadHandlers.find((h) => h.trigger === step.trigger);

		return handler || null;
	};

export const createReducer = ({
	typeAheadHandlers,
	removeDecorations,
	createDecorations,
}: ReducerOptions) => {
	const findHandler = createFindHandler(typeAheadHandlers);

	type OpenMenuProps = {
		tr: ReadonlyTransaction;
		triggerHandler: TypeAheadHandler;
		inputMethod: TypeAheadInputMethod;
		reopenQuery?: string;
		selectedIndex?: number;
		removePrefixTriggerOnCancel?: boolean;
	};
	const openMenu = (
		currentPluginState: TypeAheadPluginState,
		{
			tr,
			triggerHandler,
			inputMethod,
			reopenQuery,
			selectedIndex,
			removePrefixTriggerOnCancel,
		}: OpenMenuProps,
	): TypeAheadPluginState => {
		removeDecorations(currentPluginState.decorationSet);
		const { decorationSet, decorationElement, stats } = createDecorations(tr, {
			triggerHandler,
			inputMethod,
			reopenQuery,
		});
		return {
			...currentPluginState,
			stats,
			decorationSet,
			triggerHandler,
			decorationElement,
			inputMethod,
			selectedIndex: typeof selectedIndex === 'number' ? selectedIndex : -1,
			items: [],
			query: reopenQuery || '',
			removePrefixTriggerOnCancel,
		};
	};

	const closeMenu = (currentPluginState: TypeAheadPluginState): TypeAheadPluginState => {
		removeDecorations(currentPluginState.decorationSet);
		return {
			...currentPluginState,
			inputMethod: null,
			query: '',
			decorationElement: null,
			decorationSet: DecorationSet.empty,
			stats: null,
			triggerHandler: undefined,
			items: [],
			removePrefixTriggerOnCancel: undefined,
		};
	};

	return (
		tr: ReadonlyTransaction,
		currentPluginState: TypeAheadPluginState,
		typeAheadStepOverride: InsertTypeAheadStep | null,
	): TypeAheadPluginState => {
		const meta = tr.getMeta(pluginKey) || {};

		// This code below controls when we should force
		// the menu to open or close during undo/redo operations
		const overrideHandler = findHandler(typeAheadStepOverride);
		if (typeAheadStepOverride && overrideHandler && shouldForceOpen(typeAheadStepOverride)) {
			return openMenu(currentPluginState, {
				tr,
				triggerHandler: overrideHandler,
				inputMethod: INPUT_METHOD.KEYBOARD,
				reopenQuery: typeAheadStepOverride.query,
				selectedIndex: typeAheadStepOverride.selectedIndex,
			});
		} else if (shouldForceClose(typeAheadStepOverride)) {
			return closeMenu(currentPluginState);
		}

		const { action, params } = meta || {};
		const shouldOpenMenu =
			action === ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR && isTypeAheadHandler(params?.triggerHandler);

		const selectionChanged = tr.selectionSet && (tr.isGeneric || Boolean(tr.getMeta('pointer')));
		const shouldCloseMenu =
			[ACTIONS.CLOSE_TYPE_AHEAD, ACTIONS.INSERT_ITEM].includes(action) || selectionChanged;

		const shouldUpdateQuery = action === ACTIONS.CHANGE_QUERY;
		const shouldUpdateListItems = action === ACTIONS.UPDATE_LIST_ITEMS;
		const shouldUpdateListError = action === ACTIONS.UPDATE_LIST_ERROR;
		const shouldUpdateSelectedIndex = action === ACTIONS.UPDATE_SELECTED_INDEX;
		const shouldClearListError = action === ACTIONS.CLEAR_LIST_ERROR;

		if (shouldOpenMenu) {
			return openMenu(currentPluginState, {
				tr,
				triggerHandler: params.triggerHandler,
				inputMethod: params.inputMethod,
				reopenQuery: params.query,
				removePrefixTriggerOnCancel: params.removePrefixTriggerOnCancel,
			});
		} else if (shouldCloseMenu) {
			return closeMenu(currentPluginState);
		} else if (shouldUpdateQuery) {
			return {
				...currentPluginState,
				query: params.query,
			};
		} else if (shouldUpdateListError) {
			const { errorInfo } = params;

			return {
				...currentPluginState,
				errorInfo,
				items: [],
				selectedIndex: -1,
			};
		} else if (shouldUpdateListItems) {
			const { items } = params;
			const { selectedIndex } = currentPluginState;

			return {
				...currentPluginState,
				items,
				selectedIndex: Math.max(
					selectedIndex >= items.length ? items.length - 1 : selectedIndex,
					-1,
				),
			};
		} else if (shouldUpdateSelectedIndex) {
			return {
				...currentPluginState,
				selectedIndex: params.selectedIndex,
			};
		} else if (shouldClearListError) {
			return {
				...currentPluginState,
				errorInfo: null,
			};
		}

		if (tr.docChanged) {
			const { decorationSet } = currentPluginState;
			const onRemove = () => {
				// Make sure we are unmounting the component
				// from the react tree when this decoration is removed
				removeDecorations(currentPluginState.decorationSet);
			};
			const mappedDecorationSet = decorationSet.map(tr.mapping, tr.doc, {
				onRemove,
			});

			// return same pluginState if decorationSet did not change
			if (mappedDecorationSet === currentPluginState.decorationSet) {
				return currentPluginState;
			}

			return {
				...currentPluginState,
				decorationSet: mappedDecorationSet,
			};
		}

		return currentPluginState;
	};
};
