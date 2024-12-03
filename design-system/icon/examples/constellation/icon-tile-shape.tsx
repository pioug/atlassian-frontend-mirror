import React from 'react';

import { Inline } from '@atlaskit/primitives';

import AddIcon from '../../core/add';
import { IconTile } from '../../src';

const IconSizeExample = () => {
	return (
		<Inline space="space.200">
			<IconTile icon={AddIcon} label="" appearance="blue" shape="square" size="24" />
			<IconTile icon={AddIcon} label="" appearance="blue" shape="circle" size="24" />
		</Inline>
	);
};

export default IconSizeExample;
