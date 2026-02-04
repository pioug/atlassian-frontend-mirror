/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Bleed } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const TokenNegativeSpaceCodeBlock = `
import { token } from '@atlaskit/tokens';

// Container styles
paddingInline: token('space.200', '16px'),

// Divider styles
marginInline: token('space.negative.200', '-16px'),
`;

const styles = cssMap({
	container: {
		width: 300,
		height: 200,
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	divider: {
		border: 'none',
		borderBlockEnd: `1px solid ${token('color.border')}`,
	},
});

const TokenNegativeSpace = (): JSX.Element => {
	return (
		<div css={styles.container}>
			<p>A container with an inset</p>
			<Bleed inline="space.200">
				<hr role="presentation" css={styles.divider}></hr>
			</Bleed>
		</div>
	);
};

const _default_1: {
    example: () => JSX.Element;
    code: string;
} = {
    example: TokenNegativeSpace,
    code: TokenNegativeSpaceCodeBlock,
};
export default _default_1;
