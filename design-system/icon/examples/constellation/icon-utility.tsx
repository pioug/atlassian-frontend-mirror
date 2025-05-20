import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/utility/arrow-right';
import ChevronIcon from '@atlaskit/icon/utility/chevron-down';
import DragHandleVerticalIcon from '@atlaskit/icon/utility/drag-handle-vertical';
import ErrorIcon from '@atlaskit/icon/utility/error';
import { Inline } from '@atlaskit/primitives';

const IconUtilityExample = () => {
	return (
		<Inline space="space.100">
			<ChevronIcon label="" />
			<ArrowRightIcon label="" />
			<ErrorIcon label="" />
			<DragHandleVerticalIcon label="" />
		</Inline>
	);
};

export default IconUtilityExample;
