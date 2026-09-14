import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Bleed } from '@atlaskit/primitives/compiled/bleed';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	bleedItem: { position: 'relative' },
});

export default function Basic(): React.JSX.Element {
	return (
		<Box padding="space.200" backgroundColor="color.background.neutral">
			<Inline space="space.100">
				<ExampleBox />
				<ExampleBox />
				<Bleed inline="space.150">
					<ExampleBox
						xcss={styles.bleedItem}
						backgroundColor="color.background.discovery.pressed"
					/>
				</Bleed>
				<ExampleBox />
				<ExampleBox />
			</Inline>
		</Box>
	);
}
