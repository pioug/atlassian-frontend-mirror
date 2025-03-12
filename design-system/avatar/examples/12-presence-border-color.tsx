/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Presence } from '@atlaskit/avatar';
import { Code } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
	},
	presenceWrapper: {
		height: '30px',
		width: '30px',
		marginRight: token('space.100', '8px'),
	},
});

export default () => (
	<Stack space="space.200">
		<Heading as="h2" size="large">
			Custom background color
		</Heading>
		<Stack>
			<Text as="p">
				By default presences will display a white border. This can be overridden with the
				<Code>borderColor</Code> property.
			</Text>
			<Text as="p">
				The <Code>borderColor</Code> property will accept any string that CSS border-color can e.g.
				hex, rgba, transparent, etc.
			</Text>
		</Stack>
		<Box xcss={styles.container}>
			<Box xcss={styles.presenceWrapper}>
				<Presence presence="online" />
			</Box>
			<Box xcss={styles.presenceWrapper}>
				<Presence presence="busy" borderColor={token('color.border.discovery')} />
			</Box>
			<Box xcss={styles.presenceWrapper}>
				<Presence presence="offline" borderColor={token('color.border.brand')} />
			</Box>
			<Box xcss={styles.presenceWrapper}>
				<Presence presence="focus" borderColor="transparent" />
			</Box>
		</Box>
	</Stack>
);
