import React from 'react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import { cssMap, cx } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';

const styles = cssMap({
	indicator: {
		minWidth: '24px',
		height: '24px',
		marginTop: token('space.025'),
		marginRight: token('space.025'),
		marginBottom: token('space.025'),
		marginLeft: token('space.025'),
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		backgroundColor: token('color.background.accent.gray.subtler'),
		borderRadius: token('radius.full', '24px'),
		color: token('color.text.subtle'),
		font: token('font.heading.xsmall'),
		'&:hover': {
			backgroundColor: token('color.background.accent.gray.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.gray.subtler.pressed'),
		},
	},

	indicatorActive: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
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
							render: (Component, { buttonProps, borderColor, isActive, ...props }) => (
								<Pressable
									type="submit"
									{...buttonProps}
									{...props}
									xcss={cx(styles.indicator, isActive && styles.indicatorActive)}
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
							render: (Component, { buttonProps, borderColor, isActive, ...props }) => (
								<Pressable
									type="submit"
									{...buttonProps}
									{...props}
									xcss={cx(styles.indicator, isActive && styles.indicatorActive)}
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
