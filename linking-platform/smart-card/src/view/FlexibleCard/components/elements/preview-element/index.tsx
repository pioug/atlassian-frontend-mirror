import React from 'react';

import { MediaType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type Media as MediaData } from '../../../../../state/flexible-ui-context/types';
import type { ElementProps } from '../index';
import MediaElement from '../media-element';

export type PreviewElementProps = ElementProps & {
	/**
	 * An image URL to render. This will replace the default image from smart link data.
	 */
	overrideUrl?: string;
	/**
	 * Function to be called on error loading media.
	 * @internal
	 */
	onError?: () => void;
	onLoad?: () => void;
};

const PreviewElement = (props: PreviewElementProps) => {
	const { overrideUrl, ...rest } = props ?? {};
	const context = useFlexibleUiContext();
	const data: MediaData | undefined = overrideUrl
		? { url: overrideUrl, type: MediaType.Image }
		: context?.preview;

	if (!data) {
		return null;
	}
	return <MediaElement {...rest} {...data} />;
};

export default PreviewElement;
