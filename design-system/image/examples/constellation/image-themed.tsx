/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Image from '@atlaskit/image';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

import Dark from '../images/SpotDark.png';
import Light from '../images/SpotLight.png';

const containerStyles = xcss({
	height: '100%',
});

const ImageThemedExample = (): JSX.Element => {
	return (
		<Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
			<Image src={Light} srcDark={Dark} alt="Theming in action" testId="image" />
		</Inline>
	);
};

export default ImageThemedExample;
