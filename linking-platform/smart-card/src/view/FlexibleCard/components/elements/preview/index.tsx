import React, { useContext } from 'react';

import { MediaType } from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type Media as MediaData } from '../../../../../state/flexible-ui-context/types';
import Media from '../media';

import { type PreviewProps } from './types';

const Preview = (props: PreviewProps) => {
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
