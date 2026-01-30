/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import AvatarGroup from '@atlaskit/avatar-group';
import { token } from '@atlaskit/tokens';

import { appearances, RANDOM_USERS } from '../examples-util/data';

const containerStyles = css({
	display: 'flex',
	maxWidth: 400,
	position: 'relative',
	gap: token('space.200'),
});

const mockTopNavStyles = css({
	width: 400,
	height: 32,
	position: 'fixed',
	zIndex: 4,
	backgroundColor: token('elevation.surface.overlay'),
	boxShadow: token('elevation.shadow.overlay'),
	insetBlockStart: 0,
});

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	appearance: appearances[i % appearances.length],
}));

export default function VRStackingContextExample(): JSX.Element {
	return (
		<div css={containerStyles} data-testid="container">
			<div css={mockTopNavStyles} />
			<AvatarGroup
				appearance="stack"
				onAvatarClick={console.log}
				data={data}
				size="large"
				testId="stack"
			/>
			<AvatarGroup
				appearance="grid"
				onAvatarClick={console.log}
				data={data}
				maxCount={14}
				size="large"
				testId="grid"
			/>
		</div>
	);
}
