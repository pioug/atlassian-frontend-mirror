/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

export const TokenModalCodeBlock = `
import { N0, N30A, N60A, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

color: token('color.text'),
background: token('elevation.surface.overlay', N0),
boxShadow: token(
  'elevation.shadow.overlay',
  \`0 0 0 1px \${N30A}, 0 2px 1px \${N30A}, 0 0 20px -6px \${N60A}\`,
),
`;

const styles = cssMap({
	dialog: {
		display: 'flex',
		minHeight: 0,
		flex: '1 1 auto',
		flexDirection: 'column',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
		pointerEvents: 'auto',
	},
	header: {
		display: 'flex',
		paddingBlockStart: token('space.300'),
		paddingInline: token('space.300'),
		paddingBlockEnd: '22px',
	},
	title: {
		margin: 0,
		fontSize: '20px',
		fontWeight: token('font.weight.medium'),
		lineHeight: 1,
	},
	body: {
		paddingInline: token('space.300'),
		paddingBlock: token('space.025'),
	},
	footer: {
		display: 'flex',
		paddingBlockStart: '22px',
		paddingInline: token('space.300'),
		paddingBlockEnd: token('space.300'),
		alignItems: 'center',
		justifyContent: 'flex-end',
		gap: token('space.100'),
	},
});

export const TokenModal = (): JSX.Element => {
	return (
		<div css={styles.dialog}>
			<div css={styles.header}>
				<span css={styles.title}>Modal dialog</span>
			</div>
			<div css={styles.body}>
				This is place holder text. The basic dialog for modals should contain only valuable and
				relevant information. Simplify dialogs by removing unnecessary elements or content that does
				not support user tasks. If you find that the number of required elements for your design are
				making the dialog excessively large, then try a different design solution.{' '}
			</div>
			<div css={styles.footer}>
				<Button testId="secondary" appearance="subtle">
					Cancel
				</Button>
				<Button testId="primary" appearance="primary">
					Confirm
				</Button>
			</div>
		</div>
	);
};

const _default_1: {
    example: () => JSX.Element;
    code: string;
} = { example: TokenModal, code: TokenModalCodeBlock };
export default _default_1;
