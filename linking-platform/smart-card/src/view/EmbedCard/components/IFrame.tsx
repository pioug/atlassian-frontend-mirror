import React from 'react';

import { Page } from '@atlaskit/embedded-confluence';

import { useConfluencePageData } from '../../../hooks/useConfluencePageData';

interface IFrameProps {
	childRef?: React.Ref<HTMLIFrameElement>;
	className?: string;
	extensionKey?: string;
}

/**
 * Iframe element isolated for DI purposes
 */
export const IFrame = ({
	childRef,
	className,
	extensionKey,
	...props
}: React.ComponentProps<'iframe'> & IFrameProps): React.JSX.Element => {
	const confluencePageData = useConfluencePageData(props.src || '', extensionKey || '');

	// Conditional rendering: Page component for lp-cc-embed URLs, iframe for everything else
	return confluencePageData ? (
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
	) : (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<iframe className={className} {...props} ref={childRef} title={props.title} />
	);
};
