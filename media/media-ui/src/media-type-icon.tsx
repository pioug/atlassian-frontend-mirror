import React from 'react';
import { MediaTypeIcon as EmotionMediaTypeIcon } from './media-type-icon-emotion';
import {
	MediaTypeIcon as CompiledMediaTypeIcon,
	type FileIconProps,
} from './media-type-icon-compiled';
import { fg } from '@atlaskit/platform-feature-flags';

export { IconWrapper } from './media-type-icon-emotion';

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
	render() {
		return fg('platform_media_compiled') ? (
			<CompiledMediaTypeIcon {...this.props} />
		) : (
			<EmotionMediaTypeIcon {...this.props} />
		);
	}
}

export type { IconWrapperProps, FileIconProps } from './media-type-icon-compiled';
