import React, { useCallback, useId, useMemo, useState } from 'react';

import { getDocument } from '@atlaskit/browser-apis';
import { cssMap } from '@atlaskit/css';
import { useIntl } from 'react-intl';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';

import {
	buildQuickInsertMenuModel,
	getMatchingQuickInsertComponents,
} from '@atlaskit/editor-common/quick-insert/registered-menu-model';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import { TYPE_AHEAD_SURFACE_CONTEXT } from '@atlaskit/editor-common/type-ahead-surface-context';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

import { RegisteredInsertMenuList } from './RegisteredInsertMenuList';

const DEFAULT_MENU_MAX_HEIGHT = 520;

const styles = cssMap({
	menu: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
		display: 'flex',
		flexDirection: 'column',
		maxHeight: `${DEFAULT_MENU_MAX_HEIGHT}px`,
		overflow: 'hidden',
		width: '350px',
	},
	search: {
		flexShrink: 0,
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
	},
});

type Props = {
	components: RegisterComponent[];
	editorView: EditorView;
	isOffline: boolean;
	onClose: () => void;
	onSelect: () => void;
};

export const RegisteredInsertMenu = ({
	components,
	editorView,
	isOffline,
	onClose,
	onSelect,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const listId = useId();
	const [menuOpenId] = useState(() => Symbol('registered-insert-menu-open'));
	const [query, setQuery] = useState('');
	const [selectedItemIndex, setSelectedItemIndex] = useState(0);
	const [renderedItems, setRenderedItems] = useState({ startIndex: -1, stopIndex: -1 });
	const surfaceContext = useMemo(
		() => createSurfaceContext(TYPE_AHEAD_SURFACE_CONTEXT, { menuOpenId }),
		[menuOpenId],
	);
	const model = useMemo(
		() =>
			query === ''
				? buildQuickInsertMenuModel(components, MENU, undefined, surfaceContext)
				: getMatchingQuickInsertComponents({
						components,
						formatMessage,
						query,
						rootComponent: MENU,
						surfaceContext,
					}),
		[components, formatMessage, query, surfaceContext],
	);
	const itemCount = useMemo(
		() =>
			model.sections.reduce((count, [, ...items]) => count + items.length, 0) +
			(model.footer ? 1 : 0),
		[model.footer, model.sections],
	);
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
				case 'Escape':
					event.preventDefault();
					onClose();
					break;
			}
		},
		[onClose, selectActiveItem, selectNextItem, selectPreviousItem],
	);

	return (
		<Box
			data-registered-insert-menu=""
			testId="registered-insert-menu"
			onKeyDownCapture={onKeyDown}
			xcss={styles.menu}
		>
			<Box xcss={styles.search}>
				<Textfield
					aria-activedescendant={isActiveItemMounted ? activeItemId : undefined}
					aria-controls={listId}
					aria-expanded="true"
					autoFocus
					placeholder="Search"
					role="combobox"
					value={query}
					onChange={onQueryChange}
				/>
			</Box>
			<RegisteredInsertMenuList
				editorView={editorView}
				isOffline={isOffline}
				listId={listId}
				listLabel={formatMessage(messages.insertMenu)}
				maxHeight={DEFAULT_MENU_MAX_HEIGHT}
				menuOpenId={menuOpenId}
				model={model}
				onClose={onSelect}
				onItemHover={setSelectedItemIndex}
				onRenderedItemsChange={setRenderedItems}
				selectedItemIndex={selectedItemIndex}
				surfaceContext={surfaceContext}
			/>
		</Box>
	);
};
