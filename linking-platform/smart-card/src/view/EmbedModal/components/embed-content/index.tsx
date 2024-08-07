/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { di } from 'react-magnetic-di';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { getIframeSandboxAttribute } from '../../../../utils';
import { type EmbedProps } from './types';
import { IFrame } from '../../../EmbedCard/components/IFrame';

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
