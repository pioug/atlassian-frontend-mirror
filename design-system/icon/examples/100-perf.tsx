import React from 'react';

import { coreIconMetadata } from '@atlaskit/icon/metadata';

const IconComponents = Object.keys(coreIconMetadata).map((name: string) => {
	const icon = require(`../core/${name}.js`);
	return icon.default;
});
export default function AllIcons(): React.JSX.Element {
	return (
		<>
			{IconComponents.map((Icon, index) => (
				<Icon key={String(index)} index={index} />
			))}
		</>
	);
}
