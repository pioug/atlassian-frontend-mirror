/** @jsx jsx */
import { type FC } from 'react';
import { di } from 'react-magnetic-di';
import { css, jsx } from '@emotion/react';
import { getIframeSandboxAttribute } from '../../../../utils';
import { type EmbedProps } from './types';
import { IFrame } from '../../../EmbedCard/components/IFrame';

const iframeCss = css({
	width: '100%',
	height: 'calc(100vh - 208px)',
});

const EmbedContent: FC<EmbedProps> = ({ isTrusted, name, src, testId }) => {
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
