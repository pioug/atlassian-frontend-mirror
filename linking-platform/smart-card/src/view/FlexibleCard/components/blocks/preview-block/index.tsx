/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../../../../constants';

import PreviewBlockOld from './indexOld';
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

const Exported = (props: PreviewBlockProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <PreviewBlock {...props} />;
	} else {
		return <PreviewBlockOld {...props} />;
	}
};

export default Exported;
