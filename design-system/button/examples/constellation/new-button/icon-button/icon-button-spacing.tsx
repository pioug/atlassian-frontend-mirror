import React from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';
import { Inline } from '@atlaskit/primitives';

import { IconButton } from '../../../../src/new';

const IconButtonSpacingExample = () => {
	return (
		<Inline space="space.200">
			<IconButton icon={MoreIcon} appearance="primary" label="More actions" />
			<IconButton icon={MoreIcon} appearance="primary" spacing="compact" label="More actions" />
		</Inline>
	);
};

export default IconButtonSpacingExample;
