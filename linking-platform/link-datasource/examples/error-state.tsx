import React from 'react';

import { cssMap } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { LoadingError } from '../src/ui/common/error-state/loading-error';

const styles = cssMap({
	container: {
		borderWidth: token('border.width'),
		borderColor: token('color.border.accent.gray'),
		borderStyle: 'solid',
		width: '80%',
		marginBlock: token('space.200'),
		marginInline: 'auto',
	},
});

export default (): React.JSX.Element => {
	return (
		<Box xcss={styles.container}>
			<LoadingError />
		</Box>
	);
};
