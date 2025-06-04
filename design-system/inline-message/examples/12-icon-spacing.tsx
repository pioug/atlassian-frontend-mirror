/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import InlineMessage from '@atlaskit/inline-message';
import { Inline } from '@atlaskit/primitives';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		justifyContent: 'center',
		paddingBlock: token('space.1000'),
	},
});

export default function InlineMessageIconSpacingExample() {
	return (
		<div css={styles.root}>
			<Inline space="space.100">
				<Text>Default spacing (spacious)</Text>
				<InlineMessage title="Info Inline Message" appearance="info">
					<p>Info dialog</p>
				</InlineMessage>
			</Inline>
			<br />
			<Inline space="space.100">
				<Text>Compact spacing</Text>
				<InlineMessage title="Info Inline Message" appearance="info" spacing="compact">
					<p>Info dialog</p>
				</InlineMessage>
			</Inline>
		</div>
	);
}
