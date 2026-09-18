/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import LinkButton from '@atlaskit/button/link';
import { jsx } from '@atlaskit/css';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import type { EmptyStateHandler } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { RegistryElementBrowserItem } from './model';
import NotFoundIllustration from './NotFoundIllustration';

type Props = {
	editorView: EditorView;
	emptyStateHandler?: EmptyStateHandler;
	isLoading?: boolean;
	isOffline: boolean;
	items: RegistryElementBrowserItem[];
	onKeyDown: (event: React.KeyboardEvent) => void;
	onSelect: (key: string, handler: QuickInsertSelectionHandler) => void;
	query: string;
	resultsId: string;
	section?: string;
	selectedKey?: string;
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

const emptyStateWrapperStyles = css({
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	width: '100%',
});

const emptyStateHeadingStyles = css({
	color: token('color.text'),
	font: token('font.heading.medium'),
	marginTop: token('space.300'),
});

const emptyStateSubheadingStyles = css({
	marginTop: token('space.200'),
	maxWidth: '400px',
	textAlign: 'center',
});

const emptyStateLinkStyles = css({
	marginTop: token('space.150'),
});

const RegistryElementBrowserItem = ({
	editorView,
	isOffline,
	isSelected,
	item,
	onSelect,
}: {
	editorView: EditorView;
	isOffline: boolean;
	isSelected: boolean;
	item: RegistryElementBrowserItem;
	onSelect: (key: string, handler: QuickInsertSelectionHandler) => void;
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
			surface: 'element-browser' as const,
		}),
		[editorView, isOffline, isSelected, item.description, key, onSelect],
	);

	if (!Component) {
		return null;
	}

	return (
		<QuickInsertProvider value={contextValue}>
			{React.createElement(Component, undefined, null)}
		</QuickInsertProvider>
	);
};

export const RegistryElementBrowserSearchResults = ({
	editorView,
	emptyStateHandler,
	isLoading = false,
	isOffline,
	items,
	query,
	resultsId,
	section,
	selectedKey,
	onKeyDown,
	onSelect,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<div
			aria-label={formatMessage({
				defaultMessage: 'Element results',
				id: 'editor.quick-insert.results-label',
			})}
			css={resultsGridStyles}
			data-testid="registry-element-browser-results"
			id={resultsId}
			onKeyDown={onKeyDown}
			tabIndex={-1}
			role={items.length ? 'listbox' : undefined}
		>
			{items.length ? (
				items.map((item) => (
					<RegistryElementBrowserItem
						editorView={editorView}
						isOffline={isOffline}
						isSelected={selectedKey === item.registration.key}
						item={item}
						key={item.registration.key}
						onSelect={onSelect}
					/>
				))
			) : !isLoading ? (
				<div css={emptyStateGridItemStyles}>
					{emptyStateHandler?.({
						mode: 'full',
						searchTerm: query,
						selectedCategory: section,
					}) ?? (
						<div css={emptyStateWrapperStyles}>
							<NotFoundIllustration />
							<div css={emptyStateHeadingStyles}>
								{formatMessage({
									defaultMessage: 'Nothing matches your search',
									id: 'editor.quick-insert.empty',
								})}
							</div>
							<div css={emptyStateSubheadingStyles}>
								<Text>
									{formatMessage({
										defaultMessage:
											'Try searching with a different term or discover new apps for Atlassian products.',
										id: 'editor.quick-insert.empty-description',
									})}
								</Text>
								<div css={emptyStateLinkStyles}>
									<LinkButton
										appearance="primary"
										href="https://marketplace.atlassian.com/search?category=Macros&hosting=cloud&product=confluence"
										target="_blank"
									>
										{formatMessage({
											defaultMessage: 'Explore Atlassian Marketplace',
											id: 'editor.quick-insert.explore-marketplace',
										})}
									</LinkButton>
								</div>
							</div>
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};
