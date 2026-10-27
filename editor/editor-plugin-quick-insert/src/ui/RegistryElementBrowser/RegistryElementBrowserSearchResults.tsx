/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types/empty-state-handler';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext } from '@atlaskit/editor-ui-control-model/types';
import { token } from '@atlaskit/tokens';

import { QuickInsertEmptyState } from '../registered-menu/QuickInsertEmptyState';
// oxlint-disable-next-line eslint/no-redeclare
import type { RegistryElementBrowserItem } from './model';

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
	resultsId: string;
	section?: string;
	selectedKey?: string;
	surfaceContext: SurfaceContext;
};

const resultsGridStyles = css({
	alignContent: 'start',
	alignItems: 'start',
	display: 'grid',
	gap: token('space.100'),
	gridTemplateColumns: 'minmax(0, 1fr)',
	'@media (min-width: 550px) and (max-width: 1023px)': {
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	},
	'@media (min-width: 1024px)': {
		gridTemplateColumns: 'repeat(3, 232px)',
	},
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
	resultsId,
	section,
	selectedKey,
	surfaceContext,
	onKeyDown,
	onSelect,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const hasFallbackItems = Boolean(
		!isLoading && items.length === 0 && query.trim().length > 0 && fallbackItems?.length,
	);
	const resultsLabel = formatMessage({
		defaultMessage: 'Element results',
		id: 'editor.quick-insert.results-label',
	});
	const displayedItems = hasFallbackItems && fallbackItems ? fallbackItems : items;
	const shouldRenderEmptyState = items.length === 0 && !isLoading;
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
			{displayedItems.length > 0 && (
				<div
					aria-label={resultsLabel}
					css={resultsGridStyles}
					onFocus={(event) => {
						if (event.target === event.currentTarget) {
							event.currentTarget
								.querySelector<HTMLElement>(
									'[role="option"]:not([aria-disabled="true"]):not([disabled])',
								)
								?.focus();
						}
					}}
					onKeyDown={onKeyDown}
					role="listbox"
					tabIndex={0}
				>
					{displayedItems.map((item) => (
						<RegistryElementBrowserItem
							editorView={editorView}
							isOffline={isOffline}
							isSelected={selectedKey === item.registration.key}
							item={item}
							key={item.registration.key}
							onSelect={onSelect}
							surfaceContext={surfaceContext}
						/>
					))}
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
