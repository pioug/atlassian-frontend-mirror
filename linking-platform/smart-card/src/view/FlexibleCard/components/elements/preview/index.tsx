/** @jsx jsx */
import React, { useContext } from 'react';
import { jsx } from '@emotion/react';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { MediaType } from '../../../../../constants';
import Media from '../media';
import { type Media as MediaData } from '../../../../../state/flexible-ui-context/types';
import { type PreviewProps } from './types';

const Preview: React.FC<PreviewProps> = (props) => {
	const { overrideUrl, ...rest } = props ?? {};
	const context = useContext(FlexibleUiContext);
	const data: MediaData | undefined = overrideUrl
		? { url: overrideUrl, type: MediaType.Image }
		: context?.preview;

	if (!data) {
		return null;
	}

	return <Media {...rest} {...data} />;
};

export default Preview;
