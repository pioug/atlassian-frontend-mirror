/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box, Inline } from '../src/compiled';

const styles = cssMap({
	block: { borderRadius: token('border.radius.050'), padding: token('space.200') },
	container: { padding: token('space.100') },
});

export default () => (
	<div data-testid="inline-example" css={styles.container}>
		<Inline>
			<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
			<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
		</Inline>
	</div>
);
