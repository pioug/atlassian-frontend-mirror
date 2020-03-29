import React, { Component } from 'react';
import memoize from 'memoize-one';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import GlobalTheme from '@atlaskit/theme/components';
import Theme, { componentTokens } from './theme';
import { createExtender, ExtenderType } from './utils';
import CheckboxIcon from './CheckboxIcon';

import { name as packageName, version as packageVersion } from './version.json';

import {
  LabelTextOverrides,
  LabelOverrides,
  CheckboxWrapper,
  RequiredIndicator,
  HiddenCheckbox,
} from './elements';
import { CheckboxProps, CheckboxDefaults, CheckboxOverrides } from './types';

const defaults: CheckboxDefaults = {
  Label: LabelOverrides,
  LabelText: LabelTextOverrides,
  HiddenCheckbox: {
    attributesFn: () => ({}),
  },
};

interface State {
  isActive: boolean;
  isChecked?: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isMouseDown: boolean;
}

class Checkbox extends Component<CheckboxProps, State> {
  static defaultProps: CheckboxProps = {
    isDisabled: false,
    isInvalid: false,
    defaultChecked: false,
    isIndeterminate: false,
    theme: (current, props) => current(props),
  };

  state: State = {
    isActive: false,
    isFocused: false,
    isHovered: false,
    isMouseDown: false,
    isChecked:
      this.props.isChecked !== undefined
        ? this.props.isChecked
        : this.props.defaultChecked,
  };
  createExtender?: ExtenderType;
  checkbox?: HTMLInputElement | null = undefined;
  actionKeys = [' '];

  constructor(props: CheckboxProps) {
    super(props);
    this.createExtender = memoize(createExtender);
  }

  componentDidMount() {
    const { isIndeterminate } = this.props;
    // there is no HTML attribute for indeterminate, and thus no prop equivalent.
    // it must be set via the ref.
    if (this.checkbox) {
      this.checkbox.indeterminate = !!isIndeterminate;
      if (this.props.inputRef) {
        this.props.inputRef(this.checkbox);
      }
    }
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    const { isIndeterminate } = this.props;

    if (prevProps.isIndeterminate !== isIndeterminate && this.checkbox) {
      this.checkbox.indeterminate = !!isIndeterminate;
    }
  }

  onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.isDisabled) {
      return null;
    }
    event.persist();
    if (event.target.checked !== undefined) {
      this.setState({ isChecked: event.target.checked });
    }
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    return true;
  };

  // expose blur/focus to consumers via ref
  blur = () => {
    if (this.checkbox && this.checkbox.blur) {
      this.checkbox.blur();
    }
  };

  focus = () => {
    if (this.checkbox && this.checkbox.focus) {
      this.checkbox.focus();
    }
  };

  onBlur = () =>
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });

  onFocus = () => this.setState({ isFocused: true });

  onMouseLeave = () => this.setState({ isActive: false, isHovered: false });

  onMouseEnter = () => this.setState({ isHovered: true });

  onMouseUp = () => this.setState({ isActive: false, isMouseDown: false });

  onMouseDown = () => this.setState({ isActive: true, isMouseDown: true });

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key in this.actionKeys) {
      this.setState({ isActive: true });
    }
  };
  onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key in this.actionKeys) {
      this.setState({ isActive: false });
    }
  };

  render() {
    const {
      isDisabled,
      isInvalid,
      isIndeterminate,
      label,
      name,
      overrides,
      value,
      isRequired,
      //props not passed into HiddenCheckbox
      isChecked: propsIsChecked,
      theme,
      testId,
    } = this.props;

    const isChecked =
      this.props.isChecked === undefined
        ? this.state.isChecked
        : propsIsChecked;
    const { isFocused, isActive, isHovered } = this.state;
    const getOverrides = createExtender<CheckboxDefaults, CheckboxOverrides>(
      defaults,
      overrides,
    );
    const { component: Label, ...labelOverrides } = getOverrides('Label');
    const { component: LabelText, ...labelTextOverrides } = getOverrides(
      'LabelText',
    );
    const { attributesFn: hiddenCheckboxAttributesFn } = getOverrides(
      'HiddenCheckbox',
    );

    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }: { mode: 'light' | 'dark' }) => (
            <Theme.Consumer mode={mode} tokens={componentTokens}>
              {tokens => (
                <Label
                  {...labelOverrides}
                  isDisabled={isDisabled}
                  onMouseDown={this.onMouseDown}
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onMouseUp={this.onMouseUp}
                  tokens={tokens}
                  testId={testId && `${testId}--checkbox-label`}
                >
                  <CheckboxWrapper>
                    <HiddenCheckbox
                      disabled={isDisabled}
                      checked={isChecked}
                      onChange={this.onChange}
                      onBlur={this.onBlur}
                      onFocus={this.onFocus}
                      onKeyUp={this.onKeyUp}
                      onKeyDown={this.onKeyDown}
                      value={value}
                      name={name}
                      ref={r => (this.checkbox = r)}
                      required={isRequired}
                      attributesFn={hiddenCheckboxAttributesFn}
                      testId={testId && `${testId}--hidden-checkbox`}
                    />
                    <CheckboxIcon
                      theme={theme}
                      overrides={{
                        IconWrapper: overrides && overrides.IconWrapper,
                        Icon: overrides && overrides.Icon,
                        IconIndeterminate:
                          overrides && overrides.IconIndeterminate,
                      }}
                      isChecked={isChecked}
                      isDisabled={isDisabled}
                      isFocused={isFocused}
                      isActive={isActive}
                      isHovered={isHovered}
                      isInvalid={isInvalid}
                      isIndeterminate={isIndeterminate}
                      primaryColor="inherit"
                      secondaryColor="inherit"
                      label=""
                    />
                  </CheckboxWrapper>
                  <LabelText {...labelTextOverrides} tokens={tokens}>
                    {label}
                    {isRequired && (
                      <RequiredIndicator tokens={tokens} aria-hidden="true">
                        *
                      </RequiredIndicator>
                    )}
                  </LabelText>
                </Label>
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }
}

export { Checkbox as CheckboxWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'checkbox',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'checkbox',

      attributes: {
        componentName: 'checkbox',
        packageName,
        packageVersion,
      },
    }),
  })(Checkbox),
);
