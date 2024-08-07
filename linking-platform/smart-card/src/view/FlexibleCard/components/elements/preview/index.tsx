/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { MediaType } from '../../../../../constants';
import Media from '../media';
import { type Media as MediaData } from '../../../../../state/flexible-ui-context/types';
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
