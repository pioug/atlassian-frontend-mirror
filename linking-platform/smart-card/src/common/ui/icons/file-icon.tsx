import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/generic/16';
import FileIcon from '@atlaskit/icon/core/file';

const FileIconWithColor = (props: ComponentPropsWithoutRef<typeof FileIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="grayBold"
			icon={FileIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};
FileIconWithColor.displayName = 'FileIconWithColor';

export default FileIconWithColor;
