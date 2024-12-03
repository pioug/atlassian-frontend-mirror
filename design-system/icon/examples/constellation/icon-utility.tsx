import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/utility/arrow-right';
import ChevronIcon from '@atlaskit/icon/utility/chevron-down';
import DragHandleIcon from '@atlaskit/icon/utility/drag-handle';
import ErrorIcon from '@atlaskit/icon/utility/error';
import { Box, Inline } from '@atlaskit/primitives';

const IconUtilityExample = () => {
	return (
		<Inline space="space.100">
			<Box>
				<ChevronIcon label="" />
			</Box>
			<Box>
				<ArrowRightIcon label="" />
			</Box>
			<Box>
				<ErrorIcon label="" />
			</Box>
			<Box>
				<DragHandleIcon label="" />
			</Box>
		</Inline>
	);
};

export default IconUtilityExample;
