import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Bleed } from '@atlaskit/primitives/compiled/bleed';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	bleedItem: { position: 'relative' },
});

export default function Basic(): React.JSX.Element {
	return (
		<Box padding="space.200" backgroundColor="color.background.neutral">
			<Stack space="space.100">
				<ExampleBox />
				<ExampleBox />
				<Bleed block="space.150">
					<ExampleBox
						xcss={styles.bleedItem}
						backgroundColor="color.background.discovery.pressed"
					/>
				</Bleed>
				<ExampleBox />
				<ExampleBox />
			</Stack>
		</Box>
	);
}
