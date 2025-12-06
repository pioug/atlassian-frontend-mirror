/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { type IconProps } from '@atlaskit/icon';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import RadioIcon from '@atlaskit/icon/glyph/radio';
import PrimitiveSVGIcon from '@atlaskit/icon/svg';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type OptionProps, type OptionType } from '../types';

const optionStyles = cssMap({
	default: {
		display: 'flex ',
		alignItems: 'center',
		width: '100%',
		userSelect: 'none',
		WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
		boxSizing: 'border-box',
		paddingBlockEnd: token('space.050', '4px'),
		paddingBlockStart: token('space.050', '4px'),
		paddingInlineStart: token('space.200', '16px'),
		paddingInlineEnd: token('space.150', '12px'),
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
		color: token('color.text.disabled', 'inherit'),
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
			stroke: token('color.border.input'),
		},
	},
});

const baseIconStyles = css({
	display: 'flex ',
	alignItems: 'center',
	flexShrink: 0,
	paddingInlineEnd: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'& svg rect, & svg circle:first-of-type': {
		strokeLinejoin: 'round',
		strokeWidth: token('border.width', '1px'),
	},
});

const baseOptionStyles = css({
	flexGrow: 1,
	overflowX: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const ControlOption = <Option, IsMulti extends boolean = false>(
	props: OptionProps<Option, IsMulti>,
) => {
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

const svgStyles = css({
	width: 24,
	height: 24,
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

const newCheckboxIconPath = (
	<g fillRule="evenodd">
		<rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="currentColor" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M16.3262 9.48011L15.1738 8.51984L10.75 13.8284L8.82616 11.5198L7.67383 12.4801L10.1738 15.4801C10.3163 15.6511 10.5274 15.75 10.75 15.75C10.9726 15.75 11.1837 15.6511 11.3262 15.4801L16.3262 9.48011Z"
			fill="inherit"
		/>
	</g>
);

const NewCheckboxIcon = (props: IconProps) => {
	if (fg('platform-custom-icon-migration')) {
		const { primaryColor, secondaryColor, label } = props;

		return (
			<svg
				viewBox="0 0 24 24"
				style={{ color: primaryColor, fill: secondaryColor }}
				css={svgStyles}
				aria-label={label}
				role={label ? 'img' : 'presentation'}
			>
				{newCheckboxIconPath}
			</svg>
		);
	}

	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @atlaskit/design-system/no-custom-icons
		<PrimitiveSVGIcon {...props}>{newCheckboxIconPath}</PrimitiveSVGIcon>
	);
};

const newRadioIconPath = (
	<g fillRule="evenodd">
		<circle cx="12" cy="12" r="6.75" fill="currentColor" strokeWidth="1.5" />
		<circle cx="12" cy="12" r="3" fill="inherit" />
	</g>
);

const NewRadioIcon = (props: IconProps) => {
	if (fg('platform-custom-icon-migration')) {
		const { primaryColor, secondaryColor, label } = props;

		return (
			<svg
				viewBox="0 0 24 24"
				style={{ color: primaryColor, fill: secondaryColor }}
				css={svgStyles}
				aria-label={label}
				role={label ? 'img' : 'presentation'}
			>
				{newRadioIconPath}
			</svg>
		);
	}
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @atlaskit/design-system/no-custom-icons
		<PrimitiveSVGIcon {...props}>{newRadioIconPath}</PrimitiveSVGIcon>
	);
};

/**
 * __Checkbox option__
 */
export const CheckboxOption = <OptionT extends OptionType>(
	props: OptionProps<OptionT, true>,
): JSX.Element => (
	<ControlOption<OptionT, true>
		Icon={
			fg('platform-visual-refresh-icons')
				? NewCheckboxIcon
				: // eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
					CheckboxIcon
		}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

/**
 * __Radio option__
 */
export const RadioOption = <OptionT extends OptionType>(props: OptionProps<OptionT, false>) => (
	// TODO https://product-fabric.atlassian.net/browse/DSP-20769
	<ControlOption
		Icon={
			fg('platform-visual-refresh-icons')
				? NewRadioIcon
				: // eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
					RadioIcon
		}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
