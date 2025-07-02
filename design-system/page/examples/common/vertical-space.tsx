/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	verticalSpace: {
		marginBlockEnd: token('space.300'),
	},
});

const VerticalSpace = () => <Box xcss={styles.verticalSpace} />;

export default VerticalSpace;
