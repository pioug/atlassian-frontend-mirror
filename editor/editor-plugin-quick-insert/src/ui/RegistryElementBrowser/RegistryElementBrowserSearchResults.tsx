/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useId, useMemo } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { messages } from '@atlaskit/editor-common/quick-insert/messages';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterMenuItem, SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { token } from '@atlaskit/tokens';

import { QuickInsertEmptyState } from '../registered-menu/QuickInsertEmptyState';
// oxlint-disable-next-line eslint/no-redeclare
import { getRecommendedTileSize, type RegistryElementBrowserItem } from './model';
import { VirtualizedElementBrowserGrid } from './VirtualizedElementBrowserGrid';

type Props = {
	columnCount: number;
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	focusedRow?: number;
	isOffline: boolean;
	items: RegistryElementBrowserItem[];
	onBlur: React.FocusEventHandler<HTMLDivElement>;
	onFocus: React.FocusEventHandler<HTMLDivElement>;
	onKeyDown: (event: React.KeyboardEvent) => void;
	onSelect: (registration: RegisterMenuItem, handler: QuickInsertSelectionHandler) => void;
	query: string;
	/** Shown under a Recommended heading, above `items` under All elements. */
	recommendedItems: RegistryElementBrowserItem[];
	requestedRow?: number;
	resultsId: string;
	resultsRef: React.Ref<HTMLDivElement>;
	scrollElement: HTMLElement | null;
	section?: string;
	selectedKey?: string;
	showEmptyState: boolean;
	surfaceContext: SurfaceContext;
};

const recommendedGridStyles = css({
	alignContent: 'start',
	display: 'grid',
	gap: token('space.200'),
});

const recommendedTileStyles = css({
	minWidth: 0,
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
	recommendedOneColumn: { gridTemplateColumns: 'minmax(0, 1fr)' },
	recommendedTwoColumns: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
	// Half-tile columns align the Recommended group with the three-column results below.
	recommendedSixColumns: { gridTemplateColumns: 'repeat(6, minmax(0, 124px))' },
	recommendedRegularSpan: { gridColumn: 'span 2' },
	recommendedWideSpan: { gridColumn: 'span 3' },
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
	position,
	onSelect,
	size,
	surfaceContext,
}: {
	editorView: EditorView;
	isOffline: boolean;
	isSelected: boolean;
	item: RegistryElementBrowserItem;
	onSelect: Props['onSelect'];
	position: number;
	size: number;
	surfaceContext: SurfaceContext;
}): React.JSX.Element | null => {
	const { registration } = item;
	const { component: Component, key } = registration;
	const contextValue = useMemo(
		() => ({
			editorView,
			isOffline,
			item: {
				description: item.description,
				id: key,
				isSelected,
				optionPosition: { index: position, size },
			},
			select: (handler: QuickInsertSelectionHandler) => onSelect(registration, handler),
			surfaceContext,
		}),
		[
			editorView,
			isOffline,
			isSelected,
			item.description,
			key,
			onSelect,
			position,
			registration,
			size,
			surfaceContext,
		],
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
	columnCount,
	editorView,
	emptyStateHandler,
	focusedRow,
	isOffline,
	items,
	query,
	recommendedItems,
	requestedRow,
	resultsId,
	resultsRef,
	scrollElement,
	section,
	selectedKey,
	showEmptyState,
	surfaceContext,
	onBlur,
	onFocus,
	onKeyDown,
	onSelect,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const groupHeadingIdPrefix = useId();
	const resultsLabel = formatMessage(messages.elementBrowserResultsLabel);
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
	const renderItem = useCallback(
		(item: RegistryElementBrowserItem, index: number, size: number) => (
			<RegistryElementBrowserItem
				editorView={editorView}
				isOffline={isOffline}
				isSelected={selectedKey === item.registration.key}
				item={item}
				key={item.registration.key}
				onSelect={onSelect}
				position={index + 1}
				size={size}
				surfaceContext={surfaceContext}
			/>
		),
		[editorView, isOffline, onSelect, selectedKey, surfaceContext],
	);
	const selectedIndex = items.findIndex(({ registration }) => registration.key === selectedKey);
	const regularGrid = items.length > 0 && (
		<VirtualizedElementBrowserGrid
			key={`${section ?? ''}\0${query}`}
			columnCount={columnCount}
			focusedRow={focusedRow}
			items={items}
			renderItem={renderItem}
			requestedRow={requestedRow}
			scrollElement={scrollElement}
			selectedRow={selectedIndex < 0 ? undefined : Math.floor(selectedIndex / columnCount)}
		/>
	);
	const emptyState = showEmptyState
		? emptyStateHandler?.({
				mode: 'full',
				searchTerm: query,
				selectedCategory: section,
				showNoResultsMessage: false,
			})
		: null;

	return (
		<div
			data-testid="registry-element-browser-results"
			id={resultsId}
			ref={resultsRef}
			tabIndex={-1}
		>
			{(isGrouped || regularGrid) && (
				<div
					aria-label={resultsLabel}
					css={[isGrouped && groupedResultsStyles]}
					onBlur={onBlur}
					onFocus={onFocus}
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
										<div
											css={[
												recommendedGridStyles,
												columnCount === 1 && styles.recommendedOneColumn,
												columnCount === 2 && styles.recommendedTwoColumns,
												columnCount === 3 && styles.recommendedSixColumns,
											]}
										>
											{group.items.map((item, index) => {
												const isWide = getRecommendedTileSize(index, group.items.length) === 'wide';
												return (
													<div
														css={[
															recommendedTileStyles,
															columnCount === 3 && isWide && styles.recommendedWideSpan,
															columnCount === 3 && !isWide && styles.recommendedRegularSpan,
														]}
														key={item.registration.key}
													>
														{renderItem(item, index, group.items.length)}
													</div>
												);
											})}
										</div>
									) : (
										regularGrid
									)}
								</div>
							))
						: regularGrid}
				</div>
			)}
			{showEmptyState && items.length === 0 && query.trim().length > 0 && (
				<QuickInsertEmptyState mode="full" />
			)}
			{emptyState && (
				<div css={[emptyStateGridItemStyles, styles.fallbackMarketplace]}>{emptyState}</div>
			)}
		</div>
	);
};
