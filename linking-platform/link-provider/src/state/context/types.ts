import type { ReactNode } from 'react';

import { type Store } from 'redux';

import type { LinkPreview, CardPlatform } from '@atlaskit/link-extractors/types';
import type { CardStore } from '@atlaskit/linking-common/store';
import type { CardAppearance, CardType, ProductType } from '@atlaskit/linking-common/types';

import type CardClient from '../../client';
import { type CardConnections } from '../store/types';

// TODO: Remove once mobile team move to using authentication
// flow https://product-fabric.atlassian.net/browse/SL-347.
export interface CardAuthFlowOpts {
	/**
	 * Enable and disable authentication flow.
	 * If disabled, Smart Links will not offer Connect option when the link returns forbidden nor unauthorized status.
	 */
	authFlow?: 'oauth2' | 'disabled';
}

/** An auth rejection; the host decides how to respond. */
export type SmartLinkAuthFailure = {
	/** Smart Link extension key, when available. */
	extensionKey?: string;
	/** The app's name from the Smart Link, when available. */
	providerName?: string;
	/** Error category reported by the auth client, when available. */
	reason?: string;
	/** OAuth service key from the auth URL, when it has exactly one. */
	serviceKey?: string;
	/** Smart Link status captured before the auth attempt. */
	statusBeforeAuth: CardType;
};

export type CardContext = {
	config: CardAuthFlowOpts;
	connections: CardConnections;
	extractors: {
		getPreview: (url: string, platform?: CardPlatform) => LinkPreview | undefined;
	};
	onSmartLinkAuthFailed?: (request: SmartLinkAuthFailure) => void | Promise<void>;
	openPreviewPanel?: (props: {
		ari: string;
		iconUrl: string | undefined;
		name: string;
		// In this version of openPreviewPanel panelData is required where is in CardProviderProps it is ommited completely
		// hence the reason for it defined here explicitly
		panelData: { embedUrl?: string };
		url: string;
	}) => void;
	/**
	 * Plugins available for this provider, resolved from the `plugins` prop. Read them with
	 * `usePlugins`.
	 */
	plugins?: LinkProviderPlugins;
	prefetchStore: Record<string, boolean>;
	store: Store<CardStore>;
} & Pick<
	// Most of the values are coming directly from Props given to CardProvider
	CardProviderProps,
	| 'linkNavigation'
	| 'bridgeProduct'
	| 'rovoOptions'
	| 'choreographer'
	| 'isAdminHubAIEnabled'
	| 'isPreviewPanelAvailable'
	| 'isPreviewRestricted'
	| 'product'
	| 'renderers'
	| 'shouldControlDataExport'
	| 'xpcProduct'
	| 'xpcSubProduct'
>;

export interface CardProviderStoreOpts {
	initialState: CardStore;
}

export interface RovoOptions {
	isRovoEnabled: boolean;
	isRovoLLMEnabled: boolean;
}

export interface CardProviderRenderers {
	adf?: (adf: string) => React.ReactNode;
	emoji?: (emoji?: string, parentComponent?: CardAppearance) => React.ReactNode;
	snippet?: (props: SnippetRendererProps) => React.ReactNode;
}

/**
 * `SmartCardProvider` calls `resolve` with its own values, so each plugin decides whether it's
 * available for the current product and user.
 */
export interface LinkProviderPluginResolver {
	render?: () => ReactNode;
	resolve: (context: LinkProviderPluginContext) => LinkProviderPlugins;
}

/** `SmartCardProvider` values that plugins use to decide whether they're available. */
export type LinkProviderPluginContext = Pick<CardProviderProps, 'product' | 'rovoOptions'>;

/**
 * Plugins available for a `SmartCardProvider`. Each one is optional: linking components use the
 * plugins they support and ignore the rest. Plugins are added here as features move into the
 * plugins package.
 */
export interface LinkProviderPlugins {
	remix?: LinkProviderRemixPlugin;
}

export interface LinkProviderRemixPlugin {
	/**
	 * Whether Remix is available for the current user.
	 */
	isAvailable: () => boolean;
	/**
	 * Opens Remix for a link. `anchorElement` is the element the user clicked, which Remix
	 * positions its options next to.
	 */
	open: (options: { anchorElement?: HTMLElement; url: string }) => void;
}

/** Product-owned component that connects Smart Card experiments to its existing choreographer. */
export type SmartLinkChoreographer = React.ComponentType<SmartLinkChoreographerProps>;

export type SmartLinkChoreographerProps = {
	children: (props: { hasPermission: boolean }) => React.ReactNode;
	isActive: boolean;
	messageId: string;
	onUnavailable: () => void;
	/** Recheck eligibility and assignment at slot offer; false or a throw declines. */
	shouldClaim?: () => boolean;
};

export type CardProviderProps = {
	/**
	 * Optional override for the bridge value used when wrapping smart link URLs for
	 * cross-product analytics. When omitted, defaults to `'smartLinks'`.
	 */
	bridgeProduct?: string;
	/**
	 * Any React components contains linking components.
	 */
	children: React.ReactNode;
	/** Stable product-owned component shared by Smart Card experiments. */
	choreographer?: SmartLinkChoreographer;
	/**
	 * A client that make request to Object Resolver Service to resolve url for linking components.
	 * See `CardClient` for more details.
	 */
	client?: CardClient;
	/**
	 * Flag indicated whether AI feature is enabled in AdminHub.
	 * This is required for AI summary in Smart Links.
	 */
	isAdminHubAIEnabled?: boolean;
	/**
	 * Optional callback establishing whether the preview panel is available in the host application for the given linked resource.
	 * Required to be defined to add support for preview panel handling.
	 */
	isPreviewPanelAvailable?: (props: { ari: string }) => boolean;
	/**
	 * Optional callback establishing whether previewing the given linked resource is restricted
	 * (e.g. cross-unit). When it returns `true`, the entire preview affordance is suppressed
	 * (neither a preview panel nor a fallback preview modal is shown).
	 */
	isPreviewRestricted?: (props: { ari: string }) => boolean;
	/** Resolve a Flexible Card destination without changing its metadata address. */
	linkNavigation?: (url: string) => {
		target?: '_blank' | '_self' | '_top' | '_parent';
		url: string;
	};
	onSmartLinkAuthFailed?: (request: SmartLinkAuthFailure) => void | Promise<void>;
	/**
	 * Optional callback enabling the host application to open a preview panel for compatible links.
	 * Required to be defined to add support for preview panel handling.
	 */
	openPreviewPanel?: (props: {
		ari: string;
		iconUrl: string | undefined;
		name: string;
		url: string;
	}) => void;
	/**
	 * Restricted features for linking components, created once with `createLinkProviderPlugins`
	 * from `@atlassian/link-provider-plugins`. Keep the value stable (for example with `useMemo`),
	 * otherwise every linking component under the provider re-renders.
	 */
	plugins?: LinkProviderPluginResolver;
	/**
	 * The product that linking components are rendered in.
	 * Required for features such as AI summary in Smart Links, Loom embed Smart Links, etc.
	 */
	product?: ProductType;
	/**
	 * A render function returning React component.
	 * `emoji` is used to render Smart Link icon for Confluence emoji.
	 */
	renderers?: CardProviderRenderers;
	rovoOptions?: RovoOptions;
	/**
	 * Flag indicated by compliance to determine whether the content of this link should be controlled for data export.
	 * This controls whether or not the link data should be blocked for data export during certain features, such as PDF export in Confluence.
	 */
	shouldControlDataExport?: boolean;
	/**
	 * The options for redux store that contains linking data.
	 * `initialState` can be used to set linking data and prevent card client to make a request to resolve the url.
	 */
	storeOptions?: CardProviderStoreOpts;
	/**
	 * The product identifier used exclusively for cross-product (XPC) URL wrapping analytics
	 * (e.g. 'confluence', 'jira'). Does not affect link resolution.
	 * Takes precedence over `product` when determining the source product for XPC URL wrapping.
	 */
	xpcProduct?: string;
	/**
	 * The sub-product identifier used exclusively for cross-product (XPC) URL wrapping analytics
	 * (e.g. 'jsw', 'jsm'). Does not affect link resolution.
	 */
	xpcSubProduct?: string;
} & CardAuthFlowOpts;

export type SnippetRendererProps = AISnippetRendererProps | Record<string, never>;

export type BaseSnippetRendererProps = {
	fallbackComponent: React.ReactNode;
	fallbackText: string;
	isHidden?: boolean;
	maxLines: number;
};
export type AISnippetRendererProps = BaseSnippetRendererProps & {
	cloudId: string;
	contentId: string;
	contentType: string;
	showFooter?: boolean;
};
