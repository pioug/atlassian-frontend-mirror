import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/presentation/16';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';

const ChartBarIconWithColor = (props: ComponentPropsWithoutRef<typeof ChartBarIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="purpleBold"
			icon={ChartBarIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

ChartBarIconWithColor.displayName = 'ChartBarIconWithColor';

export default ChartBarIconWithColor;
