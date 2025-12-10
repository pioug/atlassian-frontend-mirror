import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ExampleManuallyComposedToolbar } from './toolbar/examples/ExampleManuallyComposedToolbar';

const styles = cssMap({
	container: {
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
	},
});

const App = (): React.JSX.Element => {
	return (
		<Box xcss={styles.container} as="main">
			<ExampleManuallyComposedToolbar />
		</Box>
	);
};

export default App;
