import React from 'react';

import AttachmentIcon from '@atlaskit/icon/core/attachment';
import ImageIcon from '@atlaskit/icon/core/image';
import OfficeBuildingIcon from '@atlaskit/icon/core/office-building';
import StopwatchIcon from '@atlaskit/icon/core/stopwatch';
import { Box, Inline } from '@atlaskit/primitives';

const IconDefaultNewExample = () => {
	return (
		<Inline space="space.100">
			<Box>
				<ImageIcon label="" />
			</Box>
			<Box>
				<AttachmentIcon label="" />
			</Box>
			<Box>
				<OfficeBuildingIcon label="" />
			</Box>
			<Box>
				<StopwatchIcon label="" />
			</Box>
		</Inline>
	);
};

export default IconDefaultNewExample;
