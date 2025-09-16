import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const styles = xcss({
	width: '100%',
	borderBlockEnd: 'none',
	borderBlockStart: `${token('border.width')} solid ${token('color.border')}`,
	borderInline: 'none',
});
export const Divider = () => <Box as="hr" xcss={styles} role="presentation" />;
