import {
	createContext,
	useContext,
	type ComponentType,
	type MouseEventHandler,
	type Provider,
	type ReactEventHandler,
	type Ref,
} from 'react';

/**
 * Props forwarded to `@atlaskit/embedded-confluence` `Page` from the embed iframe.
 * Kept local so this module never imports the Confluence package.
 */
export type EmbeddedConfluencePageProps = {
	allowedFeatures?: unknown;
	contentId: string;
	hash?: string;
	hostname: string;
	iframeRef?: Ref<HTMLIFrameElement>;
	locale?: string;
	mode?: string;
	onLoad?: ReactEventHandler<HTMLIFrameElement>;
	onMouseEnter?: MouseEventHandler<HTMLIFrameElement>;
	onMouseLeave?: MouseEventHandler<HTMLIFrameElement>;
	parentProduct?: string;
	sandbox?: string;
	spaceKey: string;
	themeState?: unknown;
	userInfo?: unknown;
};

export type EmbeddedConfluencePageComponent = ComponentType<EmbeddedConfluencePageProps>;

const EmbeddedConfluencePageContext = createContext<EmbeddedConfluencePageComponent | null>(null);

/**
 * Hosts that want Confluence page embeds can inject `Page` here so Trello and
 * other products never compile `@atlaskit/embedded-confluence` as a hard import.
 */
export const EmbeddedConfluencePageProvider: Provider<EmbeddedConfluencePageComponent | null> =
	EmbeddedConfluencePageContext.Provider;

export const useEmbeddedConfluencePage = (): EmbeddedConfluencePageComponent | null =>
	useContext(EmbeddedConfluencePageContext);
