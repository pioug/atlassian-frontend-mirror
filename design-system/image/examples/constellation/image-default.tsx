import React from 'react';

import Image from '@atlaskit/image';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, xcss } from '@atlaskit/primitives';

import ExampleImage from '../images/Celebration.png';

const containerStyles = xcss({
	height: '100%',
});

const ImageDefaultExample = () => {
	return (
		<Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
			<Image src={ExampleImage} alt="Simple example" testId="image" />
		</Inline>
	);
};

export default ImageDefaultExample;
