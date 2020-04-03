import { uid } from 'react-uid';
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion } from './version.json';
import {
  Handle,
  Icon,
  IconWrapper,
  Inner,
  Input,
  Label,
  Slide,
} from './styled';
import { StatelessProps, StyledProps, Sizes } from './types';

interface State {
  // not controlled by props but by browser focus
  isFocused: boolean;
}

class ToggleStateless extends Component<StatelessProps, State> {
  static defaultProps = {
    isDisabled: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    size: 'regular' as Sizes,
    label: '',
    name: '',
    value: '',
    isChecked: false,
  };

  state: State = {
    isFocused: false,
  };

  handleBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({ isFocused: false });
    this.props.onBlur!(event);
  };

  handleFocus: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({ isFocused: true });
    this.props.onFocus!(event);
  };

  handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onChange!(event);
  };

  render() {
    const {
      isChecked,
      isDisabled,
      label,
      name,
      size,
      value,
      testId,
    } = this.props;
    const { isFocused } = this.state;

    const styledProps: StyledProps = {
      isChecked,
      isDisabled,
      isFocused,
      size: size!,
    };

    const id = uid({ id: this.constructor.name });

    return (
      <Label htmlFor={id} data-testid={testId}>
        <Input
          checked={isChecked}
          disabled={isDisabled}
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          type="checkbox"
          value={value}
          data-testid={testId && `${testId}--input`}
        />
        <Slide {...styledProps}>
          <Inner {...styledProps}>
            <Handle
              isChecked={isChecked}
              isDisabled={isDisabled}
              size={size!}
            />
            <IconWrapper
              isChecked={isChecked}
              size={size!}
              aria-label={label || (isChecked ? 'Uncheck' : 'Check')}
            >
              <Icon isChecked={isChecked} size={size!} />
            </IconWrapper>
          </Inner>
        </Slide>
      </Label>
    );
  }
}

export { ToggleStateless as ToggleStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'toggle',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'toggle',

      attributes: {
        componentName: 'toggle',
        packageName,
        packageVersion,
      },
    }),

    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'toggle',

      attributes: {
        componentName: 'toggle',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'toggle',

      attributes: {
        componentName: 'toggle',
        packageName,
        packageVersion,
      },
    }),
  })(ToggleStateless),
);
