/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, type JSX, type ReactNode } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';

import { cssMap as strictCssMap } from '@atlaskit/css';
import DownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { Inline, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { getStyleProps } from '../../get-style-props';
import { type CommonPropsAndClassName, type GroupBase } from '../../types';

const dropdownWrapperStyles = cssMap({
	root: {
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.075'),
	},
});

// Reset styles for the voice-control <Pressable> so the chevron renders
// pixel-identical to the gate-off icon-in-a-div. Uses @atlaskit/css cssMap
// (aliased as strictCssMap) because Pressable's xcss prop requires that type.
const voiceControlPressableStyles = strictCssMap({
	root: {
		paddingBlock: 0,
		paddingInline: 0,
		marginBlock: 0,
		marginInline: 0,
		backgroundColor: 'transparent',
		display: 'flex',
		alignItems: 'center',
	},
});

export interface DropdownIndicatorProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	/**
	 * The children to be rendered inside the indicator.
	 */
	children?: ReactNode;
	/**
	 * Props that will be passed on to the children.
	 */
	innerProps: JSX.IntrinsicElements['div'] & { 'data-testid'?: string };
	/**
	 * The focused state of the select.
	 */
	isFocused: boolean;
	isDisabled: boolean;
	/**
	 * Whether the select is compact.
	 */
	isCompact?: boolean;
}

const dropdownStyles = cssMap({
	default: {
		display: 'flex',
		transition: 'color 150ms',
		color: token('color.text.subtle'),
		paddingBlockStart: token('space.075'),
		paddingInlineEnd: token('space.025'),
		paddingBlockEnd: token('space.075'),
		paddingInlineStart: token('space.025'),
		'&:hover': {
			color: token('color.text.subtle'),
		},
	},
	compact: {
		paddingBlockStart: 0,
		paddingBlockEnd: 0,
	},
	disabled: {
		color: token('color.text.disabled'),
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const DropdownIndicator: <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => JSX.Element = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
	const { innerProps = {}, children, isDisabled, isCompact, xcss } = props;
	const { css, className } = getStyleProps(props, 'dropdownIndicator', {
		indicator: true,
		'dropdown-indicator': true,
	});
	const { 'aria-hidden': ariaHidden, ...restInnerProps } = innerProps;
	const isVoiceControlAccessible = fg('platform_dst_select_dropdown_voice_control');
	// Stable testid for the hoisted aria-hidden children wrapper (avoids parentElement in tests).
	const wrapperTestId = restInnerProps['data-testid']
		? `${restInnerProps['data-testid']}-children`
		: undefined;

	const voiceControlAccessibleIndicator = children ? (
		<div aria-hidden={ariaHidden} data-testid={wrapperTestId}>
			{children}
		</div>
	) : (
		// Transparent <Pressable> lets voice-control users target the chevron
		// (e.g. "click toggle select menu"). tabIndex={-1} keeps it out of the
		// keyboard tab order; aria-label overrides the icon name in the AT tree.
		<Pressable
			tabIndex={-1}
			aria-label="toggle select menu"
			isDisabled={isDisabled}
			componentName="DropdownIndicatorVoiceControl"
			xcss={voiceControlPressableStyles.root}
		>
			<Inline as="span" xcss={dropdownWrapperStyles.root}>
				<DownIcon color="currentColor" label="open" size="small" />
			</Inline>
		</Pressable>
	);

	return (
		<div
			css={[
				dropdownStyles.default,
				isDisabled && dropdownStyles.disabled,
				isCompact && dropdownStyles.compact,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={css as CSSProperties}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(className as any, xcss, '-indicatorContainer')}
			{...restInnerProps}
			aria-hidden={isVoiceControlAccessible ? undefined : ariaHidden}
		>
			{isVoiceControlAccessible
				? voiceControlAccessibleIndicator
				: (children ?? (
						<Inline as="span" xcss={dropdownWrapperStyles.root}>
							<DownIcon color="currentColor" label="open" size="small" />
						</Inline>
					))}
		</div>
	);
};
