import React from 'react';
import {
	MediaTypeIcon as CompiledMediaTypeIcon,
	type FileIconProps,
} from './media-type-icon-compiled';

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
	render(): React.JSX.Element {
		return <CompiledMediaTypeIcon {...this.props} />;
	}
}

export type { IconWrapperProps, FileIconProps } from './media-type-icon-compiled';
