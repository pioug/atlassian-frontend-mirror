/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/react';
import { Component, FC } from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import RadioIcon from '@atlaskit/icon/glyph/radio';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import {
  B300,
  B400,
  B75,
  N20A,
  N0,
  N100,
  N20,
  N30,
  N70,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { OptionProps, OptionType } from '../types';

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
    boxShadow: isFocused
      ? `inset 2px 0px 0px ${token('color.border.focused', B400)}`
      : 'none',

    ':active': {
      backgroundColor: token('color.background.neutral.subtle.pressed', N30),
    },

    '@media screen and (-ms-high-contrast: active)': {
      borderLeft: isFocused ? '2px solid transparent' : '',
    },
  };

  const augmentedStyles: SerializedStyles = css({
    ...getStyles('option', props),
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
const getPrimaryColor = ({
  isActive,
  isDisabled,
  isFocused,
  isSelected,
}: ControlProps): string => {
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
const getSecondaryColor = ({
  isActive,
  isDisabled,
  isSelected,
}: ControlProps): string => {
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
const getBorderColor = ({
  isActive,
  isDisabled,
  isFocused,
  isSelected,
}: ControlProps): string => {
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
  alignItems: 'center',
  display: 'flex ',
  flexShrink: 0,
  paddingInlineEnd: token('space.050', '4px'),
  // Here we are adding a border to the Checkbox and Radio SVG icons
  // This is an a11y fix for Select only for now but it may be rolled
  // into the `@atlaskit/icon` package's Checkbox and Radio SVGs later
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& svg rect, & svg circle:first-of-type': {
    strokeWidth: getBooleanFF(
      'platform.design-system-team.border-checkbox_nyoiu',
    )
      ? token('border.width', '1px')
      : token('border.width.outline', '2px'),
    strokeLinejoin: 'round',
  },
});

const baseOptionStyles = css({
  textOverflow: 'ellipsis',
  overflowX: 'hidden',
  flexGrow: 1,
  whiteSpace: 'nowrap',
});

interface OptionState {
  isActive?: boolean;
}

class ControlOption<
  Option = OptionType,
  IsMulti extends boolean = false,
> extends Component<OptionProps<Option, IsMulti>, OptionState> {
  state: OptionState = { isActive: false };

  onMouseDown = () => this.setState({ isActive: true });

  onMouseUp = () => this.setState({ isActive: false });

  onMouseLeave = () => this.setState({ isActive: false });

  render() {
    const { getStyles, Icon, children, innerProps, innerRef, ...rest } =
      this.props;

    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown: this.onMouseDown,
      onMouseUp: this.onMouseUp,
      onMouseLeave: this.onMouseLeave,
    };

    const [styles, classes] = getPrimitiveStyles({ getStyles, ...rest });

    return (
      // These need to remain this way because `react-select` passes props with
      // styles inside, and that must be done dynamically.
      // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
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
            />
          ) : null}
        </div>
        <div css={baseOptionStyles}>{children}</div>
      </div>
    );
  }
}

export const CheckboxOption = <OptionT extends OptionType>(
  props: OptionProps<OptionT, true>,
): JSX.Element => (
  <ControlOption<OptionT, true> Icon={CheckboxIcon} {...props} />
);

export const RadioOption: FC<OptionProps> = (props) => (
  <ControlOption Icon={RadioIcon} {...props} />
);
