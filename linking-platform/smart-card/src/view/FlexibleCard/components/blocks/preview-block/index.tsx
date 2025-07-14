import React from 'react';

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
	testId = 'smart-block-preview',
	overrideUrl,
	...blockProps
}: PreviewBlockProps) => {
	const ui = useFlexibleUiOptionContext();

	return (
		<PreviewBlockResolvedView
			{...blockProps}
			size={blockProps.size ?? ui?.size}
			testId={testId}
			overrideUrl={overrideUrl}
		/>
	);
};

export default PreviewBlock;
