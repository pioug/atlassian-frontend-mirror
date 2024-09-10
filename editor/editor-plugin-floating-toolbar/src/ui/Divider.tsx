import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const styles = xcss({
	width: '100%',
	borderBlockEnd: 'none',
	borderBlockStart: `1px solid ${token('color.border')}`,
	borderInline: 'none',
});
export const Divider = () => <Box as="hr" xcss={styles} />;
