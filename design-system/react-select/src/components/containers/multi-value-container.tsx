/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { GroupBase, MultiValueGenericProps } from '../../types';

const multiValueStyles = cssMap({
	root: {
		display: 'flex',
		minWidth: token('space.0'), // resolves flex/text-overflow bug
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginBlockEnd: token('space.025'),
		marginInlineStart: token('space.025'),
		borderColor: '#B7B9BE',
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		backgroundColor: token('color.background.input'),
		maxWidth: '100%',
		'@media screen and (-ms-high-contrast: active)': {
			border: 'none',
		},
		color: token('color.text'),
	},
	disabled: {
		color: token('color.text.disabled'),
		backgroundColor: token('color.background.neutral'),
	},
	focused: {
		color: token('color.text.selected'),
		backgroundColor: token('color.background.selected'),
		boxShadow: `0 0 0 2px ${token('elevation.surface')}, 0 0 0 4px ${token('color.border.focused')}`,
		'@media screen and (-ms-high-contrast: active)': {
			borderWidth: token('border.width'),
			borderColor: 'transparent',
			borderStyle: 'solid',
		},
	},
});

const semanticMultiValueStyles = cssMap({
	root: {
		marginBlockStart: token('space.gap.xxsmall'),
		marginInlineEnd: token('space.gap.xxsmall'),
		marginBlockEnd: token('space.gap.xxsmall'),
		marginInlineStart: token('space.gap.xxsmall'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueContainer: <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	children,
	innerProps,
	isFocused,
	isDisabled,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => JSX.Element = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>({
	children,
	innerProps,
	isFocused,
	isDisabled,
	className,
	xcss,
}: MultiValueGenericProps<Option, IsMulti, Group>) => {
	return (
		<div
			css={[
				multiValueStyles.root,
				isDisabled && multiValueStyles.disabled,
				isFocused && multiValueStyles.focused,
				fg('platform-semantic-spacing') && semanticMultiValueStyles.root,
			]}
			{...innerProps}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-multiValue')}
		>
			{children}
		</div>
	);
};
