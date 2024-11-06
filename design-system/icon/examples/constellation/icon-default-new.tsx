import React from 'react';

import { Box, Inline } from '@atlaskit/primitives';

import AttachmentIcon from '../../core/attachment';
import ImageIcon from '../../core/image';
import OfficeBuildingIcon from '../../core/office-building';
import StopwatchIcon from '../../core/stopwatch';

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
