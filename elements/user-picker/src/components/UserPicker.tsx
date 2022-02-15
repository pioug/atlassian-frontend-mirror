import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import Select, { CreatableSelect } from '@atlaskit/select';
import React from 'react';
import { UserPickerProps } from '../types';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';
import { getStyles } from './styles';
import { getComponents } from './components';
import { getCreatableProps } from './creatable';
import { getCreatableSuggestedEmailProps } from './creatableEmailSuggestion';
import MessagesIntlProvider from './MessagesIntlProvider';
import { ExusUserSourceProvider } from './../clients/UserSourceProvider';
import { userPickerRenderedUfoExperience as experience } from './utils';
import { v4 as uuidv4 } from 'uuid';

export class UserPickerWithoutAnalytics extends React.Component<
  UserPickerProps
> {
  ufoId: string;

  constructor(props: UserPickerProps) {
    super(props);
    this.ufoId = uuidv4();
    if (this.ufoId) {
      const experienceForId = experience.getInstance(this.ufoId);
      experienceForId.start();
    }
  }

  static defaultProps = {
    width: 350,
    isMulti: false,
  };

  componentDidMount() {
    if (this.ufoId) {
      const experienceForId = experience.getInstance(this.ufoId);
      experienceForId.success();
    }
  }

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
      menuShouldBlockScroll,
      captureMenuScroll,
      closeMenuOnScroll,
      loadUserSource,
    } = this.props;
    const width = this.props.width as string | number;

    const SelectComponent = allowEmail ? CreatableSelect : Select;
    const creatableProps = suggestEmailsForDomain
      ? getCreatableSuggestedEmailProps(suggestEmailsForDomain, isValidEmail)
      : getCreatableProps(isValidEmail);

    const defaultPickerProps = {
      closeMenuOnScroll,
      menuPortalTarget,
      menuPosition,
      menuShouldBlockScroll,
      captureMenuScroll,
    };

    const pickerProps = allowEmail
      ? {
          ...defaultPickerProps,
          ...creatableProps,
          emailLabel,
        }
      : { ...defaultPickerProps };

    return (
      <MessagesIntlProvider>
        <ExusUserSourceProvider fetchUserSource={loadUserSource}>
          <BaseUserPickerWithoutAnalytics
            {...this.props}
            width={width}
            SelectComponent={SelectComponent}
            styles={getStyles(width, isMulti, this.props.styles)}
            components={getComponents(isMulti, anchor)}
            pickerProps={pickerProps}
          />
        </ExusUserSourceProvider>
      </MessagesIntlProvider>
    );
  }
}

export const UserPicker = withAnalyticsEvents()(UserPickerWithoutAnalytics);
