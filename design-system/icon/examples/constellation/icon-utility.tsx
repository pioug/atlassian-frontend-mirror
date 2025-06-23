/* elint-disable @atlaskit/design-system/no-deprecated-imports */
import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import { Inline } from '@atlaskit/primitives/compiled';

const IconUtilityExample = () => {
	return (
		<Inline space="space.100">
			<ChevronDownIcon label="" />
			<ArrowRightIcon label="" />
			<StatusErrorIcon label="" />
			<DragHandleVerticalIcon label="" />
		</Inline>
	);
};

export default IconUtilityExample;
