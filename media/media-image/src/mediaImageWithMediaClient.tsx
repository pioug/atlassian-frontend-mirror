import React from 'react';
import { withMediaClient } from '@atlaskit/media-client-react';
import { MediaImageBase } from './mediaImageBase';
import type { MediaImageWithMediaClientConfigProps } from './types';

const MediaImageWithMediaClient: React.FC<MediaImageWithMediaClientConfigProps> = (props) => {
	const Image = React.useMemo(() => {
		return withMediaClient(MediaImageBase);
	}, []);

	return <Image {...props} />;
};

export default MediaImageWithMediaClient;
