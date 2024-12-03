import React from 'react';

import { Inline } from '@atlaskit/primitives';

import AddIcon from '../../core/add';
import { IconTile } from '../../src';

const sizes = ['16', '24', '32', '40', '48'] as const;

const IconSizeExample = () => {
	return (
		<Inline space="space.200" shouldWrap={true}>
			{sizes.map((size) => (
				<IconTile
					key={size}
					icon={AddIcon}
					label=""
					appearance="purple"
					size={size}
					shape="square"
				/>
			))}
		</Inline>
	);
};

export default IconSizeExample;
