import type { ReactNode, Ref } from 'react';

import type { MessageDescriptor } from 'react-intl-next';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type LinkInputType = 'manual' | 'typeAhead';

export interface LinkSearchListItemData {
	/** Unique identifiable attribute for the item */
	objectId: string;
	/** Name / title / display text of the link */
	name: string;
	/** URL of the resource being linked to */
	url: string;
	/** Icon to display in link result */
	icon: string | React.ComponentType<{ alt: string }>;
	/** Alt text describing the icon */
	iconAlt: string | MessageDescriptor;
	/** Context to display in link result */
	container?: string;
	/** Optional last view date to display in link result */
	lastViewedDate?: Date;
	/** Optional last updated date to display in link result */
	lastUpdatedDate?: Date;
	/** Whether the result is pre-fetched from activity provider */
	prefetch?: boolean;
	/** Metadata about the result */
	meta?: {
		/** The data source that provided the result */
		source?: string;
	};
	/**
	 * Optionally override the strings shown in the link result's subtitle
	 * (by default, the subtitle is the container and date). Provide translated strings.
	 */
	subtitleItems?: Readonly<[string, string?]>;
}

export interface LinkPickerState {
	/** Current query string / URL input field value */
	query: string;
}

export interface ResolveResult {
	data: LinkSearchListItemData[];
}

export interface LinkPickerUiOptions {
	/** Maximum number of lines to display for the item name */
	listItemNameMaxLines?: number;
}

export interface LinkPickerPlugin {
	resolve: (
		state: LinkPickerState,
	) => Promise<ResolveResult> | AsyncGenerator<ResolveResult, ResolveResult>;
	/** Uniquely identify the tab */
	tabKey?: string;
	/** Human-readable label for the plugin */
	tabTitle?: string;
	/** Render function to customise the UI that is displayed when an error occurs resolving results */
	errorFallback?: LinkPickerPluginErrorFallback;
	/** Render function to customise the UI that is displayed when there are no results, but an empty form (no search term) */
	emptyStateNoResults?: LinkPickerPluginEmptyStateNoResults;
	/** Metadata about the plugin */
	meta?: {
		/** The data source that provides all results provided by the plugin */
		source?: string;
	};
	/** Callback for plugin activation */
	UNSAFE_onActivation?: () => void;
	/** Register Plugin Actions */
	action?: LinkPickerPluginAction;
	/** Options to override certain configurable styles in the link picker */
	uiOptions?: LinkPickerUiOptions;
}

export interface LinkPickerPluginAction {
	label: MessageDescriptor | string;
	callback: () => void;
}

export type LinkPickerPluginErrorFallback = (error: unknown, retry: () => void) => ReactNode;

export type LinkPickerPluginEmptyStateNoResults = () => ReactNode;

export interface PickerState {
	selectedIndex: number;
	activeIndex: number;
	url: string;
	displayText: string;
	invalidUrl: boolean;
	activeTab: number;
	/** When true, even if the selected index is -1, don't hide the recents. */
	preventHidingRecents: boolean;
	hasPreview: boolean;
}

interface Meta {
	/** Indicates how the link was picked. */
	inputMethod: LinkInputType;
}

interface OnSubmitParameter {
	/** The `url` of the linked resource. */
	url: string;
	/** The desired text to be displayed alternatively to the title of the linked resource. */
	displayText: string | null;
	/** The resolved `title` of the resource at the time of link picking (if applicable, null if not known). */
	title: string | null;
	/** Meta data about the link picking submission. */
	meta: Meta;
	/**
	 * The input value of the `url` field at time of submission if inserted "manually".
	 * This can useful if the `url` was manually inserted with a value that is different from the normalised value returned as `url`.
	 * @example
	 * { url: 'https://google.com', rawUrl: 'google.com' }
	 */
	rawUrl?: string;
	/** Raw object from the selected resource */
	data?: Record<string, unknown>;
}

export interface LinkPickerProps {
	/**
	 * Callback to fire on form submission.
	 */
	onSubmit: (arg: OnSubmitParameter, analytic?: UIAnalyticsEvent | null) => void;
	/**
	 * Callback to fire when the cancel button is clicked.
	 * If not provided, cancel button is not displayed.
	 */
	onCancel?: () => void;
	/** Callback to fire when content is changed inside the link picker e.g. items, when loading, tabs */
	onContentResize?: () => void;
	/** The url of the linked resource for editing. */
	url?: string;
	/** The desired text to be displayed alternatively to the title of the linked resource for editing. */
	displayText?: string | null;
	/** The desired text to be displayed below the display text input field. Only displayed when `platform-linking-visual-refresh-link-picker` gate is enabled. */
	displayHelperText?: string | null;
	/** Plugins that provide link suggestions / search capabilities. */
	plugins?: LinkPickerPlugin[];
	/** If set true, Link picker will show the loading spinner where the tabs and results will show. */
	isLoadingPlugins?: boolean;
	/** Hides the link picker display text field if set to true. */
	hideDisplayText?: boolean;
	/** Disables the default width containing the link picker. */
	disableWidth?: boolean;
	/** Override the default left padding. */
	paddingLeft?: string;
	/** Override the default right padding. */
	paddingRight?: string;
	/** Override the default top padding. */
	paddingTop?: string;
	/** Override the default bottom padding. */
	paddingBottom?: string;
	/** Customise the link picker root component */
	component?: React.ComponentType<Partial<LinkPickerProps> & { children: React.ReactElement }>;
	/** Allows for customisation of text in the link picker. */
	customMessages?: CustomLinkPickerMessages;
	/** Allows height of search results to adapt to the number of results being displayed. */
	adaptiveHeight?: boolean;
	featureFlags?: Record<string, unknown>;
	/** Controls showing a "submission in-progres" UX */
	isSubmitting?: boolean;
	/** This prop controls where the submit button appears. When true the submit button will move below the input field and be full width */
	moveSubmitButton?: boolean;
	/** Ref to the link picker search input. */
	inputRef?: Ref<HTMLInputElement>;
	/**Disables URLs that do not have an embeddable preview */
	previewableLinksOnly?: boolean;
}

type CustomLinkPickerMessages = {
	/** Label for the link input field */
	linkLabel?: MessageDescriptor;
	/** Aria label for the link input field */
	linkAriaLabel?: MessageDescriptor;
	/** Placeholder for the link input field */
	linkPlaceholder?: MessageDescriptor;
	/** Label for the link display text field */
	linkTextLabel?: MessageDescriptor;
	/** Placeholder for the link display text field */
	linkTextPlaceholder?: MessageDescriptor;
	/** Helper text for the link display text field */
	linkHelperTextLabel?: MessageDescriptor;
	/** Label for the submit button */
	submitButtonLabel?: MessageDescriptor;
};
