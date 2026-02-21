/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'inline-block',
	},
	block: {
		paddingBlock: token('space.100'),
	},
	inline: {
		paddingInline: token('space.100'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
export default ({
	hasBlock,
	hasInline,
}: {
	hasBlock: boolean;
	hasInline: boolean;
}): JSX.Element => (
	<Box xcss={cx(styles.container, hasBlock && styles.block, hasInline && styles.inline)}>
		Container
		<div css={[styles.inline, styles.block]}>Native doesn't use `cx`</div>
	</Box>
);
