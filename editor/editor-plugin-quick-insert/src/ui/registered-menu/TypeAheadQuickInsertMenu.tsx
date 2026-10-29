import React, { useCallback } from 'react';

import { cssMap } from '@atlaskit/css';
import type {
	RegisteredMenuItemProps,
	RegisteredMenuModel,
	RegisteredMenuSelectionSource,
} from '@atlaskit/editor-common/registered-menu';
import { RegisteredMenuList } from '@atlaskit/editor-common/registered-menu/list';
import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { getQuickInsertMenuItemId } from './getQuickInsertMenuItemId';
import { QuickInsertEmptyState } from './QuickInsertEmptyState';

const LIST_WIDTH = 320;
const MENU_FOOTER_HEIGHT = 45;
const MENU_FOOTER_HEIGHT_WITH_SCROLL_PADDING = 51;

const styles = cssMap({
	footer: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
	},
});

type Props = {
	activeItemKey?: string;
	hasScrollPadding?: boolean;
	Item: React.ComponentType<RegisteredMenuItemProps>;
	itemCount: number;
	listId: string;
	listLabel: string;
	maxHeight: number;
	model: RegisteredMenuModel;
	onItemBlur: (itemKey: string) => void;
	onItemFocus: (itemIndex: number, itemKey?: string) => void;
	onItemHover: (itemIndex: number, itemKey?: string) => void;
	onItemLeave: (itemKey: string) => void;
	onItemVisibilityChange: (itemKey: string, isVisible: boolean) => void;
	onRenderedItemsChange: (range: { startIndex: number; stopIndex: number }) => void;
	query?: string;
	rows: Array<RegisterMenuItem | RegisterMenuSection>;
	selectedItemIndex: number;
	selectionSource?: RegisteredMenuSelectionSource;
};

export const TypeAheadQuickInsertMenu = ({
	Item,
	rows,
	activeItemKey,
	itemCount,
	listId,
	listLabel,
	maxHeight,
	model,
	onItemFocus,
	onItemBlur,
	onItemHover,
	onItemLeave,
	onItemVisibilityChange,
	onRenderedItemsChange,
	query = '',
	selectedItemIndex,
	selectionSource,
	hasScrollPadding = false,
}: Props): React.JSX.Element | null => {
	const footerItemIndex = itemCount - 1;
	const onFooterItemHover = useCallback(
		() => onItemHover(footerItemIndex),
		[footerItemIndex, onItemHover],
	);
	const getItemId = useCallback(
		({ itemIndex }: { itemIndex: number; rowIndex: number }) =>
			getQuickInsertMenuItemId(listId, itemIndex),
		[listId],
	);
	if (!model.root) {
		return null;
	}
	const listMaxHeight = Math.max(
		0,
		maxHeight -
			(model.footer
				? hasScrollPadding
					? MENU_FOOTER_HEIGHT_WITH_SCROLL_PADDING
					: MENU_FOOTER_HEIGHT
				: 0),
	);
	const hasListboxContent = rows.length > 0 || model.footer !== undefined;
	return (
		<Box
			aria-label={hasListboxContent ? listLabel : undefined}
			id={listId}
			role={hasListboxContent ? 'listbox' : undefined}
		>
			{rows.length > 0 ? (
				<RegisteredMenuList
					rows={rows}
					Item={Item}
					width={LIST_WIDTH}
					maxHeight={listMaxHeight}
					getItemId={getItemId}
					activeItemKey={activeItemKey}
					selectedItemIndex={selectedItemIndex}
					selectionSource={selectionSource}
					scrollResetKey={query}
					hasScrollPadding={hasScrollPadding}
					scrollTo="top-on-reset"
					onItemFocus={onItemFocus}
					onItemBlur={onItemBlur}
					onItemHover={onItemHover}
					onItemLeave={onItemLeave}
					onItemVisibilityChange={onItemVisibilityChange}
					onRenderedItemsChange={onRenderedItemsChange}
				/>
			) : (
				query !== '' && <QuickInsertEmptyState mode="inline" spacing="spacious" />
			)}
			{model.footer && (
				<Box
					onMouseMove={onFooterItemHover}
					paddingBlockEnd={hasScrollPadding ? 'space.075' : undefined}
					xcss={styles.footer}
				>
					<Item
						id={getQuickInsertMenuItemId(listId, footerItemIndex)}
						isSelected={selectedItemIndex === footerItemIndex}
						isActive={false}
						registration={model.footer}
					/>
				</Box>
			)}
		</Box>
	);
};
