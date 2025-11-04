/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	forwardRef,
	Fragment,
	type KeyboardEvent,
	useCallback,
	useRef,
} from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type LinkPickerPlugin, type LinkSearchListItemData } from '../../../../common/types';
import { MinHeightContainer } from '../../../../common/ui/min-height-container';
import { handleNavKeyDown } from '../../../../common/utils/handleNavKeyDown';

import { NoResults, testIds as noResultsTestIds } from './link-search-no-results';
import { LinkSearchListItem, testIds as searchResultItemTestIds } from './list-item';
import { useTrackResultsShown } from './use-track-results-shown';

const styles = cssMap({
	emptyStateNoResultsWrapper: {
		minHeight: token('space.200'),
	},
});

const listContainerStyles = css({
	width: '100%',
	paddingTop: 0,
	minHeight: '80px',
	marginTop: token('space.200', '16px'),
	marginBottom: token('space.200', '16px'),
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
});

const spinnerContainerStyles = css({
	flexGrow: 1,
	flexDirection: 'column',
	alignItems: 'center',
});

const listStyles = css({
	paddingTop: token('space.0', '0px'),
	paddingRight: token('space.0', '0px'),
	paddingBottom: token('space.0', '0px'),
	paddingLeft: token('space.0', '0px'),
	marginTop: token('space.0', '0px'),
	marginBottom: token('space.0', '0px'),
	marginLeft: 'calc(-1 * var(--link-picker-padding-left))',
	marginRight: 'calc(-1 * var(--link-picker-padding-right))',
	listStyle: 'none',
});

const baseListTitleStyles = css({
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	marginBottom: token('space.050', '4px'),
});

const newListTitleStyles = css({
	color: token('color.text.subtle'),
});

const listTitleStyles: CSSProperties = {
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	marginBottom: token('space.050', '4px'),
	color: token('color.text.subtle'),
};

export const messages = defineMessages({
	titleRecentlyViewed: {
		id: 'fabric.linkPicker.listTitle.recentlyViewed',
		defaultMessage: 'Recently Viewed',
		description: 'Describes type of items shown in the list for screen-reader users',
	},
	titleRecentlyViewedFormatted: {
		id: 'fabric.linkPicker.listTitle.recentlyViewedFormatted',
		defaultMessage: 'Recently viewed',
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
	adaptiveHeight: boolean;
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
	/** Because we don't use the DST TabPanels component, tabPanelId is needed to set the correct aria-controls for a11y. */
	tabPanelId?: string;
	shouldRenderNoResultsImage?: boolean;
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
			adaptiveHeight,
			className,
			tabPanelId,
			shouldRenderNoResultsImage,
			...restProps
		},
		ref,
	) => {
		let itemsContent;
		let loadingContent;

		const recentlyViewedMessage = fg('platform-linking-link-picker-previewable-only')
			? messages.titleRecentlyViewedFormatted
			: messages.titleRecentlyViewed;

		const linkListTitle = hasSearchTerm ? messages.titleResults : recentlyViewedMessage;

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
			if (!hasSearchTerm) {
				const emptyState = activePlugin?.emptyStateNoResults?.();
				if (emptyState) {
					return (
						<div id={tabPanelId} css={styles.emptyStateNoResultsWrapper}>
							{emptyState}
						</div>
					);
				}
			}

			return (
				<div id={tabPanelId}>
					<NoResults shouldRenderImage={shouldRenderNoResultsImage} />
				</div>
			);
		}

		const listItemNameMaxLines = activePlugin?.uiOptions?.listItemNameMaxLines;

		if (items && items.length > 0) {
			itemsContent = (
				<Fragment>
					{fg('navx-2134-fix-a11y-link-picker-headings') ? (
						<Box
							as="h2" // Must remain <h2> for a11y title hierarchy as per https://hello.jira.atlassian.cloud/browse/A11Y-27579
							// `.wiki-content h2` css styles in confluence override ADS/native styles here, so inline styles are needed.
							// Should use css or xcss prop when that CSS is removed/fixed by confluence
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							style={listTitleStyles}
							id={testIds.resultListTitle}
							testId={testIds.resultListTitle}
						>
							<FormattedMessage {...linkListTitle} />
						</Box>
					) : (
						<div
							css={[baseListTitleStyles, newListTitleStyles]}
							id={testIds.resultListTitle}
							data-testid={testIds.resultListTitle}
						>
							<FormattedMessage {...linkListTitle} />
						</div>
					)}
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
						css={listStyles}
						aria-controls="fabric.smartcard.linkpicker.suggested.results"
						aria-labelledby={testIds.resultListTitle}
						aria-readonly={ariaReadOnly}
						data-testid={testIds.searchResultList}
					>
						{items.map((item, index) => (
							<LinkSearchListItem
								id={`${testIds.searchResultItem}-${index}`}
								item={item}
								selected={selectedIndex === index}
								active={activeIndex === index}
								onFocus={() => onChange(item.objectId)}
								onKeyDown={handleKeyDown}
								onSelect={onSelect}
								key={item.objectId}
								tabIndex={getTabIndex(index)}
								ref={(el) => itemRefCallback(el, item.objectId)}
								nameMaxLines={listItemNameMaxLines}
							/>
						))}
					</ul>
				</Fragment>
			);
		}

		if (isLoading) {
			loadingContent = (
				<MinHeightContainer
					minHeight={adaptiveHeight ? '80px' : '50px'}
					css={spinnerContainerStyles}
				>
					<Spinner
						testId={testIds.searchResultLoadingIndicator}
						interactionName="link-picker-search-list-loading"
						size="medium"
					/>
				</MinHeightContainer>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			<div id={tabPanelId} ref={ref} css={listContainerStyles} className={className} {...restProps}>
				{itemsContent}
				{loadingContent}
			</div>
		);
	},
);
