import React, { lazy, Suspense } from 'react';

import { useConfluencePageData } from '../../../hooks/useConfluencePageData';

import { useEmbeddedConfluencePage } from './embedded-confluence-page-context';
import { loadEmbeddedConfluencePage } from './loadEmbeddedConfluencePage';

interface IFrameProps {
	childRef?: React.Ref<HTMLIFrameElement>;
	className?: string;
	extensionKey?: string;
}

const LazyEmbeddedConfluencePage = lazy(() =>
	loadEmbeddedConfluencePage().then((Page) => ({ default: Page })),
);

/**
 * Iframe element isolated for DI purposes.
 *
 * Confluence `Page` is a dynamic import (or an injected host component) so
 * Trello and other non-Confluence embeds do not statically pull
 * `@atlaskit/embedded-confluence`.
 */
export const IFrame = ({
	childRef,
	className,
	extensionKey,
	...props
}: React.ComponentProps<'iframe'> & IFrameProps): React.JSX.Element => {
	const confluencePageData = useConfluencePageData(props.src || '', extensionKey || '');
	const InjectedPage = useEmbeddedConfluencePage();
	const Page = InjectedPage ?? LazyEmbeddedConfluencePage;

	const fallbackIframe = (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<iframe className={className} {...props} ref={childRef} title={props.title} />
	);

	// Conditional rendering: Page component for lp-cc-embed URLs, iframe for everything else
	return confluencePageData ? (
		<Suspense fallback={fallbackIframe}>
			<Page
				hostname={confluencePageData.hostname}
				spaceKey={confluencePageData.spaceKey}
				contentId={confluencePageData.contentId}
				parentProduct={confluencePageData.parentProduct}
				hash={confluencePageData.hash}
				mode={confluencePageData.mode}
				locale={confluencePageData.locale}
				iframeRef={childRef}
				onLoad={props.onLoad}
				onMouseEnter={props.onMouseEnter}
				onMouseLeave={props.onMouseLeave}
				sandbox={props.sandbox}
				allowedFeatures={confluencePageData.allowedFeatures}
				themeState={confluencePageData.themeStateObject}
				userInfo={confluencePageData.userInfo}
			/>
		</Suspense>
	) : (
		fallbackIframe
	);
};
