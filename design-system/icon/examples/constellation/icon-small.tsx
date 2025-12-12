import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import ChevronIcon from '@atlaskit/icon/core/chevron-down';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives';

const IconSmallNewExample = (): React.JSX.Element => {
	return (
		<Inline space="space.100">
			<ChevronIcon label="" size="small" />
			<ArrowRightIcon label="" size="small" />
			<StatusErrorIcon label="" size="small" />
			<DragHandleVerticalIcon label="" size="small" />
		</Inline>
	);
};

export default IconSmallNewExample;
