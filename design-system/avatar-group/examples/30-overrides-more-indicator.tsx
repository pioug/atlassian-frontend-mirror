import React from 'react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import { Pressable, xcss } from '@atlaskit/primitives';

import { RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';

const indicatorStyles = xcss({
	minWidth: '24px',
	height: '24px',
	margin: 'space.025',
	padding: 'space.050',
	backgroundColor: 'color.background.accent.gray.subtler',
	borderRadius: '24px',
	color: 'color.text.subtle',
	font: 'font.heading.xsmall',
	':hover': {
		backgroundColor: 'color.background.accent.gray.subtler.hovered',
	},
	':active': {
		backgroundColor: 'color.background.accent.gray.subtler.pressed',
	},
});

const indicatorActiveStyles = xcss({
	backgroundColor: 'color.background.selected',
	color: 'color.text.selected',
	':hover': {
		backgroundColor: 'color.background.selected.hovered',
	},
	':active': {
		backgroundColor: 'color.background.selected.pressed',
	},
});

export default () => {
	const data = RANDOM_USERS.map((d) => ({
		key: d.email,
		name: d.name,
		appearance: 'circle' as AppearanceType,
		size: 'small' as SizeType,
	}));

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ maxWidth: 270 }}>
			<ExampleGroup heading="Override More Indicator">
				<AvatarGroup
					appearance="stack"
					onAvatarClick={console.log}
					data={data}
					size="small"
					testId="stack"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={{
						MoreIndicator: {
							render: (Component, props) => (
								<Pressable
									type="submit"
									{...props.buttonProps}
									{...props}
									onClick={props.onClick}
									xcss={[indicatorStyles, props.isActive && indicatorActiveStyles]}
									testId={props.testId && `${props.testId}-0`}
								>
									{data.length - 4}
								</Pressable>
							),
						},
					}}
				/>
			</ExampleGroup>
			<ExampleGroup heading="Override More Indicator with scaling pill">
				<AvatarGroup
					appearance="stack"
					onAvatarClick={console.log}
					data={data}
					size="small"
					testId="stack"
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={{
						MoreIndicator: {
							render: (Component, props) => (
								<Pressable
									type="submit"
									{...props.buttonProps}
									{...props}
									onClick={props.onClick}
									xcss={[indicatorStyles, props.isActive && indicatorActiveStyles]}
									testId={props.testId && `${props.testId}-1`}
								>
									9,999,999
								</Pressable>
							),
						},
					}}
				/>
			</ExampleGroup>
		</div>
	);
};
