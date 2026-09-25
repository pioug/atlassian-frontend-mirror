import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import { cssMap } from '@atlaskit/css';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import {
	buildQuickInsertMenuModel,
	getMatchingQuickInsertComponents,
	selectQuickInsertCategoryItems,
} from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import { isSectionOverflowItemKey } from '@atlaskit/editor-common/type-ahead-is-section-overflow-item-key';
import { TYPE_AHEAD_SURFACE_CONTEXT } from '@atlaskit/editor-common/type-ahead-surface-context';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
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
	isOffline: boolean;
	maxHeight?: number;
	onClose: () => void;
	onSelect: () => void;
};

export const RegisteredInsertMenu = ({
	components,
	emptyStateHandler,
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
			query === ''
				? buildQuickInsertMenuModel(
						components,
						MENU,
						hasSectionOverflowItems ? selectQuickInsertCategoryItems : undefined,
						surfaceContext,
					)
				: getMatchingQuickInsertComponents({
						components,
						formatMessage,
						query,
						rootComponent: MENU,
						surfaceContext,
					}),
		[components, formatMessage, hasSectionOverflowItems, query, surfaceContext],
	);
	const itemCount = useMemo(
		() =>
			model.sections.reduce((count, [, ...items]) => count + items.length, 0) +
			(model.fallbackItems?.length ?? 0) +
			(model.footer ? 1 : 0),
		[model.fallbackItems, model.footer, model.sections],
	);
	const selectableItemKeys = useMemo(
		() =>
			[
				...model.sections.flatMap(([, ...items]) => items),
				...(model.fallbackItems ?? []),
				model.footer,
			]
				.filter((item): item is NonNullable<typeof item> => Boolean(item))
				.map(({ key }) => key)
				.join(','),
		[model.fallbackItems, model.footer, model.sections],
	);
	useLayoutEffect(() => {
		setSelectedItemIndex(itemCount > 0 ? 0 : -1);
	}, [itemCount, query, selectableItemKeys]);
	const isActiveItemMounted =
		selectedItemIndex >= 0 &&
		selectedItemIndex < itemCount &&
		((selectedItemIndex >= renderedItems.startIndex &&
			selectedItemIndex <= renderedItems.stopIndex) ||
			(Boolean(model.footer) && selectedItemIndex === itemCount - 1));
	const activeItemId = `${listId}-${selectedItemIndex}`;
	const selectNextItem = useCallback(() => {
		setSelectedItemIndex((index) => (itemCount === 0 ? -1 : (index + 1) % itemCount));
	}, [itemCount]);
	const selectPreviousItem = useCallback(() => {
		setSelectedItemIndex((index) =>
			itemCount === 0 ? -1 : index <= 0 ? itemCount - 1 : index - 1,
		);
	}, [itemCount]);
	const selectActiveItem = useCallback(() => {
		if (isActiveItemMounted) {
			getDocument()?.getElementById(activeItemId)?.click();
		}
	}, [activeItemId, isActiveItemMounted]);
	const onQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.currentTarget.value);
		setSelectedItemIndex(0);
	}, []);
	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onClose();
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
		[onClose, selectActiveItem, selectNextItem, selectPreviousItem],
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
				onClose={onSelect}
				onItemHover={setSelectedItemIndex}
				onRenderedItemsChange={setRenderedItems}
				query={query}
				selectedItemIndex={selectedItemIndex}
				surfaceContext={surfaceContext}
			/>
		</Box>
	);
};
