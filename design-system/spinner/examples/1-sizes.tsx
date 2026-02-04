/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import Lozenge from '@atlaskit/lozenge';
import Spinner, { type Size } from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 80];

const containerStyles = css({
	display: 'flex',
	gap: token('space.200', '16px'),
	flexWrap: 'wrap',
});

const itemStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: token('space.100', '8px'),
	flexDirection: 'column',
});

export default function Example(): JSX.Element {
	return (
		<div css={containerStyles}>
			{sizes.map((size: Size) => (
				<div key={size} css={itemStyles}>
					<Spinner size={size} label="Loading" />
					{typeof size === 'number' ? (
						<Lozenge appearance="new">custom</Lozenge>
					) : (
						<Lozenge appearance="success">{size}</Lozenge>
					)}
				</div>
			))}
		</div>
	);
}
