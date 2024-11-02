import React from 'react';

import { Box, Inline } from '@atlaskit/primitives';

import EditIcon from '../../core/edit';
import LinkExternalIcon from '../../core/link-external';
import PaintBucketIcon from '../../core/paint-bucket';
import PaintPaletteIcon from '../../core/paint-palette';



const IconColorExample = () => {
	return (
		<Inline space='space.100'>
			<Box>
				<EditIcon color="var(--ds-text)" label="" />
			</Box>
			<Box>
				<PaintPaletteIcon color="var(--ds-icon-accent-magenta)" label="" />
			</Box>
			<Box>
				<LinkExternalIcon color="var(--ds-link)" label="" />
			</Box>
			<Box>
				<PaintBucketIcon color="currentColor" label="" />
			</Box>
		</Inline>
	);
};

export default IconColorExample;
