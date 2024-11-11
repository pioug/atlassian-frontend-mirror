/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Image from '@atlaskit/image';
import { Inline, xcss } from '@atlaskit/primitives';

import Dark from '../images/SpotDark.png';
import Light from '../images/SpotLight.png';

const containerStyles = xcss({
	height: '100%',
});

const ImageThemedExample = () => {
	return (
		<Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
			<Image src={Light} srcDark={Dark} alt="Theming in action" testId="image" />
		</Inline>
	);
};

export default ImageThemedExample;
