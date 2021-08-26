/** @jsx jsx */
import { jsx, InterpolationWithTheme } from '@emotion/core';
import { Component, FC } from 'react';

import RadioIcon from '@atlaskit/icon/glyph/radio';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import { ThemedValue } from '@atlaskit/theme/types';
import {
  B100,
  B200,
  B300,
  B400,
  B75,
  DN200,
  DN10,
  DN30,
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
): [InterpolationWithTheme<any>, string] => {
  const { cx, className, getStyles, isDisabled, isFocused, isSelected } = props;

  const styles = {
    alignItems: 'center',
    backgroundColor: isFocused
      ? token('color.background.transparentNeutral.hover', N20)
      : 'transparent',
    color: isDisabled ? token('color.text.disabled', 'inherit') : 'inherit',
    display: 'flex ',
    paddingBottom: 4,
    paddingLeft: `${gridSize() * 2}px`,
    paddingTop: 4,
    boxShadow: isFocused
      ? `inset 2px 0px 0px ${token('color.text.selected', B400)};`
      : '',

    ':active': {
      backgroundColor: token(
        'color.background.transparentNeutral.pressed',
        N30,
      ),
    },

    '@media screen and (-ms-high-contrast: active)': {
      borderLeft: isFocused ? '2px solid transparent' : '',
    },
  };

  const augmentedStyles: InterpolationWithTheme<any> = {
    ...getStyles('option', props),
    ...styles,
  };
  const bemClasses = {
    option: true,
    'option--is-disabled': isDisabled,
    'option--is-focused': isFocused,
    'option--is-selected': isSelected,
  };

  // maintain react-select API
  return [augmentedStyles, cx(bemClasses, className) as string];
};

// maintains function shape
const backgroundColor = themed({
  light: token('color.background.subtleNeutral.resting', N0),
  dark: token('color.background.subtleNeutral.resting', DN10),
});
const transparent = themed({ light: 'transparent', dark: 'transparent' });

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
  ...rest
}: ControlProps): string => {
  let color: ThemedValue<string> = backgroundColor;
  if (isDisabled && isSelected) {
    color = themed({
      light: token('color.background.disabled', B75),
      dark: token('color.background.disabled', DN200),
    });
  } else if (isDisabled) {
    color = themed({
      light: token('color.background.disabled', N20A),
      dark: token('color.background.disabled', DN10),
    });
  } else if (isSelected && isActive) {
    color = themed({
      light: token('color.background.boldBrand.pressed', B75),
      dark: token('color.background.boldBrand.pressed', B200),
    });
  } else if (isActive) {
    color = themed({
      light: token('color.background.subtleBrand.pressed', B75),
      dark: token('color.background.subtleBrand.pressed', B200),
    });
  } else if (isFocused && isSelected) {
    color = themed({
      light: token('color.background.boldBrand.hover', B300),
      dark: token('color.background.boldBrand.hover', B75),
    });
  } else if (isFocused) {
    color = themed({
      light: token('color.background.default', N0),
      dark: token('color.background.default', DN30),
    });
  } else if (isSelected) {
    color = themed({
      light: token('color.background.boldBrand.resting', B400),
      dark: token('color.background.boldBrand.resting', B100),
    });
  }
  return color(rest);
};

// the secondary color represents the radio dot or checkmark
const getSecondaryColor = ({
  isActive,
  isDisabled,
  isSelected,
  ...rest
}: ControlProps): string => {
  let color: ThemedValue<string> = themed({
    light: token('color.background.default', N0),
    dark: token('color.background.default', DN10),
  });

  if (isDisabled && isSelected) {
    color = themed({
      light: token('color.text.disabled', N70),
      dark: token('color.text.disabled', DN10),
    });
  } else if (isActive && isSelected && !isDisabled) {
    color = themed({
      light: token('color.background.default', B400),
      dark: token('color.background.default', DN10),
    });
  } else if (!isSelected) {
    color = transparent;
  }
  return color(rest);
};

// the border color surrounds the checkbox/radio
const getBorderColor = ({
  isActive,
  isDisabled,
  isFocused,
  isSelected,
  ...rest
}: ControlProps): string => {
  if (isDisabled && isSelected) {
    return token('color.background.disabled', B400);
  } else if (isDisabled) {
    return token('color.background.disabled', N100);
  } else if (isSelected && isActive) {
    return token('color.background.boldBrand.pressed', B400);
  } else if (isActive) {
    return token('color.background.boldBrand.resting', B400);
  } else if (isFocused && isSelected) {
    return token('color.background.boldBrand.hover', B400);
  } else if (isFocused) {
    return token('color.border.neutral', N100);
  } else if (isSelected) {
    return token('color.background.boldBrand.resting', B400);
  }
  return token('color.border.neutral', N100);
};

interface OptionState {
  isActive?: boolean;
}

class ControlOption<
  Option = OptionType,
  IsMulti extends boolean = false
> extends Component<OptionProps<Option, IsMulti>, OptionState> {
  state: OptionState = { isActive: false };

  onMouseDown = () => this.setState({ isActive: true });

  onMouseUp = () => this.setState({ isActive: false });

  onMouseLeave = () => this.setState({ isActive: false });

  render() {
    const {
      getStyles,
      Icon,
      children,
      innerProps,
      innerRef,
      ...rest
    } = this.props;

    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown: this.onMouseDown,
      onMouseUp: this.onMouseUp,
      onMouseLeave: this.onMouseLeave,
    };

    const [styles, classes] = getPrimitiveStyles({ getStyles, ...rest });

    return (
      <div css={styles} className={classes} ref={innerRef} {...props}>
        <div
          css={{
            alignItems: 'center',
            display: 'flex ',
            flexShrink: 0,
            paddingRight: '4px',
            // Here we are adding a border to the Checkbox and Radio SVG icons
            // This is an a11y fix for Select only for now but it may be rolled
            // into the `@atlaskit/icon` package's Checkbox and Radio SVGs later
            '& svg rect, & svg circle:first-of-type': {
              stroke: getBorderColor({ ...this.props, ...this.state }),
              strokeWidth: '2px',
              strokeLinejoin: 'round',
            },
          }}
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
        <div
          css={{
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
            flexGrow: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export const CheckboxOption: FC<OptionProps<OptionType, true>> = (props) => (
  <ControlOption<OptionType, true> Icon={CheckboxIcon} {...props} />
);
export const RadioOption: FC<OptionProps> = (props) => (
  <ControlOption Icon={RadioIcon} {...props} />
);
