/** @jsx jsx */
import { jsx, InterpolationWithTheme } from '@emotion/core';
import { Component, FC } from 'react';
import RadioIcon from '@atlaskit/icon/glyph/radio';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { OptionProps } from '../types';

const getPrimitiveStyles = (
  props: Omit<OptionProps, 'children' | 'innerProps' | 'innerRef'>,
): [InterpolationWithTheme<any>, string] => {
  const { cx, className, getStyles, isDisabled, isFocused, isSelected } = props;

  const styles = {
    alignItems: 'center',
    backgroundColor: isFocused ? colors.N30 : 'transparent',
    color: 'inherit',
    display: 'flex ',
    paddingBottom: 4,
    paddingLeft: `${gridSize() * 2}px`,
    paddingTop: 4,

    ':active': {
      backgroundColor: colors.B50,
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
  return [augmentedStyles, cx(null, bemClasses, className) as string];
};

// maintains function shape
const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
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
  let color = backgroundColor;
  if (isDisabled && isSelected) {
    color = themed({ light: colors.B75, dark: colors.DN200 });
  } else if (isDisabled) {
    color = themed({ light: colors.N20A, dark: colors.DN10 });
  } else if (isActive) {
    color = themed({ light: colors.B75, dark: colors.B200 });
  } else if (isFocused && isSelected) {
    color = themed({ light: colors.B300, dark: colors.B75 });
  } else if (isFocused) {
    color = themed({ light: colors.N50A, dark: colors.DN30 });
  } else if (isSelected) {
    color = colors.blue;
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
  let color = themed({ light: colors.N0, dark: colors.DN10 });

  if (isDisabled && isSelected) {
    color = themed({ light: colors.N70, dark: colors.DN10 });
  } else if (isActive && isSelected && !isDisabled) {
    color = themed({ light: colors.B400, dark: colors.DN10 });
  } else if (!isSelected) {
    color = transparent;
  }
  return color(rest);
};

interface OptionState {
  isActive?: boolean;
}

class ControlOption extends Component<OptionProps, OptionState> {
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

export const CheckboxOption: FC<OptionProps> = props => (
  <ControlOption Icon={CheckboxIcon} {...props} />
);
export const RadioOption: FC<OptionProps> = props => (
  <ControlOption Icon={RadioIcon} {...props} />
);
