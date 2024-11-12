/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@emotion/react';

import Badge from '@atlaskit/badge';
import { token } from '@atlaskit/tokens';

const itemStyles = css({
	display: 'flex',
	maxWidth: '300px',
	padding: '0.6em 1em',
	alignItems: 'center',
	justifyContent: 'space-between',
	background: 'none',
	borderRadius: token('border.radius', '3px'),
	color: 'inherit',
	marginBlockEnd: token('space.050', '4px'),
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered'),
	},
});

const invertedItemStyles = css({
	background: token('color.background.brand.bold'),
	color: token('color.text.inverse'),
	'&:hover': {
		backgroundColor: token('color.background.brand.bold.hovered'),
	},
});

export default function Example() {
	return (
		<React.StrictMode>
			<div data-testid="badge">
				<div css={itemStyles}>
					<p>Added</p>
					<Badge appearance="added" max={99}>
						{3000}
					</Badge>
				</div>
				<div css={itemStyles}>
					<p>Default</p>
					<Badge testId="badge-default">{5}</Badge>
				</div>
				<div css={itemStyles}>
					<p>Default (∞)</p>
					<Badge max={Infinity}>{Infinity}</Badge>
				</div>
				<div css={itemStyles}>
					<p>Important</p>
					<Badge appearance="important">{25}</Badge>
				</div>
				<div css={itemStyles}>
					<p>Primary</p>
					<Badge appearance="primary">{-5}</Badge>
				</div>
				<div css={[itemStyles, invertedItemStyles]}>
					<p>Primary Inverted</p>
					<Badge appearance="primaryInverted">{5}</Badge>
				</div>
				<div css={itemStyles}>
					<p>Removed</p>
					<Badge appearance="removed">{100}</Badge>
				</div>
				<div css={itemStyles}>
					<p>Added code</p>
					<Badge appearance="added">+100</Badge>
				</div>
				<div css={itemStyles}>
					<p>Removed code</p>
					<Badge appearance="removed">-100</Badge>
				</div>
				<div css={itemStyles}>
					<p>Added</p>
					<Badge appearance="added" max={4000}>
						{3000}
					</Badge>
				</div>
			</div>
		</React.StrictMode>
	);
}
