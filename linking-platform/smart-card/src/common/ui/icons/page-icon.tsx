import React, { type ComponentPropsWithoutRef } from 'react';

import { IconTile } from '@atlaskit/icon';
import LegacyIcon from '@atlaskit/icon-file-type/glyph/document/16';
import PageIcon from '@atlaskit/icon/core/page';

const PageIconWithColor = (props: ComponentPropsWithoutRef<typeof PageIcon>) => {
	return (
		<IconTile
			appearance="blueBold"
			icon={PageIcon}
			size="16"
			{...props}
			LEGACY_fallbackComponent={<LegacyIcon {...props} />}
		/>
	);
};

PageIconWithColor.displayName = 'PageIconWithColor';

export default PageIconWithColor;
