/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useId, useMemo } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { token } from '@atlaskit/tokens';

import { QuickInsertEmptyState } from '../registered-menu/QuickInsertEmptyState';
// oxlint-disable-next-line eslint/no-redeclare
import { getRecommendedTileSize, type RegistryElementBrowserItem } from './model';
import { getFirstEnabledOption } from './options';

type Props = {
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	fallbackItems?: RegistryElementBrowserItem[];
	isLoading?: boolean;
	isOffline: boolean;
	items: RegistryElementBrowserItem[];
	onKeyDown: (event: React.KeyboardEvent) => void;
	onSelect: (key: string, handler: QuickInsertSelectionHandler) => void;
	query: string;
	/** Shown under a Recommended heading, above `items` under All elements. */
	recommendedItems: RegistryElementBrowserItem[];
	resultsId: string;
	section?: string;
	selectedKey?: string;
	surfaceContext: SurfaceContext;
};

const resultsGridStyles = css({
	alignContent: 'start',
	display: 'grid',
	gap: token('space.200'),
	gridTemplateColumns: 'minmax(0, 1fr)',
	// Each step keeps tiles at least 215px wide in a modal of 100vw - 120px with a 15px scrollbar.
	// min-width only, so a fractional viewport (when zoomed) can't fall between two ranges.
	// Two columns of tiles.
	'@media (min-width: 613px)': {
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	},
	// Three columns of tiles, up to 264px wide each.
	'@media (min-width: 1054px)': {
		gridTemplateColumns: 'repeat(3, minmax(0, 264px))',
	},
});

// Six half-tile columns line wide and regular tiles up with the three-column grid below:
// a regular tile spans two (264px) and a wide tile spans three.
const recommendedGridStyles = css({
	'@media (min-width: 1054px)': {
		gridTemplateColumns: 'repeat(6, minmax(0, 124px))',
	},
});

const regularTileStyles = css({
	minWidth: 0,
	// Three-column layout: a regular Recommended tile spans two of the six half-tile columns.
	'@media (min-width: 1054px)': {
		gridColumn: 'span 2',
	},
});

const wideTileStyles = css({
	minWidth: 0,
	// Three-column layout: a wide Recommended tile spans three of the six half-tile columns.
	'@media (min-width: 1054px)': {
		gridColumn: 'span 3',
	},
});

const groupedResultsStyles = css({
	display: 'grid',
	gap: token('space.200'),
});

const resultGroupStyles = css({
	display: 'grid',
	gap: token('space.100'),
});

const resultGroupHeadingStyles = css({
	color: token('color.text.subtle'),
	font: token('font.heading.small'),
	paddingBlockEnd: token('space.100'),
});

const emptyStateGridItemStyles = css({
	gridColumn: '1 / -1',
	minWidth: 0,
	width: '100%',
});

const styles = cssMap({
	fallbackMarketplace: {
		borderTopColor: token('color.border'),
		borderTopStyle: 'solid',
		borderTopWidth: token('border.width'),
		marginTop: token('space.200'),
		paddingTop: token('space.200'),
	},
});

const RegistryElementBrowserItem = ({
	editorView,
	isOffline,
	isSelected,
	item,
	onSelect,
	surfaceContext,
}: {
	editorView: EditorView;
	isOffline: boolean;
	isSelected: boolean;
	item: RegistryElementBrowserItem;
	onSelect: (key: string, handler: QuickInsertSelectionHandler) => void;
	surfaceContext: SurfaceContext;
}): React.JSX.Element | null => {
	const { component: Component, key } = item.registration;
	const contextValue = useMemo(
		() => ({
			editorView,
			isOffline,
			item: {
				description: item.description,
				id: key,
				isSelected,
			},
			select: (handler: QuickInsertSelectionHandler) => onSelect(key, handler),
			surfaceContext,
		}),
		[editorView, isOffline, isSelected, item.description, key, onSelect, surfaceContext],
	);

	if (!Component) {
		return null;
	}

	return (
		<QuickInsertProvider value={contextValue}>
			<Component parents={item.registration.parents} surfaceContext={surfaceContext}>
				{null}
			</Component>
		</QuickInsertProvider>
	);
};

export const RegistryElementBrowserSearchResults = ({
	editorView,
	emptyStateHandler,
	fallbackItems,
	isLoading = false,
	isOffline,
	items,
	query,
	recommendedItems,
	resultsId,
	section,
	selectedKey,
	surfaceContext,
	onKeyDown,
	onSelect,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const groupHeadingIdPrefix = useId();
	const hasFallbackItems = Boolean(
		!isLoading && items.length === 0 && query.trim().length > 0 && fallbackItems?.length,
	);
	const resultsLabel = formatMessage(messages.elementBrowserResultsLabel);
	const displayedItems = hasFallbackItems && fallbackItems ? fallbackItems : items;
	const groups =
		recommendedItems.length > 0
			? [
					{
						items: recommendedItems,
						key: 'recommended',
						title: formatMessage(messages.categoryRecommended),
					},
					{
						items,
						key: 'all-elements',
						title: formatMessage(messages.elementBrowserAllElements),
					},
				].filter((group) => group.items.length > 0)
			: undefined;
	const isGrouped = groups !== undefined;
	const renderItems = (itemsToRender: RegistryElementBrowserItem[]) =>
		itemsToRender.map((item) => (
			<RegistryElementBrowserItem
				editorView={editorView}
				isOffline={isOffline}
				isSelected={selectedKey === item.registration.key}
				item={item}
				key={item.registration.key}
				onSelect={onSelect}
				surfaceContext={surfaceContext}
			/>
		));
	const shouldRenderEmptyState = items.length === 0 && recommendedItems.length === 0 && !isLoading;
	const emptyState = shouldRenderEmptyState
		? emptyStateHandler?.({
				mode: 'full',
				searchTerm: query,
				selectedCategory: section,
				showNoResultsMessage: false,
			})
		: null;

	return (
		<div data-testid="registry-element-browser-results" id={resultsId} tabIndex={-1}>
			{(isGrouped || displayedItems.length > 0) && (
				<div
					aria-label={resultsLabel}
					css={[isGrouped && groupedResultsStyles, !isGrouped && resultsGridStyles]}
					onFocus={(event) => {
						if (event.target === event.currentTarget) {
							getFirstEnabledOption(event.currentTarget)?.focus();
						}
					}}
					onKeyDown={onKeyDown}
					role="listbox"
					tabIndex={0}
				>
					{groups
						? groups.map((group) => (
								<div
									aria-labelledby={`${groupHeadingIdPrefix}-${group.key}`}
									css={resultGroupStyles}
									key={group.key}
									role="group"
								>
									<div
										aria-hidden
										css={resultGroupHeadingStyles}
										id={`${groupHeadingIdPrefix}-${group.key}`}
									>
										{group.title}
									</div>
									{group.key === 'recommended' ? (
										<div css={[resultsGridStyles, recommendedGridStyles]}>
											{group.items.map((item, index) => {
												const isWide = getRecommendedTileSize(index, group.items.length) === 'wide';
												return (
													<div
														css={[isWide && wideTileStyles, !isWide && regularTileStyles]}
														key={item.registration.key}
													>
														{renderItems([item])}
													</div>
												);
											})}
										</div>
									) : (
										<div css={resultsGridStyles}>{renderItems(group.items)}</div>
									)}
								</div>
							))
						: renderItems(displayedItems)}
				</div>
			)}
			{shouldRenderEmptyState && !hasFallbackItems && query.trim().length > 0 && (
				<QuickInsertEmptyState mode="full" />
			)}
			{emptyState && (
				<div css={[emptyStateGridItemStyles, styles.fallbackMarketplace]}>{emptyState}</div>
			)}
		</div>
	);
};
