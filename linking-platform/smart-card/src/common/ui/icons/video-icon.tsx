import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/video/16';
import VideoIcon from '@atlaskit/icon/core/video';

const VideoIconWithColor = (props: ComponentPropsWithoutRef<typeof VideoIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="redBold"
			icon={VideoIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

VideoIconWithColor.displayName = 'VideoIconWithColor';

export default VideoIconWithColor;
