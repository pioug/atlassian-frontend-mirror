import React from 'react';

import { Page } from '@atlaskit/embedded-confluence';
import { fg } from '@atlaskit/platform-feature-flags';

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
}: React.ComponentProps<'iframe'> & IFrameProps) => {
	const confluencePageData = fg('platform_deprecate_lp_cc_embed')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useConfluencePageData(props.src || '', extensionKey || '')
		: undefined;

	// Conditional rendering: Page component for lp-cc-embed URLs, iframe for everything else
	return confluencePageData && fg('platform_deprecate_lp_cc_embed') ? (
		<Page
			hostname={confluencePageData.hostname}
			spaceKey={confluencePageData.spaceKey}
			contentId={confluencePageData.contentId}
			parentProduct={confluencePageData.parentProduct}
			hash={confluencePageData.hash}
			mode={confluencePageData.mode}
			locale={confluencePageData.locale}
		/>
	) : (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<iframe className={className} {...props} ref={childRef} title={props.title} />
	);
};
