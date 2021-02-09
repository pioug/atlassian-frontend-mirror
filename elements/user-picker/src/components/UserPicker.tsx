import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import Select, { CreatableSelect } from '@atlaskit/select';
import React from 'react';
import { UserPickerProps } from '../types';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';
import { getStyles } from './styles';
import { getComponents } from './components';
import { getCreatableProps } from './creatable';
import { getCreatableSuggestedEmailProps } from './creatableEmailSuggestion';

export class UserPickerWithoutAnalytics extends React.Component<
  UserPickerProps
> {
  static defaultProps = {
    width: 350,
    isMulti: false,
  };

  render() {
    const {
      emailLabel,
      allowEmail,
      suggestEmailsForDomain,
      isMulti,
      isValidEmail,
      anchor,
      menuPortalTarget,
      menuPosition,
      captureMenuScroll,
    } = this.props;
    const width = this.props.width as string | number;

    const SelectComponent = allowEmail ? CreatableSelect : Select;
    const creatableProps = suggestEmailsForDomain
      ? getCreatableSuggestedEmailProps(suggestEmailsForDomain, isValidEmail)
      : getCreatableProps(isValidEmail);

    const defaultPickerProps = {
      menuPortalTarget: menuPortalTarget,
      menuPosition: menuPosition,
      captureMenuScroll: captureMenuScroll,
    };

    const pickerProps = allowEmail
      ? {
          ...defaultPickerProps,
          ...creatableProps,
          emailLabel,
        }
      : { ...defaultPickerProps };

    return (
      <BaseUserPickerWithoutAnalytics
        {...this.props}
        width={width}
        SelectComponent={SelectComponent}
        styles={getStyles(width, isMulti, this.props.styles)}
        components={getComponents(isMulti, anchor)}
        pickerProps={pickerProps}
      />
    );
  }
}

export const UserPicker = withAnalyticsEvents()(UserPickerWithoutAnalytics);
