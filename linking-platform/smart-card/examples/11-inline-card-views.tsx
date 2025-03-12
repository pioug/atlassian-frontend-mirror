import React from 'react';

import { cssMap } from '@atlaskit/css';
import { HelperMessage } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';
import Textfield from '@atlaskit/textfield';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

const styles = cssMap({
	boxStyles: {
		width: '300px',
	},
});

export default () => {
	const [fontSize, setFontSize] = React.useState<number | undefined>();
	const [widthPercentage, setWidthPercentage] = React.useState<number>(100);

	const handleOnChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setFontSize(Number(event.currentTarget.value));
	}, []);

	return (
		<ExampleContainer title="InlineCard Views">
			<Stack space="space.100">
				<Box xcss={styles.boxStyles}>
					<Textfield
						placeholder="Set paragraph size in px"
						type="number"
						onChange={handleOnChange}
					/>
					<HelperMessage>Set paragraph size in px. Must be 10px or greater.</HelperMessage>
				</Box>
				<Box>
					<Range
						aria-label="controlled range"
						step={1}
						value={widthPercentage}
						onChange={(value) => setWidthPercentage(value)}
					/>
					<HelperMessage>
						Change container width to see how inline card wrapping to next line.
					</HelperMessage>
				</Box>
				<Box style={{ width: `${widthPercentage}%` }}>
					<CardViewExample
						appearance="inline"
						showHoverPreview={true}
						fontSize={fontSize !== undefined && fontSize >= 10 ? `${fontSize}px` : undefined}
					/>
				</Box>
			</Stack>
		</ExampleContainer>
	);
};
