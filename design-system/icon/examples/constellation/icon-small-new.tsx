import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import ChevronIcon from '@atlaskit/icon/core/chevron-down';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import ErrorIcon from '@atlaskit/icon/core/error';
import { Inline } from '@atlaskit/primitives';

const IconSmallNewExample = () => {
	return (
		<Inline space="space.100">
			<ChevronIcon label="" size="small" />
			<ArrowRightIcon label="" size="small" />
			<ErrorIcon label="" size="small" />
			<DragHandleVerticalIcon label="" size="small" />
		</Inline>
	);
};

export default IconSmallNewExample;
