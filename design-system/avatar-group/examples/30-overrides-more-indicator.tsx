import React from 'react';

import AvatarGroup from '@atlaskit/avatar-group';
import { cssMap, cx } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { appearances, RANDOM_USERS } from '../examples-util/data';
import { ExampleGroup } from '../examples-util/helpers';

const styles = cssMap({
	indicator: {
		minWidth: '24px',
		height: '24px',
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginBlockEnd: token('space.025'),
		marginInlineStart: token('space.025'),
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
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

const data = RANDOM_USERS.map((d, i) => ({
	key: d.email,
	name: d.name,
	appearance: appearances[i % appearances.length],
}));

export default (): React.JSX.Element => {
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
							render: (_Component, { buttonProps, borderColor, isActive, ...props }) => (
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
							render: (_Component, { buttonProps, borderColor, isActive, ...props }) => (
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
