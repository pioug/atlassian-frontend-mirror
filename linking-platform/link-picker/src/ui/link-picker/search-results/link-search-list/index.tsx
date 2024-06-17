/** @jsx jsx */
import { forwardRef, Fragment, type KeyboardEvent, useCallback, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type LinkPickerPlugin, type LinkSearchListItemData } from '../../../../common/types';
import { MinHeightContainer } from '../../../../common/ui/min-height-container';
import { handleNavKeyDown } from '../../../../common/utils/handleNavKeyDown';

import { NoResults, testIds as noResultsTestIds } from './link-search-no-results';
import { emptyStateNoResultsWrapper } from './link-search-no-results/styled';
import { LinkSearchListItem, testIds as searchResultItemTestIds } from './list-item';
import { listContainerStyles, listStyles, listTitleStyles, spinnerContainerStyles } from './styled';
import { useTrackResultsShown } from './use-track-results-shown';

export const messages = defineMessages({
	titleRecentlyViewed: {
		id: 'fabric.linkPicker.listTitle.recentlyViewed',
		defaultMessage: 'Recently Viewed',
		description: 'Describes type of items shown in the list for screen-reader users',
	},
	titleResults: {
		id: 'fabric.linkPicker.listTitle.results',
		defaultMessage: 'Results',
		description: 'Describes type of items shown in the list for screen-reader users',
	},
	searchLinkResults: {
		id: 'fabric.linkPicker.hyperlink.searchLinkResults',
		defaultMessage: '{count, plural, =0 {no results} one {# result} other {# results}} found',
		description: 'Announce search results for screen-reader users.',
	},
});

export const testIds = {
	...noResultsTestIds,
	...searchResultItemTestIds,
	resultListTitle: 'link-picker-list-title',
	searchResultList: 'link-search-list',
	searchResultLoadingIndicator: 'link-picker.results-loading-indicator',
	tabsLoadingIndicator: 'link-picker.tabs-loading-indicator',
};

type LinkSearchListElement = HTMLElement;

export interface LinkSearchListProps
	extends Omit<React.HTMLAttributes<LinkSearchListElement>, 'onSelect' | 'onChange'> {
	items?: LinkSearchListItemData[] | null;
	isLoading: boolean;
	selectedIndex: number;
	activeIndex: number;
	onChange: (objectId: string) => void;
	onSelect: (objectId: string) => void;
	onKeyDown?: (e: KeyboardEvent<LinkSearchListElement>) => void;
	ariaControls?: string;
	ariaLabelledBy?: string;
	ariaReadOnly?: boolean;
	role?: string;
	id?: string;
	hasSearchTerm?: boolean;
	activePlugin?: LinkPickerPlugin;
}

export const LinkSearchList = forwardRef<HTMLDivElement, LinkSearchListProps>(
	(
		{
			onChange,
			onSelect,
			onKeyDown,
			items,
			activeIndex,
			selectedIndex,
			isLoading,
			ariaControls,
			ariaLabelledBy,
			ariaReadOnly,
			role,
			id,
			hasSearchTerm,
			activePlugin,
			...restProps
		},
		ref,
	) => {
		let itemsContent;
		let loadingContent;

		const linkListTitle = hasSearchTerm ? messages.titleResults : messages.titleRecentlyViewed;

		useTrackResultsShown(isLoading, items, hasSearchTerm);

		const itemRefs = useRef<Record<string, HTMLElement>>({});
		const itemRefCallback = useCallback((el: HTMLElement | null, id: string) => {
			if (el === null) {
				delete itemRefs.current[id];
			} else {
				itemRefs.current[id] = el;
			}
		}, []);

		const getTabIndex = useCallback(
			(index: number) => {
				if (selectedIndex > -1) {
					return selectedIndex === index ? 0 : -1;
				}
				if (index === 0) {
					return 0;
				}
				return -1;
			},
			[selectedIndex],
		);

		const handleKeyDown = useCallback(
			(event: KeyboardEvent<HTMLElement>) => {
				let updatedIndex = activeIndex;
				if (onKeyDown) {
					onKeyDown(event);
				}

				if (!items?.length) {
					return;
				}
				updatedIndex = handleNavKeyDown(event, items.length, activeIndex);

				const item = items?.[updatedIndex];

				if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && item) {
					if (itemRefs.current) {
						itemRefs.current[item.objectId]?.focus();
					}
				}
			},
			[activeIndex, items, onKeyDown],
		);

		if (items?.length === 0) {
			if (getBooleanFF('platform.linking-platform.link-picker.enable-empty-state')) {
				if (hasSearchTerm) {
					return <NoResults />;
				} else {
					return (
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						<div css={emptyStateNoResultsWrapper}>
							{activePlugin?.emptyStateNoResults ? activePlugin.emptyStateNoResults() : null}
						</div>
					);
				}
			} else {
				return <NoResults />;
			}
		}

		if (items && items.length > 0) {
			itemsContent = (
				<Fragment>
					<div
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={listTitleStyles}
						id={testIds.resultListTitle}
						data-testid={testIds.resultListTitle}
					>
						<FormattedMessage {...linkListTitle} />
					</div>
					<VisuallyHidden id="fabric.smartcard.linkpicker.suggested.results">
						{hasSearchTerm && (
							<FormattedMessage
								{...messages.searchLinkResults}
								values={{ count: items.length }}
								aria-live="polite"
								aria-atomic="true"
							/>
						)}
					</VisuallyHidden>
					<ul
						id={id}
						role={role}
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={listStyles}
						aria-controls="fabric.smartcard.linkpicker.suggested.results"
						aria-labelledby={testIds.resultListTitle}
						aria-readonly={ariaReadOnly}
						data-testid={testIds.searchResultList}
					>
						{items.map((item, index) => (
							<LinkSearchListItem
								id={`${testIds.searchResultItem}-${index}`}
								role={role && 'option'}
								item={item}
								selected={selectedIndex === index}
								active={activeIndex === index}
								onFocus={() => onChange(item.objectId)}
								onKeyDown={handleKeyDown}
								onSelect={onSelect}
								key={item.objectId}
								tabIndex={getTabIndex(index)}
								ref={(el) => itemRefCallback(el, item.objectId)}
							/>
						))}
					</ul>
				</Fragment>
			);
		}

		if (isLoading) {
			loadingContent = (
				<MinHeightContainer
					minHeight={
						getBooleanFF('platform.linking-platform.link-picker.fixed-height-search-results')
							? '50px'
							: '80px'
					}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={spinnerContainerStyles}
				>
					<Spinner testId={testIds.searchResultLoadingIndicator} size="medium" />
				</MinHeightContainer>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div ref={ref} css={listContainerStyles} {...restProps}>
				{itemsContent}
				{loadingContent}
			</div>
		);
	},
);
