/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type OptionProps } from '../types';

const optionStyles = cssMap({
	default: {
		display: 'flex ',
		alignItems: 'center',
		width: '100%',
		userSelect: 'none',
		WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
		boxSizing: 'border-box',
		paddingBlockEnd: token('space.050'),
		paddingBlockStart: token('space.050'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.150'),
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
		backgroundColor: 'transparent',
		boxShadow: 'inherit',
		color: 'inherit',
	},
	focused: {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
		boxShadow: `inset 2px 0px 0px ${token('color.border.focused')}`,
		'@media screen and (-ms-high-contrast: active)': {
			borderInlineStart: `${token('border.width.selected')} solid transparent`,
		},
	},
	disabled: {
		color: token('color.text.disabled'),
	},
	motion: {
		transition: token('motion.listitem.hovered'),
		'&:hover': {
			transition: token('motion.listitem.hovered'),
		},
		'&:active': {
			transition: token('motion.listitem.pressed'),
		},
	},
});

// state of the parent option
interface ControlProps {
	isActive?: boolean;
	isDisabled?: boolean;
	isFocused?: boolean;
	isSelected?: boolean;
}

// the primary color represents the outer or background element
const getPrimaryColor = ({ isActive, isDisabled, isFocused, isSelected }: ControlProps) => {
	if (isDisabled) {
		return token('color.background.disabled');
	} else if (isSelected && isActive) {
		return token('color.background.selected.bold.pressed');
	} else if (isActive) {
		return token('color.background.selected.pressed');
	} else if (isFocused && isSelected) {
		return token('color.background.selected.bold.hovered');
	} else if (isFocused) {
		return token('elevation.surface');
	} else if (isSelected) {
		return token('color.background.selected.bold');
	}

	return token('color.background.neutral');
};

// the secondary color represents the radio dot or checkmark
const getSecondaryColor = ({ isDisabled, isSelected }: ControlProps) => {
	if (isDisabled && isSelected) {
		return token('color.text.disabled');
	} else if (!isSelected) {
		return 'transparent';
	}

	return token('elevation.surface');
};

const iconStyles = cssMap({
	inherit: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& svg rect, & svg circle:first-of-type': {
			stroke: 'currentColor',
		},
	},
	default: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'& svg rect, & svg circle:first-of-type': {
			stroke: token('color.border.bold'),
		},
	},
});

const baseIconStyles = css({
	display: 'flex ',
	alignItems: 'center',
	flexShrink: 0,
	paddingInlineEnd: token('space.050'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'& svg rect, & svg circle:first-of-type': {
		strokeLinejoin: 'round',
		strokeWidth: token('border.width'),
	},
});

const baseOptionStyles = css({
	flexGrow: 1,
	overflowX: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const ControlOption = <Option, IsMulti extends boolean = false>(
	props: OptionProps<Option, IsMulti>,
): React.ReactNode => {
	const [isActive, setIsActive] = useState(false);

	const onMouseDown = useCallback(() => setIsActive(true), []);
	const onMouseUp = useCallback(() => setIsActive(false), []);

	const { Icon, children, innerProps, innerRef, cx, className, isDisabled, isSelected, isFocused } =
		props;

	const classNames = useMemo(
		() =>
			cx(
				{
					option: true,
					'option--is-disabled': isDisabled,
					'option--is-focused': isFocused,
					'option--is-selected': isSelected,
				},
				className,
			),
		[cx, isDisabled, isFocused, isSelected, className],
	);

	return (
		// These need to remain this way because `react-select` passes props with
		// styles inside, and that must be done dynamically.
		// eslint-disable-next-line @atlassian/a11y/no-static-element-interactions
		<div
			css={[
				optionStyles.default,
				!isDisabled && fg('platform-dst-motion-uplift-list-item') && optionStyles.motion,
				isFocused && optionStyles.focused,
				isDisabled && optionStyles.disabled,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={classNames}
			ref={innerRef}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseLeave={onMouseUp}
			{...innerProps}
		>
			<div
				css={[
					baseIconStyles,
					// Here we are adding a border to the Checkbox and Radio SVG icons
					// This is an a11y fix for Select only for now but it may be rolled
					// into the `@atlaskit/icon` package's Checkbox and Radio SVGs later
					isSelected || isActive || isDisabled ? iconStyles.inherit : iconStyles.default,
				]}
			>
				{!!Icon ? (
					<Icon
						label=""
						primaryColor={getPrimaryColor({ isDisabled, isSelected, isFocused, isActive })}
						secondaryColor={getSecondaryColor({ isDisabled, isSelected })}
						isFacadeDisabled={true}
					/>
				) : null}
			</div>
			<div css={baseOptionStyles}>{children}</div>
		</div>
	);
};
