import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/folder/16';
import FolderClosedIcon from '@atlaskit/icon/core/folder-closed';

const FolderClosedIconWithColor = (props: ComponentPropsWithoutRef<typeof FolderClosedIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="blueBold"
			icon={FolderClosedIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

FolderClosedIconWithColor.displayName = 'FolderClosedIconWithColor';

export default FolderClosedIconWithColor;
