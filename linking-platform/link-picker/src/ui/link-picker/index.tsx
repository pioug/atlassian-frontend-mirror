/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ChangeEvent,
	type FormEvent,
	Fragment,
	type KeyboardEvent,
	memo,
	useCallback,
	useLayoutEffect,
	useMemo,
	useReducer,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';
import uuid from 'uuid';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { isSafeUrl, normalizeUrl } from '@atlaskit/linking-common/url';
import { browser } from '@atlaskit/linking-common/user-agent';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	useLinkPickerAnalytics,
	withInputFieldTracking,
	withLinkPickerAnalyticsContext,
} from '../../common/analytics';
import { ANALYTICS_CHANNEL } from '../../common/constants';
import type {
	LinkInputType,
	LinkPickerProps,
	LinkSearchListItemData,
	PickerState,
} from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { handleNavKeyDown } from '../../common/utils/handleNavKeyDown';
import { usePlugins } from '../../services/use-plugins';
import { useSearchQuery } from '../../services/use-search-query';

import { Announcer } from './announcer';
import { FormFooter, testIds as formFooterTestIds } from './form-footer';
import { LinkPickerSubmitButton } from './form-footer/link-picker-submit-button';
import { formMessages, linkMessages, linkTextMessages, searchMessages } from './messages';
import { SearchResults, testIds as searchTestIds } from './search-results';
import { formFooterMargin, rootContainerStyles } from './styled';
import { testIds as textFieldTestIds, TextInput } from './text-input';
import { TrackMount } from './track-mount';
import { getDataSource, getScreenReaderText } from './utils';

export const testIds = {
	linkPickerRoot: 'link-picker-root',
	linkPicker: 'link-picker',
	urlInputField: 'link-url',
	textInputField: 'link-text',
	...searchTestIds,
	...formFooterTestIds,
	...textFieldTestIds,
} as const;

const initState: PickerState = {
	url: '',
	displayText: '',
	activeIndex: -1,
	selectedIndex: -1,
	invalidUrl: false,
	activeTab: 0,
	preventHidingRecents: false,
	/** This only allows the feature discovery pulse - to be shown the ff must be on and active tab be Jira */
	allowCreateFeatureDiscovery: true,
};

const FullWidthSubmitButtonStyles = xcss({
	marginTop: 'space.200',
	display: 'flex',
	flexDirection: 'column',
});

function reducer(state: PickerState, payload: Partial<PickerState>): PickerState {
	if (payload.url && state.url !== payload.url) {
		return {
			...state,
			invalidUrl: false,
			selectedIndex: isSafeUrl(payload.url) && payload.url.length ? -1 : state.selectedIndex,
			/** When the user starts entering a url, stop pulsing the create button */
			allowCreateFeatureDiscovery: false,
			...payload,
		};
	}

	return { ...state, ...payload };
}

/**
 * Bind input fields to analytics tracking
 */

const getLinkFieldContent = (value: string) => {
	if (!Boolean(value)) {
		return null;
	}
	return isSafeUrl(value) ? 'url' : 'text_string';
};

const LinkInputField = withInputFieldTracking(TextInput, 'link', (event, attributes) => ({
	...attributes,
	linkFieldContent: getLinkFieldContent(event.currentTarget.value),
}));

const DisplayTextInputField = withInputFieldTracking(TextInput, 'displayText');

export const LinkPicker = withLinkPickerAnalyticsContext(
	memo(
		({
			onSubmit,
			onCancel,
			onContentResize,
			plugins,
			isLoadingPlugins,
			url: initUrl,
			displayText: initDisplayText,
			hideDisplayText,
			featureFlags,
			customMessages,
			isSubmitting = false,
			UNSAFE_moveSubmitButton = false,
		}: LinkPickerProps) => {
			const { createAnalyticsEvent } = useAnalyticsEvents();

			const [state, dispatch] = useReducer(reducer, {
				...initState,
				url: normalizeUrl(initUrl) || '',
				displayText: initDisplayText || '',
			});

			const {
				activeIndex,
				selectedIndex,
				url,
				displayText,
				invalidUrl,
				activeTab,
				allowCreateFeatureDiscovery,
			} = state;

			const intl = useIntl();
			const queryState = useSearchQuery(state);

			const {
				items,
				isLoading: isLoadingResults,
				isActivePlugin,
				activePlugin,
				tabs,
				error,
				retry,
				pluginAction,
			} = usePlugins(queryState, activeTab, plugins);

			const isEditing = !!initUrl;
			const selectedItem: LinkSearchListItemData | undefined = items?.[selectedIndex];
			const isSelectedItem = selectedItem?.url === url;

			const { trackAttribute, getAttributes } = useLinkPickerAnalytics();

			const submitMessageId = useMemo(() => uuid(), []);

			useLayoutEffect(() => {
				if (onContentResize) {
					onContentResize();
				}
			}, [onContentResize, items, isLoadingResults, isActivePlugin, tabs]);

			const handleChangeUrl = useCallback(
				(e: ChangeEvent<HTMLInputElement>) => {
					if (isSubmitting) {
						// Prevent changing url while submitting
						return;
					}

					/** Any on change event is triggered by manual input or paste, so source is null */
					trackAttribute('linkFieldContentInputSource', null);
					dispatch({
						url: e.currentTarget.value,
						// If the last action was changing tabs, make sure we're now allowing recents to be hidden
						preventHidingRecents: false,
					});
				},
				[dispatch, trackAttribute, isSubmitting],
			);

			const handleChangeText = useCallback(
				(e: ChangeEvent<HTMLInputElement>) => {
					dispatch({
						displayText: e.currentTarget.value,
					});
				},
				[dispatch],
			);

			const handleClear = useCallback(
				(field: string) => {
					dispatch({
						activeIndex: -1,
						selectedIndex: -1,
						[field]: '',
					});
				},
				[dispatch],
			);

			const handleUrlClear = useCallback(() => {
				if (isSubmitting) {
					// Prevent clearing url while submitting
					return;
				}
				trackAttribute('linkFieldContentInputSource', null);
				handleClear('url');
			}, [trackAttribute, handleClear, isSubmitting]);

			const handleInsert = useCallback(
				(
					url: string,
					title: string | null,
					inputType: LinkInputType,
					data?: Record<string, unknown>,
				) => {
					const event = createAnalyticsEvent(
						createEventPayload('ui.form.submitted.linkPicker', {}),
					);

					// Clone the event so that it can be emitted for consumer usage
					// This must happen BEFORE the original event is fired!
					const consumerEvent = event.clone();
					// Cloned event doesnt have the attributes that are added by
					// the analytics listener in the LinkPickerAnalyticsContext, add them here
					consumerEvent?.update({ attributes: getAttributes() });
					// Dispatch the original event to our channel
					event.fire(ANALYTICS_CHANNEL);

					onSubmit(
						{
							url,
							displayText: displayText || null,
							title: title || null,
							meta: { inputMethod: inputType },
							data,
							...(inputType === 'manual' ? { rawUrl: state.url } : {}),
						},
						consumerEvent,
					);
				},
				[displayText, onSubmit, state.url, createAnalyticsEvent, getAttributes],
			);

			const handleSelected = useCallback(
				(objectId: string) => {
					if (isSubmitting) {
						// Prevent changing selection while submitting
						return;
					}

					const selectedItem = items?.find((item) => item.objectId === objectId);

					if (selectedItem) {
						const { url, name } = selectedItem;
						/**
						 * Manually track that the url has been updated using searchResult method
						 */
						dispatchEvent(new Event('submit'));
						trackAttribute('linkFieldContent', getLinkFieldContent(url));
						trackAttribute('linkFieldContentInputMethod', 'searchResult');
						trackAttribute(
							'linkFieldContentInputSource',
							getDataSource(selectedItem, activePlugin),
						);
						handleInsert(url, name, 'typeAhead', { ...selectedItem });
					}
				},
				[handleInsert, trackAttribute, items, activePlugin, isSubmitting],
			);

			const handleSubmit = useCallback(
				(event?: FormEvent<HTMLFormElement>): void => {
					event?.preventDefault();
					if (isSubmitting) {
						// Prevent submit while submitting
						return;
					}

					if (isSelectedItem && selectedItem) {
						return handleInsert(selectedItem.url, selectedItem.name, 'typeAhead');
					}

					const normalized = normalizeUrl(url);
					if (normalized) {
						return handleInsert(normalized, null, 'manual');
					}

					return dispatch({
						invalidUrl: true,
					});
				},
				[dispatch, handleInsert, isSelectedItem, selectedItem, url, isSubmitting],
			);

			const handleTabChange = useCallback(
				(activeTab: number) => {
					dispatch({
						// We don't want any selection to exist after changing tab, as the selection
						// wouldn't mean anything.
						activeIndex: -1,
						selectedIndex: -1,

						// We don't want recents to be hidden, even though we don't have a selection
						preventHidingRecents: true,
						invalidUrl: false,
						activeTab,
					});
					trackAttribute('tab', plugins?.[activeTab]?.tabKey ?? null);
				},
				[dispatch, plugins, trackAttribute],
			);

			const handleSearchListOnChange = (id: string) => {
				if (isSubmitting) {
					// Prevent changing item while submitting
					return;
				}
				const index = items?.findIndex((item) => item.objectId === id);
				if (typeof index === 'number') {
					const item = items?.[index];
					if (item) {
						/**
						 * Manually track that the url has been updated using searchResult method
						 */
						trackAttribute('linkFieldContent', getLinkFieldContent(item.url));
						trackAttribute('linkFieldContentInputMethod', 'searchResult');
						trackAttribute('linkFieldContentInputSource', getDataSource(item, activePlugin));
						dispatch({
							activeIndex: index,
							selectedIndex: index,
							url: item.url,
							invalidUrl: false,
						});
					}
				}
			};

			const handleKeyDown = useCallback(
				(event: KeyboardEvent<HTMLElement>) => {
					if (!items?.length) {
						return;
					}

					let updatedIndex = activeIndex;
					if (event.key === 'Enter') {
						event.preventDefault();
						if (selectedItem) {
							handleSelected(selectedItem.objectId);
						} else {
							// triggers validation error message
							handleSubmit();
						}
					} else {
						updatedIndex = handleNavKeyDown(event, items.length, activeIndex);
					}

					const item = items[updatedIndex];

					if (['Enter', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && item) {
						/**
						 * Manually track that the url has been updated using searchResult method
						 */
						trackAttribute('linkFieldContent', getLinkFieldContent(item.url));
						trackAttribute('linkFieldContentInputMethod', 'searchResult');
						trackAttribute('linkFieldContentInputSource', getDataSource(item, activePlugin));
						dispatch({
							activeIndex: updatedIndex,
							selectedIndex: updatedIndex,
							url: item.url,
							invalidUrl: false,
						});
					}
				},
				[
					items,
					activeIndex,
					selectedItem,
					handleSelected,
					handleSubmit,
					trackAttribute,
					activePlugin,
				],
			);

			const messages = isActivePlugin ? searchMessages : linkMessages;

			const screenReaderDescriptionId = 'search-recent-links-field-description';
			const linkSearchListId = 'link-picker-search-list';
			const ariaActiveDescendant =
				selectedIndex > -1 ? `link-search-list-item-${selectedIndex}` : '';

			const a11yList =
				isActivePlugin || isLoadingPlugins
					? ({
							role: 'combobox',
							'aria-expanded': true,
							'aria-autocomplete': 'list',
							'aria-controls': linkSearchListId,
							'aria-activedescendant': ariaActiveDescendant,
							'aria-describedby': screenReaderDescriptionId,
						} as const)
					: undefined;

			// Added workaround with a screen reader Announcer specifically for VoiceOver + Safari
			// as the Aria design pattern for combobox does not work in this case
			// for details: https://a11y-internal.atlassian.net/browse/AK-740
			const screenReaderText =
				browser().safari && getScreenReaderText(items ?? [], selectedIndex, intl);
			const customSubmitButtonLabel = customMessages?.submitButtonLabel
				? customMessages.submitButtonLabel
				: undefined;

			return (
				<form
					data-testid={testIds.linkPicker}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={rootContainerStyles}
					// Use onSubmitCapture instead of onSubmit so that any possible parent form isn't submitted
					onSubmitCapture={handleSubmit}
				>
					<TrackMount />
					{isActivePlugin && (
						<Fragment>
							{screenReaderText && (
								<Announcer
									ariaLive="assertive"
									text={screenReaderText}
									ariaRelevant="additions"
									delay={250}
								/>
							)}
							<VisuallyHidden id={screenReaderDescriptionId}>
								{customMessages?.linkAriaLabel ? (
									<FormattedMessage {...customMessages.linkAriaLabel} />
								) : (
									<FormattedMessage {...messages.linkAriaLabel} />
								)}
							</VisuallyHidden>
						</Fragment>
					)}
					<LinkInputField
						name="url"
						autoComplete="off"
						testId={testIds.urlInputField}
						label={
							customMessages?.linkLabel
								? intl.formatMessage(customMessages.linkLabel)
								: intl.formatMessage(messages.linkLabel)
						}
						placeholder={
							customMessages?.linkPlaceholder
								? intl.formatMessage(customMessages?.linkPlaceholder)
								: intl.formatMessage(messages.linkPlaceholder)
						}
						value={url}
						autoFocus
						clearLabel={intl.formatMessage(formMessages.clearLink)}
						error={invalidUrl ? intl.formatMessage(formMessages.linkInvalid) : null}
						spotlightTargetName="link-picker-search-field-spotlight-target"
						aria-readonly={isSubmitting}
						{...a11yList}
						onClear={handleUrlClear}
						onKeyDown={handleKeyDown}
						onChange={handleChangeUrl}
					/>
					{!hideDisplayText && (
						<DisplayTextInputField
							autoComplete="off"
							name="displayText"
							testId={testIds.textInputField}
							value={displayText}
							label={
								customMessages?.linkTextLabel
									? intl.formatMessage(customMessages.linkTextLabel)
									: intl.formatMessage(linkTextMessages.linkTextLabel)
							}
							placeholder={
								customMessages?.linkTextPlaceholder
									? intl.formatMessage(customMessages?.linkTextPlaceholder)
									: intl.formatMessage(linkTextMessages.linkTextPlaceholder)
							}
							clearLabel={intl.formatMessage(linkTextMessages.clearLinkText)}
							readOnly={isSubmitting}
							onClear={handleClear}
							onChange={handleChangeText}
						/>
					)}
					{UNSAFE_moveSubmitButton && (
						<Box xcss={FullWidthSubmitButtonStyles}>
							<LinkPickerSubmitButton
								isEditing={isEditing}
								isLoading={isLoadingResults || !!isLoadingPlugins}
								isSubmitting={isSubmitting}
								customSubmitButtonLabel={customSubmitButtonLabel}
								error={error}
								items={items}
								queryState={queryState}
								submitMessageId={submitMessageId}
								testId={testIds.insertButton}
								url={url}
							/>
						</Box>
					)}
					{!!queryState && (isLoadingPlugins || isActivePlugin) && (
						<SearchResults
							activeTab={activeTab}
							tabs={tabs}
							activePlugin={activePlugin}
							isLoadingResults={isLoadingResults}
							isLoadingPlugins={isLoadingPlugins}
							isSubmitting={isSubmitting}
							linkSearchListId={linkSearchListId}
							error={error}
							featureFlags={featureFlags}
							activeIndex={activeIndex}
							selectedIndex={selectedIndex}
							items={items}
							queryState={queryState}
							handleKeyDown={handleKeyDown}
							handleSelected={handleSelected}
							handleTabChange={handleTabChange}
							handleSearchListOnChange={handleSearchListOnChange}
							retry={retry}
						/>
					)}
					<FormFooter
						error={error}
						items={items}
						/** If the results section appears to be loading, impact whether the submit button is disabled */
						isLoading={isLoadingResults || !!isLoadingPlugins}
						isSubmitting={isSubmitting}
						queryState={queryState}
						url={url}
						isEditing={isEditing}
						onCancel={onCancel}
						action={pluginAction}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={!queryState || !plugins?.length ? formFooterMargin : undefined}
						/* Show the feature discovery pulse when we're on the Jira tab, we haven't started typing a url and
            the feature flag is enabled */
						createFeatureDiscovery={
							activePlugin?.tabKey === 'jira' &&
							allowCreateFeatureDiscovery &&
							fg('platform.linking-platform.link-picker.enable-jira-create')
						}
						customSubmitButtonLabel={customSubmitButtonLabel}
						submitMessageId={submitMessageId}
						hideSubmitButton={UNSAFE_moveSubmitButton}
					/>
				</form>
			);
		},
	),
);
