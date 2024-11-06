import React from 'react';

import { Box, Inline } from '@atlaskit/primitives';

import ArrowRightIcon from '../../utility/arrow-right';
import ChevronIcon from '../../utility/chevron-down';
import DragHandleIcon from '../../utility/drag-handle';
import ErrorIcon from '../../utility/error';

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
