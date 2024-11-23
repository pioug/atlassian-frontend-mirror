/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	label: { width: '160px' },
	truncated: { width: '140px', backgroundColor: token('color.background.accent.lime.subtlest') },
});

export default () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - no truncation:</Text>
				</div>
				<div css={styles.truncated}>
					<Text>The quick brown fox jumped over the lazy dog</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 1 line:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={1}>The quick brown fox jumped over the lazy dog</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 2 lines:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={2}>The quick brown fox jumped over the lazy dog</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 3 lines:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={3}>The quick brown fox jumped over the lazy dog</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - no truncation:</Text>
				</div>
				<div css={styles.truncated}>
					<Text>Your upload of somereallylongfilename.jpg is now complete</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 1 line:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={1}>Your upload of somereallylongfilename.jpg is now complete</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 2 lines:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={2}>Your upload of somereallylongfilename.jpg is now complete</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 3 lines:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={3}>Your upload of somereallylongfilename.jpg is now complete</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - no truncation:</Text>
				</div>
				<div css={styles.truncated}>
					<Text>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 1 line:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={1}>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 2 lines:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={2}>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</div>
			</Inline>

			<Inline space="space.100">
				<div css={styles.label}>
					<Text>Text - 3 lines:</Text>
				</div>
				<div css={styles.truncated}>
					<Text maxLines={3}>Pneumonoultramicroscopicsilicovolcanoconiosis</Text>
				</div>
			</Inline>
		</Stack>
	);
};
