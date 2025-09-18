/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { fg } from '@atlaskit/platform-feature-flags';

import { getIframeSandboxAttribute } from '../../../../utils';
import { IFrame } from '../../../EmbedCard/components/IFrame';

import { type EmbedProps } from './types';

const iframeCss = css({
	width: '100%',
	height: 'calc(100vh - 208px)',
});

const EmbedContent = ({ isTrusted, name, src, testId, ariaLabel, extensionKey }: EmbedProps) => {
	di(IFrame);
	const sandbox = getIframeSandboxAttribute(isTrusted);
	const props = {
		frameBorder: 0,
		name,
		sandbox,
		src,
		'data-testid': `${testId}-embed`,
	};
	return (
		<IFrame
			css={iframeCss}
			aria-label={ariaLabel ?? `${testId}-embed`}
			{...(fg('platform_deprecate_lp_cc_embed') ? { extensionKey } : {})}
			{...props}
		/>
	);
};

export default EmbedContent;
