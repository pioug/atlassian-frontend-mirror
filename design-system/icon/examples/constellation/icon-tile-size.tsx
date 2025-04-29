import React from 'react';

import { IconTile } from '@atlaskit/icon';
import AddIcon from '@atlaskit/icon/core/add';
import { Inline } from '@atlaskit/primitives';

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
