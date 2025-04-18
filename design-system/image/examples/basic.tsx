/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Image from '@atlaskit/image';
import { Inline, xcss } from '@atlaskit/primitives';

import ExampleImage from './images/Celebration.png';

const containerStyles = xcss({
	height: '100%',
});

export default () => (
	<Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
		<Image src={ExampleImage} alt="Simple example" testId="image" />
	</Inline>
);
