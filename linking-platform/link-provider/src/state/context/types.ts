import { type Store } from 'redux';
import { type CardAppearance, type CardStore, type ProductType } from '@atlaskit/linking-common';
import { type LinkPreview, type CardPlatform } from '@atlaskit/link-extractors';
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

export interface CardContext {
	store: Store<CardStore>;
	prefetchStore: Record<string, boolean>;
	connections: CardConnections;
	config: CardAuthFlowOpts;
	extractors: {
		getPreview: (url: string, platform?: CardPlatform) => LinkPreview | undefined;
	};
	renderers?: CardProviderRenderers;
	isAdminHubAIEnabled?: boolean;
	product?: ProductType;
	shouldControlDataExport?: boolean;
	isPreviewPanelAvailable?: (props: { ari: string }) => boolean;
	openPreviewPanel?: (props: {
		url: string;
		ari: string;
		name: string;
		iconUrl: string | undefined;
	}) => void;
}

export interface CardProviderStoreOpts {
	initialState: CardStore;
}

export interface CardProviderRenderers {
	adf?: (adf: string) => React.ReactNode;
	emoji?: (emoji?: string, parentComponent?: CardAppearance) => React.ReactNode;
	snippet?: (props: SnippetRendererProps) => React.ReactNode;
}

export type CardProviderProps = {
	/**
	 * A client that make request to Object Resolver Service to resolve url for linking components.
	 * See `CardClient` for more details.
	 */
	client?: CardClient;
	/**
	 * The options for redux store that contains linking data.
	 * `initialState` can be used to set linking data and prevent card client to make a request to resolve the url.
	 */
	storeOptions?: CardProviderStoreOpts;
	/**
	 * Any React components contains linking components.
	 */
	children: React.ReactNode;
	/**
	 * A render function returning React component.
	 * `emoji` is used to render Smart Link icon for Confluence emoji.
	 */
	renderers?: CardProviderRenderers;
	/**
	 * Flag indicated whether AI feature is enabled in AdminHub.
	 * This is required for AI summary in Smart Links.
	 */
	isAdminHubAIEnabled?: boolean;
	/**
	 * The product that linking components are rendered in.
	 * Required for features such as AI summary in Smart Links, Loom embed Smart Links, etc.
	 */
	product?: ProductType;
	/**
	 * Flag indicated by compliance to determine whether the content of this link should be controlled for data export.
	 * This controls whether or not the link data should be blocked for data export during certain features, such as PDF export in Confluence.
	 */
	shouldControlDataExport?: boolean;
	/**
	 * Optional callback establishing whether the preview panel is available in the host application for the given linked resource.
	 * Required to be defined to add support for preview panel handling.
	 */
	isPreviewPanelAvailable?: (props: { ari: string }) => boolean;
	/**
	 * Optional callback enabling the host application to open a preview panel for compatible links.
	 * Required to be defined to add support for preview panel handling.
	 */
	openPreviewPanel?: (props: {
		url: string;
		ari: string;
		name: string;
		iconUrl: string | undefined;
	}) => void;
} & CardAuthFlowOpts;

export type SnippetRendererProps = AISnippetRendererProps | Record<string, never>;

export type BaseSnippetRendererProps = {
	fallbackText: string;
	fallbackComponent: React.ReactNode;
	maxLines: number;
	isHidden?: boolean;
};
export type AISnippetRendererProps = BaseSnippetRendererProps & {
	contentId: string;
	contentType: string;
	cloudId: string;
	showFooter?: boolean;
};
