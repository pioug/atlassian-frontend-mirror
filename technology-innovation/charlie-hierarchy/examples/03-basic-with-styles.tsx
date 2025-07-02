import React from 'react';

import { hierarchy } from '@visx/hierarchy';
import { IntlProvider } from 'react-intl-next';

import { ProfileCard } from '@atlaskit/profilecard';
import { token } from '@atlaskit/tokens';

import { CharlieHierarchy } from '../src';

import { rootNode } from './common/basic-hierachy';

export default function Basic() {
	const root = hierarchy(rootNode);
	return (
		<IntlProvider locale="en">
			<CharlieHierarchy
				root={root}
				nodeSize={[360, 256]}
				size={[500, 100]}
				styles={{
					transformMatrix: {
						scaleX: 0.75,
						scaleY: 0.75,
						skewX: 0,
						skewY: 0,
						translateX: document.body.clientWidth / 2,
						translateY: 120,
					},
					lineAttributes: {
						strokeWidth: 1,
						strokeDasharray: 1,
						stroke: token('color.border.bold'),
					},
					padding: {
						above: 30,
						adjacent: 30,
					},
				}}
			>
				{(node) => {
					return <ProfileCard fullName={node.data.name} meta={node.data.jobTitle} />;
				}}
			</CharlieHierarchy>
		</IntlProvider>
	);
}
