import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import { cssMap } from '@atlaskit/css';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import {
	getQuickInsertMenuModel,
	getQuickInsertMenuRows,
	selectQuickInsertCategoryItems,
} from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import { useQuickInsertSearchAnalytics } from '@atlaskit/editor-common/quick-insert/use-search-analytics';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import { TYPE_AHEAD_SURFACE_CONTEXT } from '@atlaskit/editor-common/type-ahead-surface-context';
import type { RegisteredItemRankResolver } from '@atlaskit/editor-common/type-ahead/item-rank';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import type { RegisterComponent, RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import { RegisteredInsertMenuList } from './RegisteredInsertMenuList';

const DEFAULT_MENU_MAX_HEIGHT = 520;

const styles = cssMap({
	menu: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		width: '350px',
	},
	search: {
		flexShrink: 0,
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.100'),
		paddingInline: token('space.150'),
	},
});

type Props = {
	components: RegisterComponent[];
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	fireAnalyticsEvent?: EditorAnalyticsAPI['fireAnalyticsEvent'];
	getItemRank?: RegisteredItemRankResolver;
	isOffline: boolean;
	maxHeight?: number;
	onClose: () => void;
	onSelect: () => void;
};

export const RegisteredInsertMenu = ({
	components,
	emptyStateHandler,
	fireAnalyticsEvent,
	getItemRank,
	editorView,
	isOffline,
	maxHeight = DEFAULT_MENU_MAX_HEIGHT,
	onClose,
	onSelect,
}: Props): React.JSX.Element => {
	const menuStyle = { maxHeight };
	const { formatMessage } = useIntl();
	const listId = useId();
	const [menuOpenId] = useState(() => Symbol('registered-insert-menu-open'));
	const [query, setQuery] = useState('');
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const selectedItemIndexRef = useRef(selectedItemIndex);
	const [renderedItems, setRenderedItems] = useState({ startIndex: -1, stopIndex: -1 });
	const searchRef = useRef<HTMLInputElement>(null);
	useLayoutEffect(() => {
		// Popup positions on the next frame; focusing must not scroll to its initial location.
		searchRef.current?.focus({ preventScroll: true });
	}, []);
	const surfaceContext = useMemo(
		() => createSurfaceContext(TYPE_AHEAD_SURFACE_CONTEXT, { menuOpenId }),
		[menuOpenId],
	);
	const hasSectionOverflowItems = useMemo(
		() => components.some(({ key }) => isSectionOverflowItemKey(key)),
		[components],
	);
	const model = useMemo(
		() =>
			getQuickInsertMenuModel({
				components,
				formatMessage,
				getItemRank,
				query,
				rootComponent: MENU,
				selectCategoryItems: hasSectionOverflowItems ? selectQuickInsertCategoryItems : undefined,
				surfaceContext,
			}),
		[components, formatMessage, getItemRank, hasSectionOverflowItems, query, surfaceContext],
	);
	const [previewActivation, setPreviewActivation] = useState<
		| {
				itemKey: string;
				model: typeof model;
				source: 'keyboard' | 'pointer';
		  }
		| undefined
	>();
	const activePreviewItemKey =
		previewActivation?.model === model ? previewActivation.itemKey : undefined;
	const searchResultCount = useMemo(
		() =>
			model.sections.reduce(
				(count, section) =>
					count +
					section.filter(({ key, type }) => type === 'menu-item' && !isSectionOverflowItemKey(key))
						.length,
				0,
			),
		[model.sections],
	);
	const flushSearchAnalytics = useQuickInsertSearchAnalytics({
		fireAnalyticsEvent,
		query,
		resultCount: searchResultCount,
		surface: 'toolbar',
	});
	const closeWithAnalytics = useCallback(() => {
		flushSearchAnalytics();
		onClose();
	}, [flushSearchAnalytics, onClose]);
	const selectWithAnalytics = useCallback(() => {
		flushSearchAnalytics();
		onSelect();
	}, [flushSearchAnalytics, onSelect]);
	const selectableItems = useMemo(
		() =>
			getQuickInsertMenuRows(model).filter(
				(row): row is RegisterMenuItem => row.type === 'menu-item',
			),
		[model],
	);
	const itemCount = selectableItems.length + (model.footer ? 1 : 0);
	const selectableItemKeys = useMemo(
		() =>
			[...selectableItems, ...(model.footer ? [model.footer] : [])].map(({ key }) => key).join(','),
		[model.footer, selectableItems],
	);
	useLayoutEffect(() => {
		const initialItemIndex = itemCount > 0 ? 0 : -1;
		selectedItemIndexRef.current = initialItemIndex;
		setSelectedItemIndex(initialItemIndex);
	}, [itemCount, query, selectableItemKeys]);
	useLayoutEffect(() => {
		setPreviewActivation(undefined);
	}, [model, query]);
	const isActiveItemMounted =
		selectedItemIndex >= 0 &&
		selectedItemIndex < itemCount &&
		((selectedItemIndex >= renderedItems.startIndex &&
			selectedItemIndex <= renderedItems.stopIndex) ||
			(Boolean(model.footer) && selectedItemIndex === itemCount - 1));
	const activeItemId = `${listId}-${selectedItemIndex}`;
	const setKeyboardPreview = useCallback(
		(itemIndex: number) => {
			const item = selectableItems[itemIndex];
			setPreviewActivation(item ? { itemKey: item.key, model, source: 'keyboard' } : undefined);
		},
		[model, selectableItems],
	);
	const selectNextItem = useCallback(() => {
		const currentIndex = selectedItemIndexRef.current;
		const nextIndex = itemCount === 0 ? -1 : currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount;
		selectedItemIndexRef.current = nextIndex;
		setSelectedItemIndex(nextIndex);
		setKeyboardPreview(nextIndex);
	}, [itemCount, setKeyboardPreview]);
	const selectPreviousItem = useCallback(() => {
		const currentIndex = selectedItemIndexRef.current;
		const previousIndex =
			itemCount === 0 ? -1 : currentIndex <= 0 ? itemCount - 1 : currentIndex - 1;
		selectedItemIndexRef.current = previousIndex;
		setSelectedItemIndex(previousIndex);
		setKeyboardPreview(previousIndex);
	}, [itemCount, setKeyboardPreview]);
	const onItemHover = useCallback(
		(itemIndex: number, itemKey?: string) => {
			selectedItemIndexRef.current = itemIndex;
			setSelectedItemIndex(itemIndex);
			setPreviewActivation((current) => {
				if (
					current?.itemKey === itemKey &&
					current?.model === model &&
					current?.source === 'pointer'
				) {
					return current;
				}

				return itemKey ? { itemKey, model, source: 'pointer' } : undefined;
			});
		},
		[model],
	);
	const onItemFocus = useCallback(
		(itemIndex: number, itemKey?: string) => {
			selectedItemIndexRef.current = itemIndex;
			setSelectedItemIndex(itemIndex);
			setPreviewActivation((current) => {
				if (current?.itemKey === itemKey && current?.model === model) {
					return current;
				}

				return itemKey ? { itemKey, model, source: 'keyboard' } : undefined;
			});
		},
		[model],
	);
	const onItemLeave = useCallback((itemKey: string) => {
		setPreviewActivation((current) =>
			current?.source === 'pointer' && current.itemKey === itemKey ? undefined : current,
		);
	}, []);
	const onItemBlur = useCallback((itemKey: string) => {
		setPreviewActivation((current) => (current?.itemKey === itemKey ? undefined : current));
	}, []);
	const onItemVisibilityChange = useCallback((itemKey: string, isVisible: boolean) => {
		if (!isVisible) {
			setPreviewActivation((current) =>
				current?.source === 'pointer' && current.itemKey === itemKey ? undefined : current,
			);
		}
	}, []);
	const selectActiveItem = useCallback(() => {
		if (isActiveItemMounted) {
			getDocument()?.getElementById(activeItemId)?.click();
		}
	}, [activeItemId, isActiveItemMounted]);
	const onQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
	}, []);
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				closeWithAnalytics();
				return;
			}

			// The search field owns the composite's arrow-key and Enter behaviour. Other
			// focusable controls, including consumer-provided empty-state content, need
			// to retain their native keyboard behaviour.
			if (event.target !== searchRef.current) {
				return;
			}

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					selectNextItem();
					break;
				case 'ArrowUp':
					event.preventDefault();
					selectPreviousItem();
					break;
				case 'Enter':
					event.preventDefault();
					selectActiveItem();
					break;
			}
		},
		[closeWithAnalytics, selectActiveItem, selectNextItem, selectPreviousItem],
	);

	return (
		<Box
			data-keyboard-navigation-independent=""
			testId="registered-insert-menu"
			onKeyDownCapture={onKeyDown}
			xcss={styles.menu}
			style={menuStyle}
		>
			<Box xcss={styles.search}>
				<Textfield
					aria-activedescendant={isActiveItemMounted ? activeItemId : undefined}
					aria-controls={listId}
					aria-expanded="true"
					placeholder="Search"
					ref={searchRef}
					role="combobox"
					value={query}
					onChange={onQueryChange}
				/>
			</Box>
			<RegisteredInsertMenuList
				editorView={editorView}
				emptyStateHandler={emptyStateHandler}
				isOffline={isOffline}
				listId={listId}
				listLabel={formatMessage(messages.insertMenu)}
				maxHeight={maxHeight}
				menuOpenId={menuOpenId}
				model={model}
				onClose={selectWithAnalytics}
				onItemFocus={onItemFocus}
				onItemHover={onItemHover}
				onItemBlur={onItemBlur}
				onItemLeave={onItemLeave}
				onItemVisibilityChange={onItemVisibilityChange}
				onRenderedItemsChange={setRenderedItems}
				query={query}
				selectedItemIndex={selectedItemIndex}
				surfaceContext={surfaceContext}
				activePreviewItemKey={activePreviewItemKey}
			/>
		</Box>
	);
};
