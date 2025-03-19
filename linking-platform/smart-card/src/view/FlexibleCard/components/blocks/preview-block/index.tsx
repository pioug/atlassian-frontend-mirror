import React from 'react';

import { SmartLinkStatus } from '../../../../../constants';

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
	return <PreviewBlockResolvedView {...blockProps} testId={testId} overrideUrl={overrideUrl} />;
};

export default PreviewBlock;
