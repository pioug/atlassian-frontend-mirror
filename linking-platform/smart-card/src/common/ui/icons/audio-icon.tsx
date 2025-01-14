import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/audio/16';
import AudioIcon from '@atlaskit/icon/core/audio';

const AudioIconWithColor = (props: ComponentPropsWithoutRef<typeof AudioIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="redBold"
			icon={AudioIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

AudioIconWithColor.displayName = 'AudioIconWithColor';

export default AudioIconWithColor;
