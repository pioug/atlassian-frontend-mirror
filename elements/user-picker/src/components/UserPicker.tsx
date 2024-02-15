import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import Select, { CreatableSelect } from '@atlaskit/select';
import { UFOExperienceState } from '@atlaskit/ufo';
import React from 'react';
import { UserPickerProps } from '../types';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';
import { getStyles } from './styles';
import { getComponents } from './components';
import { getCreatableProps } from './creatable';
import { getCreatableSuggestedEmailProps } from './creatableEmailSuggestion';
import MessagesIntlProvider from './MessagesIntlProvider';
import { ExusUserSourceProvider } from '../clients/UserSourceProvider';
import {
  userPickerRenderedUfoExperience as experience,
  UfoErrorBoundary,
} from '../util/ufoExperiences';
import { v4 as uuidv4 } from 'uuid';

export class UserPickerWithoutAnalytics extends React.Component<UserPickerProps> {
  ufoId: string;

  constructor(props: UserPickerProps) {
    super(props);
    this.ufoId = uuidv4();
    const experienceForId = experience.getInstance(this.ufoId);
    experienceForId.start();
  }

  static defaultProps = {
    width: 350,
    isMulti: false,
  };

  componentDidMount() {
    const experienceForId = experience.getInstance(this.ufoId);

    // Send UFO success if the experience is still in progress i.e. hasn't failed
    if (
      [
        UFOExperienceState.IN_PROGRESS.id,
        UFOExperienceState.STARTED.id,
      ].includes(experienceForId.state.id)
    ) {
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
      required = false,
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
      required,
    };

    const pickerProps = allowEmail
      ? {
          ...defaultPickerProps,
          ...creatableProps,
          emailLabel,
        }
      : { ...defaultPickerProps };

    return (
      <UfoErrorBoundary id={this.ufoId}>
        <MessagesIntlProvider>
          <ExusUserSourceProvider fetchUserSource={loadUserSource}>
            <BaseUserPickerWithoutAnalytics
              {...this.props}
              width={width}
              SelectComponent={SelectComponent}
              styles={getStyles(
                width,
                isMulti,
                this.props.appearance === 'compact',
                this.props.styles,
              )}
              components={getComponents(isMulti, anchor)}
              pickerProps={pickerProps}
            />
          </ExusUserSourceProvider>
        </MessagesIntlProvider>
      </UfoErrorBoundary>
    );
  }
}

export const UserPicker = withAnalyticsEvents()(UserPickerWithoutAnalytics);
