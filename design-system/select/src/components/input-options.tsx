/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { Component } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import { type IconProps } from '@atlaskit/icon';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import RadioIcon from '@atlaskit/icon/glyph/radio';
import PrimitiveSVGIcon from '@atlaskit/icon/svg';
import { fg } from '@atlaskit/platform-feature-flags';
import { B300, B400, B75, N0, N100, N20, N20A, N30, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type OptionProps, type OptionType } from '../types';

const getPrimitiveStyles = (
	props: Omit<OptionProps, 'children' | 'innerProps' | 'innerRef'>,
): [SerializedStyles, string] => {
	const { cx, className, getStyles, isDisabled, isFocused, isSelected } = props;

	const baseStyles = {
		alignItems: 'center',
		backgroundColor: isFocused
			? token('color.background.neutral.subtle.hovered', N20)
			: 'transparent',
		color: isDisabled ? token('color.text.disabled', 'inherit') : 'inherit',
		display: 'flex ',
		paddingBottom: token('space.050', '4px'),
		paddingLeft: token('space.200', '16px'),
		paddingTop: token('space.050', '4px'),
		// This 'none' needs to be present to ensure that style is not applied when
		// the option is selected but not focused.
		boxShadow: isFocused ? `inset 2px 0px 0px ${token('color.border.focused', B400)}` : 'none',

		':active': {
			backgroundColor: token('color.background.neutral.subtle.pressed', N30),
		},

		'@media screen and (-ms-high-contrast: active)': {
			borderLeft: isFocused ? '2px solid transparent' : '',
		},
	};

	const augmentedStyles: SerializedStyles = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...getStyles('option', props),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...baseStyles,
	});

	const bemClasses = {
		option: true,
		'option--is-disabled': isDisabled,
		'option--is-focused': isFocused,
		'option--is-selected': isSelected,
	};

	// maintain react-select API
	return [augmentedStyles, cx(bemClasses, className) as string];
};

// state of the parent option
interface ControlProps {
	isActive?: boolean;
	isDisabled?: boolean;
	isFocused?: boolean;
	isSelected?: boolean;
}

// the primary color represents the outer or background element
const getPrimaryColor = ({ isActive, isDisabled, isFocused, isSelected }: ControlProps): string => {
	if (isDisabled && isSelected) {
		return token('color.background.disabled', B75);
	} else if (isDisabled) {
		return token('color.background.disabled', N20A);
	} else if (isSelected && isActive) {
		return token('color.background.selected.bold.pressed', B75);
	} else if (isActive) {
		return token('color.background.selected.pressed', B75);
	} else if (isFocused && isSelected) {
		return token('color.background.selected.bold.hovered', B300);
	} else if (isFocused) {
		return token('elevation.surface', N0);
	} else if (isSelected) {
		return token('color.background.selected.bold', B400);
	}

	return token('color.background.neutral', N0);
};

// the secondary color represents the radio dot or checkmark
const getSecondaryColor = ({ isActive, isDisabled, isSelected }: ControlProps): string => {
	if (isDisabled && isSelected) {
		return token('color.text.disabled', N70);
	} else if (isActive && isSelected && !isDisabled) {
		return token('elevation.surface', B400);
	} else if (!isSelected) {
		return 'transparent';
	}

	return token('elevation.surface', N0);
};

// the border color surrounds the checkbox/radio
const getBorderColor = ({ isActive, isDisabled, isFocused, isSelected }: ControlProps): string => {
	if (isDisabled && isSelected) {
		return token('color.background.disabled', B400);
	} else if (isDisabled) {
		return token('color.background.disabled', N100);
	} else if (isSelected && isActive) {
		return token('color.background.selected.bold.pressed', B400);
	} else if (isActive) {
		return token('color.background.selected.bold', B400);
	} else if (isFocused && isSelected) {
		return token('color.background.selected.bold.hovered', B400);
	} else if (isFocused) {
		return token('color.border.input', N100);
	} else if (isSelected) {
		return token('color.background.selected.bold', B400);
	}

	return token('color.border.input', N100);
};

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

interface OptionState {
	isActive?: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class ControlOption<Option = OptionType, IsMulti extends boolean = false> extends Component<
	OptionProps<Option, IsMulti>,
	OptionState
> {
	state: OptionState = { isActive: false };

	onMouseDown = () => this.setState({ isActive: true });

	onMouseUp = () => this.setState({ isActive: false });

	onMouseLeave = () => this.setState({ isActive: false });

	render() {
		const { getStyles, Icon, children, innerProps, innerRef, ...rest } = this.props;
		const { isDisabled, isSelected } = this.props;

		// prop assignment
		const props = {
			...innerProps,
			onMouseDown: this.onMouseDown,
			onMouseUp: this.onMouseUp,
			onMouseLeave: this.onMouseLeave,
		};

		const [styles, classes] = getPrimitiveStyles({ getStyles, ...rest });

		const isVoiceOver =
			(/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel') && // temporary check for now
			// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
			fg('design_system_select-a11y-improvement');

		return (
			// These need to remain this way because `react-select` passes props with
			// styles inside, and that must be done dynamically.
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<div css={styles} className={classes} ref={innerRef} {...props}>
				<div
					css={[
						baseIconStyles,
						// Here we are adding a border to the Checkbox and Radio SVG icons
						// This is an a11y fix for Select only for now but it may be rolled
						// into the `@atlaskit/icon` package's Checkbox and Radio SVGs later
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						{
							// This can eventually be changed to static styles that are
							// applied conditionally (e.g. `isActive && activeBorderStyles`),
							// but considering there are multiple instances of `react-select`
							// requiring styles to be generated dynamically, it seemed like a
							// low priority.
							// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
							'& svg rect, & svg circle:first-of-type': {
								stroke: getBorderColor({ ...this.props, ...this.state }),
							},
						},
					]}
				>
					{!!Icon ? (
						<Icon
							label=""
							primaryColor={getPrimaryColor({ ...this.props, ...this.state })}
							secondaryColor={getSecondaryColor({
								...this.props,
								...this.state,
							})}
							isFacadeDisabled={true}
						/>
					) : null}
				</div>
				<div css={baseOptionStyles}>
					{children}
					{/* Funny story, aria-selected does not work very well with VoiceOver, so it needs to be removed but we still need to express selected state
					https://bugs.webkit.org/show_bug.cgi?id=209076
					VoiceOver does not announce aria-disabled the first time, so going this route
					*/}
					{isVoiceOver && (isSelected || isDisabled) && (
						<VisuallyHidden>{`${isSelected ? ',selected' : ''}${isDisabled ? ',dimmed' : ''}`}</VisuallyHidden>
					)}
				</div>
			</div>
		);
	}
}

const NewCheckboxIcon = (props: IconProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<PrimitiveSVGIcon {...props}>
		<g fillRule="evenodd">
			<rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="currentColor" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.3262 9.48011L15.1738 8.51984L10.75 13.8284L8.82616 11.5198L7.67383 12.4801L10.1738 15.4801C10.3163 15.6511 10.5274 15.75 10.75 15.75C10.9726 15.75 11.1837 15.6511 11.3262 15.4801L16.3262 9.48011Z"
				fill="inherit"
			/>
		</g>
	</PrimitiveSVGIcon>
);

const NewRadioIcon = (props: IconProps) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<PrimitiveSVGIcon {...props}>
		<g fillRule="evenodd">
			<circle cx="12" cy="12" r="6.75" fill="currentColor" strokeWidth="1.5" />
			<circle cx="12" cy="12" r="3" fill="inherit" />
		</g>
	</PrimitiveSVGIcon>
);

/**
 * __Checkbox option__
 */
export const CheckboxOption = <OptionT extends OptionType>(
	props: OptionProps<OptionT, true>,
	// ): JSX.Element => <ControlOption<OptionT, true> Icon={CheckboxIcon} {...props} />;
): JSX.Element => (
	<ControlOption<OptionT, true>
		Icon={
			// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix, @atlaskit/platform/no-preconditioning
			fg('platform-visual-refresh-icons') && fg('platform-icon-control-migration')
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
	// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons, @repo/internal/react/no-unsafe-spread-props
	<ControlOption
		Icon={
			// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix, @atlaskit/platform/no-preconditioning
			fg('platform-visual-refresh-icons') && fg('platform-icon-control-migration')
				? NewRadioIcon
				: // eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
					RadioIcon
		}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
