import React, { useCallback } from 'react';

import { cssMap } from '@atlaskit/css';
import type {
	RegisteredMenuModel,
	RegisteredMenuItemProps,
	RegisteredMenuSelectionSource,
} from '@atlaskit/editor-common/registered-menu';
import { RegisteredMenuList } from '@atlaskit/editor-common/registered-menu/list';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type {
	RegisterMenuItem,
	RegisterMenuSection,
} from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { getQuickInsertMenuItemId } from './getQuickInsertMenuItemId';
import { QuickInsertEmptyState } from './QuickInsertEmptyState';

const MENU_FOOTER_HEIGHT = 45;
const LIST_WIDTH = 350;

const styles = cssMap({
	content: { display: 'flex', flexDirection: 'column', minHeight: 0 },
	scrollable: { flexGrow: 1, minHeight: 0, overflowY: 'auto' },
	footer: { flexShrink: 0 },
	externalControls: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
	},
	footerDivider: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		flexShrink: 0,
	},
});

type Props = {
	activePreviewItemKey?: string;
	emptyStateHandler?: EmptyStateHandler;
	Item: React.ComponentType<RegisteredMenuItemProps>;
	itemCount: number;
	listId: string;
	listLabel: string;
	maxHeight: number;
	model: RegisteredMenuModel;
	onItemBlur: (key: string) => void;
	onItemFocus: (index: number, key?: string) => void;
	onItemHover: (index: number, key?: string) => void;
	onItemLeave: (key: string) => void;
	onItemVisibilityChange: (key: string, isVisible: boolean) => void;
	onRenderedItemsChange: (range: { startIndex: number; stopIndex: number }) => void;
	query: string;
	rows: Array<RegisterMenuItem | RegisterMenuSection>;
	selectedItemIndex: number;
	selectionSource?: RegisteredMenuSelectionSource;
};

export const ToolbarQuickInsertMenu = ({
	Item,
	model,
	emptyStateHandler,
	listLabel,
	activePreviewItemKey,
	itemCount,
	listId,
	maxHeight,
	rows,
	onItemBlur,
	onItemFocus,
	onItemHover,
	onItemLeave,
	onItemVisibilityChange,
	onRenderedItemsChange,
	query,
	selectedItemIndex,
	selectionSource,
}: Props): React.JSX.Element | null => {
	const footerItemIndex = itemCount - 1;
	const footerItemId = getQuickInsertMenuItemId(listId, footerItemIndex);
	const isEmptySearch = query !== '' && model.sections.length === 0;
	const hasNoSearchResults = model.sections.length === 0 && model.fallbackItems.length === 0;
	const externalControls = isEmptySearch
		? emptyStateHandler?.({ mode: 'inline', searchTerm: query, showNoResultsMessage: false })
		: null;
	const onFooterItemFocus = useCallback(
		() => onItemFocus(footerItemIndex),
		[footerItemIndex, onItemFocus],
	);
	const onFooterItemHover = useCallback(
		() => onItemHover(footerItemIndex),
		[footerItemIndex, onItemHover],
	);
	const listMaxHeight = Math.max(0, maxHeight - (model.footer ? MENU_FOOTER_HEIGHT : 0));
	const contentStyle = { maxHeight: maxHeight };
	const getItemId = useCallback(
		({ itemIndex }: { itemIndex: number; rowIndex: number }) =>
			getQuickInsertMenuItemId(listId, itemIndex),
		[listId],
	);
	const onScrollableContentScroll = useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			if (event.target === event.currentTarget && activePreviewItemKey) {
				onItemVisibilityChange(activePreviewItemKey, false);
			}
		},
		[activePreviewItemKey, onItemVisibilityChange],
	);
	if (!model.root) {
		return null;
	}
	return (
		<Box xcss={styles.content} style={contentStyle}>
			<Box xcss={styles.scrollable} onScroll={onScrollableContentScroll}>
				<Box
					aria-label={listLabel}
					aria-owns={model.footer ? footerItemId : undefined}
					id={listId}
					role="listbox"
				>
					{rows.length > 0 && (
						<RegisteredMenuList
							rows={rows}
							Item={Item}
							width={LIST_WIDTH}
							maxHeight={listMaxHeight}
							getItemId={getItemId}
							activeItemKey={activePreviewItemKey}
							selectedItemIndex={selectedItemIndex}
							selectionSource={selectionSource}
							scrollResetKey={query}
							onItemHover={onItemHover}
							onItemFocus={onItemFocus}
							onItemBlur={onItemBlur}
							onItemLeave={onItemLeave}
							onItemVisibilityChange={onItemVisibilityChange}
							onRenderedItemsChange={onRenderedItemsChange}
							role="group"
							tabIndex={null}
							omitAriaReadonly
							lastRowPadding="space.100"
							scrollTo="top-on-reset"
						/>
					)}
				</Box>
				{query !== '' && hasNoSearchResults && <QuickInsertEmptyState mode="inline" />}
				{externalControls && (
					<Box testId="registered-insert-menu-external-controls" xcss={styles.externalControls}>
						{externalControls}
					</Box>
				)}
			</Box>
			{model.footer && (
				<Box xcss={styles.footer}>
					<Box testId="registered-insert-menu-footer" xcss={styles.footer}>
						{!isEmptySearch || !hasNoSearchResults || Boolean(externalControls) ? (
							<Box aria-hidden="true" xcss={styles.footerDivider} />
						) : null}
						<Box onFocus={onFooterItemFocus} onMouseMove={onFooterItemHover}>
							<Item
								id={footerItemId}
								isSelected={selectedItemIndex === footerItemIndex}
								isActive={false}
								registration={model.footer}
							/>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};
