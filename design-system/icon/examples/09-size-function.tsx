import React from 'react';

import AddIcon from '@atlaskit/icon/core/add';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Stack } from '@atlaskit/primitives/compiled';

const icons = [AddIcon, ChevronDownIcon];

export default function SizeFunctionExample() {
	return (
		<Stack space="space.200" alignInline="start">
			{icons.map((Icon) => (
				<Icon label="" size={(iconName) => (iconName.startsWith('Chevron') ? 'small' : 'medium')} />
			))}
		</Stack>
	);
}
