import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { B400, N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { Email } from '../../types';
import { AddOptionAvatar } from '../AddOptionAvatar';
import { AvatarItemOption, TextWrapper } from '../AvatarItemOption';
import { messages } from '../i18n';
import { EmailValidationResponse } from '../emailValidation';

export type EmailOptionProps = {
  email: Email;
  isSelected: boolean;
  label?: string;
  emailValidity: EmailValidationResponse;
};

const getAddEmailMessage: (validity: EmailValidationResponse) => any = (
  validity,
) =>
  validity === 'POTENTIAL'
    ? messages.continueToAddEmail
    : messages.selectToAddEmail;

export class EmailOption extends React.PureComponent<EmailOptionProps> {
  private getLozengeProps = () =>
    typeof this.props.email.lozenge === 'string'
      ? {
          text: this.props.email.lozenge,
        }
      : this.props.email.lozenge;

  private renderPrimaryText = () => {
    const {
      email: { id },
    } = this.props;

    return (
      <TextWrapper
        key="name"
        color={
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text.highEmphasis', N800)
        }
      >
        {id}
      </TextWrapper>
    );
  };

  private renderSecondaryText = (label: string) => {
    return (
      <TextWrapper
        color={
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text.lowEmphasis', N200)
        }
      >
        {label}
      </TextWrapper>
    );
  };

  private renderOption = (label: string) => (
    <AvatarItemOption
      avatar={<AddOptionAvatar label={label} />}
      primaryText={this.renderPrimaryText()}
      secondaryText={this.renderSecondaryText(label)}
      lozenge={this.getLozengeProps()}
    />
  );

  render() {
    const { label, emailValidity } = this.props;
    return label !== undefined ? (
      this.renderOption(label)
    ) : (
      <FormattedMessage {...getAddEmailMessage(emailValidity)}>
        {(label) => this.renderOption((label as unknown) as string)}
      </FormattedMessage>
    );
  }
}