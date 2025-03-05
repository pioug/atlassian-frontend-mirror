import React from 'react';

import { cssMap } from '@atlaskit/css';
import { HelperMessage } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';

import CardViewExample from './card-view';
import ExampleContainer from './utils/example-container';

const styles = cssMap({
	boxStyles: {
		width: '300px',
	},
});

export default () => {
	const [fontSize, setFontSize] = React.useState<number | undefined>(undefined);

	const handleOnChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setFontSize(Number(event.currentTarget.value));
	}, []);

	return (
		<ExampleContainer title="InlineCard Views">
			<Box xcss={styles.boxStyles}>
				<Textfield placeholder="Set paragraph size in px" type="number" onChange={handleOnChange} />
				<HelperMessage>Set paragraph size in px. Must be 10px or greater</HelperMessage>
			</Box>
			<Stack>
				<CardViewExample
					appearance="inline"
					showHoverPreview={true}
					fontSize={fontSize !== undefined && fontSize >= 10 ? `${fontSize}px` : undefined}
				/>
			</Stack>
		</ExampleContainer>
	);
};
