import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/source-code/16';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

const AngleBracketsIconWithColor = (props: ComponentPropsWithoutRef<typeof AngleBracketsIcon>) => {
	return (
		<IconTile
			{...props}
			appearance="blueBold"
			icon={AngleBracketsIcon}
			size="16"
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

AngleBracketsIconWithColor.displayName = 'AngleBracketsIconWithColor';

export default AngleBracketsIconWithColor;
