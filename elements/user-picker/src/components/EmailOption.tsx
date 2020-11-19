import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Email } from '../types';
import { AddOptionAvatar } from './AddOptionAvatar';
import { AvatarItemOption } from './AvatarItemOption';
import { messages } from './i18n';
import { EmailValidationResponse } from './emailValidation';

export type EmailOptionProps = {
  email: Email;
  isSelected: boolean;
  label?: string;
  emailValidity: EmailValidationResponse;
};

const getAddEmailMessage: (
  validity: EmailValidationResponse,
) => any = validity =>
  validity === 'POTENTIAL'
    ? messages.continueToAddEmail
    : messages.selectToAddEmail;

export class EmailOption extends React.PureComponent<EmailOptionProps> {
  private getLozengeProps = () =>
    this.props.email.lozenge
      ? {
          text: this.props.email.lozenge,
        }
      : undefined;

  private renderOption = (
    label: string,
    validity: EmailValidationResponse,
    suggestion?: boolean,
  ) => (
    <AvatarItemOption
      avatar={
        <AddOptionAvatar
          suggestion={suggestion}
          invalidOption={suggestion && validity !== 'VALID'}
          label={label}
          size={suggestion ? 'medium' : undefined}
        />
      }
      primaryText={this.props.email.id}
      secondaryText={label}
      lozenge={this.getLozengeProps()}
    />
  );

  render() {
    const { label, emailValidity, email } = this.props;
    return label !== undefined ? (
      this.renderOption(label, emailValidity, email.suggestion)
    ) : (
      <FormattedMessage {...getAddEmailMessage(emailValidity)}>
        {label =>
          this.renderOption(label as string, emailValidity, email.suggestion)
        }
      </FormattedMessage>
    );
  }
}
