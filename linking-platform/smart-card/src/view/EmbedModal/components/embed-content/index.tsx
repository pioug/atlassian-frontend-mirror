/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { di } from 'react-magnetic-di';

import { getIframeSandboxAttribute } from '../../../../utils';
import { IFrame } from '../../../EmbedCard/components/IFrame';

import { type EmbedProps } from './types';

const iframeCss = css({
	width: '100%',
	height: 'calc(100vh - 208px)',
});

const EmbedContent = ({ isTrusted, name, src, testId }: EmbedProps) => {
	di(IFrame);
	const sandbox = getIframeSandboxAttribute(isTrusted);
	const props = {
		css: iframeCss,
		frameBorder: 0,
		name,
		sandbox,
		src,
		'data-testid': `${testId}-embed`,
	};
	return <IFrame {...props} />;
};

export default EmbedContent;
