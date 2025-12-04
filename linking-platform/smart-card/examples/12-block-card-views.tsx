import React from 'react';

import { cssMap } from '@atlaskit/css';
import { HelperMessage } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';
import { Card } from '@atlaskit/smart-card';
import { token } from '@atlaskit/tokens';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

const STORAGE_KEY = 'atlaskit-examples-lp-block-card-views-width-percentage';

const styles = cssMap({
	stickySlider: {
		position: 'sticky',
		top: 0,
		zIndex: 1,
		backgroundColor: token('elevation.surface'),
		paddingBlock: token('space.100'),
	},
});

export default (): React.JSX.Element => {
	const [widthPercentage, setWidthPercentage] = React.useState<number>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored !== null) {
			const parsed = Number.parseInt(stored, 10);
			if (!Number.isNaN(parsed)) {
				return parsed;
			}
		}
		return 100;
	});

	React.useEffect(() => {
		localStorage.setItem(STORAGE_KEY, widthPercentage.toString());
	}, [widthPercentage]);

	return (
		<ExampleContainer title="BlockCard Views">
			<Stack space="space.100">
				<Box xcss={styles.stickySlider}>
					<Range
						aria-label="controlled range"
						step={1}
						value={widthPercentage}
						onChange={(value) => setWidthPercentage(value)}
					/>
					<HelperMessage>
						Change container width to see how block card wrapping to next line.
					</HelperMessage>
				</Box>
				<Box style={{ width: `${widthPercentage}%` }}>
					<CardViewExample appearance="block" CardComponent={Card} />
				</Box>
			</Stack>
		</ExampleContainer>
	);
};
