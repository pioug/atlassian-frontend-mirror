/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@emotion/react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { RANDOM_USERS } from '../examples-util/data';
import AvatarGroup from '../src';

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

export default function VRStackingContextExample() {
	const data = RANDOM_USERS.map((d) => ({
		key: d.email,
		name: d.name,
		appearance: 'circle' as AppearanceType,
		size: 'medium' as SizeType,
	}));

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
