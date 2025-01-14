import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

const ListBulletedIconWithColor = (props: ComponentPropsWithoutRef<typeof ListBulletedIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="greenBold"
			icon={ListBulletedIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

ListBulletedIconWithColor.displayName = 'ListBulletedIconWithColor';

export default ListBulletedIconWithColor;
