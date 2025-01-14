import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/image/16';
import ImageIcon from '@atlaskit/icon/core/image';

const ImageIconWithColor = (props: ComponentPropsWithoutRef<typeof ImageIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="yellowBold"
			icon={ImageIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

ImageIconWithColor.displayName = 'ImageIconWithColor';

export default ImageIconWithColor;
