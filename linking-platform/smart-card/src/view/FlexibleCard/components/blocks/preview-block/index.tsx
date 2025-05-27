import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../../../constants';
import { useFlexibleUiOptionContext } from '../../../../../state/flexible-ui-context';

import PreviewBlockResolvedView from './resolved';
import { type PreviewBlockProps } from './types';

/**
 * Represents a PreviewBlock, which typically contains media or other large format content.
 * @public
 * @param {PreviewBlockProps} PreviewBlock
 * @see Block
 */
const PreviewBlock = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	status = SmartLinkStatus.Fallback,
	testId = 'smart-block-preview',
	overrideUrl,
	...blockProps
}: PreviewBlockProps) => {
	const ui = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleUiOptionContext()
		: undefined;

	return (
		<PreviewBlockResolvedView
			{...blockProps}
			{...(fg('platform-linking-flexible-card-context')
				? { size: blockProps.size ?? ui?.size }
				: undefined)}
			testId={testId}
			overrideUrl={overrideUrl}
		/>
	);
};

export default PreviewBlock;
