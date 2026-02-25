import React from 'react';

import AttachmentIcon from '@atlaskit/icon/core/attachment';
import ImageIcon from '@atlaskit/icon/core/image';
import OfficeBuildingIcon from '@atlaskit/icon/core/office-building';
import StopwatchIcon from '@atlaskit/icon/core/stopwatch';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/compiled';

const IconDefaultNewExample = (): React.JSX.Element => {
	return (
		<Inline space="space.100">
			<ImageIcon label="" />
			<AttachmentIcon label="" />
			<OfficeBuildingIcon label="" />
			<StopwatchIcon label="" />
		</Inline>
	);
};

export default IconDefaultNewExample;
