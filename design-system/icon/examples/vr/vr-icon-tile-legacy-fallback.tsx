import React from 'react';

import { IconTile } from '@atlaskit/icon';

import AddIcon from '../../core/add';
import AddIconOld from '../../glyph/add';

const IconTileLegacyFallbackExample = () => {
	return (
		<IconTile
			icon={AddIcon}
			label=""
			appearance="greenBold"
			shape="square"
			size="24"
			LEGACY_fallbackComponent={<AddIconOld label="" primaryColor="green" />}
		/>
	);
};

export default IconTileLegacyFallbackExample;
