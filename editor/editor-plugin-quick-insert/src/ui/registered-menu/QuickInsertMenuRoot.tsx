import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages/insert-block';
import type {
	QuickInsertContextValue,
	QuickInsertSelectionHandler,
} from '@atlaskit/editor-common/quick-insert/context';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import type { RegisteredMenuInteraction } from '@atlaskit/editor-common/registered-menu';
import { useRegisteredMenuContext } from '@atlaskit/editor-common/registered-menu/context';
import type { RegisteredItemRankResolver } from '@atlaskit/editor-common/registered-menu/item-rank';
import { REGISTERED_MENU_SURFACE_CONTEXT } from '@atlaskit/editor-common/registered-menu/surface-context';
import { useRegisteredMenu } from '@atlaskit/editor-common/registered-menu/use-registered-menu';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import { typeAheadListMessages } from '@atlaskit/editor-common/type-ahead/messages';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import MenuGroup from '@atlaskit/menu/menu-group';

import {
	getQuickInsertMenuModel,
	type RecommendedItemsResolver,
} from './get-quick-insert-menu-model';
import { getQuickInsertMenuItemId } from './getQuickInsertMenuItemId';
import { RegisteredQuickInsertMenuItem } from './RegisteredQuickInsertMenuItem';
import { selectQuickInsertCategoryItems } from './selectQuickInsertCategoryItems';
import { ToolbarQuickInsertMenu } from './ToolbarQuickInsertMenu';
import { TypeAheadQuickInsertMenu } from './TypeAheadQuickInsertMenu';
import { useQuickInsertSearchAnalytics } from './useQuickInsertSearchAnalytics';

const DEFAULT_MENU_MAX_HEIGHT = 480;

type Props = {
	emptyStateHandler?: EmptyStateHandler;
	fireAnalyticsEvent?: EditorAnalyticsAPI['fireAnalyticsEvent'];
	getItemRank?: RegisteredItemRankResolver;
	getRecommendedItems?: RecommendedItemsResolver;
};

type RenderedItems = { startIndex: number; stopIndex: number };

const isImeEnter = (event: KeyboardEvent): boolean => event.isComposing || event.keyCode === 229;

const QuickInsertMenuRoot = ({
	emptyStateHandler,
	fireAnalyticsEvent,
	getItemRank,
	getRecommendedItems,
}: React.PropsWithChildren<Props>): React.JSX.Element | null => {
	const registeredMenu = useRegisteredMenuContext();
	const { query = '', select: selectFromHost, surfaceContext } = registeredMenu;
	const surface = surfaceContext.get(REGISTERED_MENU_SURFACE_CONTEXT)?.surface;
	if (!selectFromHost || !surface || surface === 'element-browser') {
		throw new Error('QuickInsertMenuRoot requires a selection action and registered menu surface');
	}
	const { formatMessage } = useIntl();
	const { components, getItemRank: runtimeItemRank, rootComponent } = registeredMenu;
	const model = useMemo(
		() =>
			getQuickInsertMenuModel({
				components,
				formatMessage,
				getItemRank: runtimeItemRank ?? getItemRank,
				getRecommendedItems,
				query,
				rootComponent,
				selectCategoryItems: components.some(({ key }) => isSectionOverflowItemKey(key))
					? selectQuickInsertCategoryItems
					: undefined,
				surfaceContext,
			}),
		[
			components,
			formatMessage,
			getItemRank,
			getRecommendedItems,
			query,
			rootComponent,
			runtimeItemRank,
			surfaceContext,
		],
	);
	const resultCount = useMemo(
		() =>
			model.sections.reduce(
				(count, [, ...items]) =>
					count + items.filter(({ key }) => !isSectionOverflowItemKey(key)).length,
				0,
			),
		[model.sections],
	);
	const flushSearchAnalytics = useQuickInsertSearchAnalytics({
		surface,
		fireAnalyticsEvent,
		query,
		resultCount,
	});
	const selectItem = useCallback(
		(selection: QuickInsertSelectionHandler) => {
			flushSearchAnalytics();
			selectFromHost((insert) =>
				selection({
					insert,
					source: surface === 'toolbar' ? INPUT_METHOD.INSERT_MENU : INPUT_METHOD.QUICK_INSERT,
				}),
			);
		},
		[flushSearchAnalytics, selectFromHost, surface],
	);
	const menuContextValue = useMemo<QuickInsertContextValue>(
		() => ({
			editorView: registeredMenu.editorView,
			isOffline: registeredMenu.isOffline,
			popupsMountPoint: registeredMenu.portalMountPoint,
			select: selectItem,
			surfaceContext: registeredMenu.surfaceContext,
		}),
		[
			registeredMenu.editorView,
			registeredMenu.isOffline,
			registeredMenu.portalMountPoint,
			registeredMenu.surfaceContext,
			selectItem,
		],
	);
	const listLabel = formatMessage(
		surface === 'typeahead'
			? typeAheadListMessages.quickInsertInputLabel
			: toolbarInsertBlockMessages.insertMenu,
	);
	const {
		rows,
		selectableItems,
		selectedItemIndex,
		activeItemKey,
		selectionSource,
		...listEvents
	} = useRegisteredMenu({ model, resetKey: query });
	const listId = useId();
	const [renderedItems, setRenderedItems] = useState<RenderedItems>({
		startIndex: -1,
		stopIndex: -1,
	});
	const menuRef = useRef<HTMLDivElement>(null);
	const maxHeight = registeredMenu.maxHeight ?? DEFAULT_MENU_MAX_HEIGHT;
	const itemCount = selectableItems.length + (model.footer ? 1 : 0);
	const activeItemId =
		selectedItemIndex >= 0 && selectedItemIndex < itemCount
			? getQuickInsertMenuItemId(listId, selectedItemIndex)
			: undefined;
	const isActiveItemMounted =
		selectedItemIndex >= 0 &&
		selectedItemIndex < itemCount &&
		((selectedItemIndex >= renderedItems.startIndex &&
			selectedItemIndex <= renderedItems.stopIndex) ||
			(Boolean(model.footer) && selectedItemIndex === itemCount - 1));
	const selectActiveItem = useCallback(() => {
		if (isActiveItemMounted && activeItemId) {
			menuRef.current?.ownerDocument.getElementById(activeItemId)?.click();
		}
	}, [activeItemId, isActiveItemMounted]);
	const onMenuKeyDown = useCallback(
		(event: KeyboardEvent): boolean => {
			if (event.key === 'ArrowDown') {
				listEvents.selectNext();
				return true;
			}
			if (event.key === 'ArrowUp') {
				listEvents.selectPrevious();
				return true;
			}
			if (event.key === 'Enter') {
				if (isImeEnter(event)) {
					return false;
				}
				selectActiveItem();
				return true;
			}
			return false;
		},
		[listEvents.selectNext, listEvents.selectPrevious, selectActiveItem],
	);
	const containsTarget = useCallback(
		(target: Node) => Boolean(menuRef.current?.contains(target)),
		[],
	);
	const interaction = useMemo<RegisteredMenuInteraction>(
		() => ({
			activeDescendantId: isActiveItemMounted ? activeItemId : undefined,
			containsTarget,
			expanded: itemCount > 0,
			label: listLabel,
			listId,
			onKeyDown: onMenuKeyDown,
			onClose: flushSearchAnalytics,
			optionCount: itemCount,
			selectNext: listEvents.selectNext,
			selectPrevious: listEvents.selectPrevious,
		}),
		[
			activeItemId,
			containsTarget,
			flushSearchAnalytics,
			isActiveItemMounted,
			itemCount,
			listId,
			listLabel,
			listEvents.selectNext,
			listEvents.selectPrevious,
			onMenuKeyDown,
		],
	);
	useLayoutEffect(() => {
		if (!model.root) {
			return;
		}
		return registeredMenu.registerInteraction(interaction);
	}, [model.root, interaction, registeredMenu.registerInteraction]);
	if (!model.root) {
		return null;
	}
	return (
		<QuickInsertProvider value={menuContextValue}>
			<div ref={menuRef}>
				<MenuGroup>
					{surface === 'typeahead' ? (
						<TypeAheadQuickInsertMenu
							Item={RegisteredQuickInsertMenuItem}
							activeItemKey={activeItemKey}
							hasScrollPadding
							itemCount={itemCount}
							listId={listId}
							listLabel={listLabel}
							maxHeight={maxHeight}
							model={model}
							onItemBlur={listEvents.onItemBlur}
							onItemFocus={listEvents.onItemFocus}
							onItemHover={listEvents.onItemHover}
							onItemLeave={listEvents.onItemLeave}
							onItemVisibilityChange={listEvents.onItemVisibilityChange}
							onRenderedItemsChange={setRenderedItems}
							query={query}
							rows={rows}
							selectedItemIndex={selectedItemIndex}
							selectionSource={selectionSource}
						/>
					) : (
						<ToolbarQuickInsertMenu
							Item={RegisteredQuickInsertMenuItem}
							activePreviewItemKey={activeItemKey}
							emptyStateHandler={emptyStateHandler}
							itemCount={itemCount}
							listId={listId}
							listLabel={listLabel}
							maxHeight={maxHeight}
							model={model}
							onItemBlur={listEvents.onItemBlur}
							onItemFocus={listEvents.onItemFocus}
							onItemHover={listEvents.onItemHover}
							onItemLeave={listEvents.onItemLeave}
							onItemVisibilityChange={listEvents.onItemVisibilityChange}
							onRenderedItemsChange={setRenderedItems}
							query={query}
							rows={rows}
							selectedItemIndex={selectedItemIndex}
							selectionSource={selectionSource}
						/>
					)}
				</MenuGroup>
			</div>
		</QuickInsertProvider>
	);
};

export default QuickInsertMenuRoot;
