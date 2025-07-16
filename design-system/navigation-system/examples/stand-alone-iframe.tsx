/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const isInIframe = typeof window !== undefined && window.self !== window.top;

const styles = cssMap({
	root: {
		backgroundColor: token('color.background.accent.blue.subtle'),
		height: '100%',
	},
});

export default function App() {
	return <Box xcss={styles.root}>I am in an iframe: {isInIframe ? 'true' : 'false'}</Box>;
}
