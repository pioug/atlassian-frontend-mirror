/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const wrapperStyles = css({
	display: 'flex',
	backgroundColor: token('color.background.accent.red.subtlest'),
	blockSize: '80px',
	inlineSize: '80px',
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

const smallContainerStyles = css({
	display: 'flex',
	width: '20px',
	height: '50px',
	backgroundColor: token('color.background.accent.lime.subtlest'),
});

export default function ContainersExample() {
	return (
		<Stack space="space.200">
			<div css={wrapperStyles}>
				<Inline alignBlock="stretch" alignInline="center" grow="fill">
					{/* this Badge should not stretch vertically */}
					<Badge appearance="primary">{77}</Badge>
				</Inline>
			</div>

			<div css={smallContainerStyles}>
				{/* this Badge should not break onto multiple lines */}
				<Badge>x55</Badge>
			</div>
		</Stack>
	);
}
