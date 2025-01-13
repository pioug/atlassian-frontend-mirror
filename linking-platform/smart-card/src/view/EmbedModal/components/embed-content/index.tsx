/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { fg } from '@atlaskit/platform-feature-flags';

import { getIframeSandboxAttribute } from '../../../../utils';
import { IFrame } from '../../../EmbedCard/components/IFrame';

import EmbedContentOld from './indexOld';
import { type EmbedProps } from './types';

const iframeCss = css({
	width: '100%',
	height: 'calc(100vh - 208px)',
});

const EmbedContent = ({ isTrusted, name, src, testId }: EmbedProps) => {
	di(IFrame);
	const sandbox = getIframeSandboxAttribute(isTrusted);
	const props = {
		frameBorder: 0,
		name,
		sandbox,
		src,
		'data-testid': `${testId}-embed`,
	};
	return <IFrame css={iframeCss} {...props} />;
};

const Exported = (props: EmbedProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <EmbedContent {...props} />;
	} else {
		return <EmbedContentOld {...props} />;
	}
};

export default Exported;
