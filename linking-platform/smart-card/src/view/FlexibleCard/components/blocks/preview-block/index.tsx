/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { type PreviewBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';
import PreviewBlockResolvedView from './resolved';

/**
 * Represents a PreviewBlock, which typically contains media or other large format content.
 * @public
 * @param {PreviewBlockProps} PreviewBlock
 * @see Block
 */
const PreviewBlock: React.FC<PreviewBlockProps> = ({
	status = SmartLinkStatus.Fallback,
	testId = 'smart-block-preview',
	overrideUrl,
	...blockProps
}) => {
	return <PreviewBlockResolvedView {...blockProps} testId={testId} overrideUrl={overrideUrl} />;
};

export default PreviewBlock;
