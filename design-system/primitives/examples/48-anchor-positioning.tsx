import React from 'react';

import { cssMap } from '@compiled/react';

import { Anchor, Box, Grid } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	topBox: { height: '100vh' },
	outerBox: {},
	bottomBox: { height: '5rem', overflow: 'scroll' },
});

// This example is 100% to demonstrate that you need an explicit `position` for
// the anchor to overcome a limitation with the `absolute` positioning of the
// visually hidden element within.
//
// DO NOT ALTER THIS UNLESS YOU KNOW WHAT YOU ARE DOING
//
export default function Default(): React.JSX.Element {
	return (
		<Box xcss={styles.outerBox} backgroundColor="color.background.accent.lime.subtlest">
			<Grid>
				<Box xcss={styles.topBox}></Box>
				<Box xcss={styles.bottomBox}>
					{[...Array(20).keys()].map(() => (
						<Box>
							<Anchor testId="anchor-default" href="/home" target="_blank">
								I am an anchor
							</Anchor>
						</Box>
					))}
				</Box>
			</Grid>
		</Box>
	);
}
