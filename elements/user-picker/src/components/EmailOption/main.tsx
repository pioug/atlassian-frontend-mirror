/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { B400, N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type Email } from '../../types';
import { AddOptionAvatar } from '../AddOptionAvatar';
import { AvatarItemOption, textWrapper } from '../AvatarItemOption';
import { messages } from '../i18n';
import { type EmailValidationResponse } from '../emailValidation';

export type EmailOptionProps = {
	email: Email;
	isSelected: boolean;
	label?: string;
	emailValidity: EmailValidationResponse;
};

const getAddEmailMessage: (validity: EmailValidationResponse) => any = (validity) =>
	validity === 'POTENTIAL' ? messages.continueToAddEmail : messages.selectToAddEmail;

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
			<span
				key="name"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					this.props.isSelected ? token('color.text.selected', B400) : token('color.text', N800),
				)}
			>
				{id}
			</span>
		);
	};

	private renderSecondaryText = (label: string) => {
		return (
			<span
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					this.props.isSelected
						? token('color.text.selected', B400)
						: token('color.text.subtlest', N200),
				)}
				data-testid="user-picker-email-secondary-text"
			>
				{label}
			</span>
		);
	};

	private renderOption = (label: string) => (
		<AvatarItemOption
			avatar={<AddOptionAvatar label={label} />}
			lozenge={this.getLozengeProps()}
			isDisabled={this.props.email.isDisabled}
			primaryText={this.renderPrimaryText()}
			secondaryText={this.renderSecondaryText(label)}
		/>
	);

	render() {
		const { label, emailValidity } = this.props;
		return label !== undefined ? (
			this.renderOption(label)
		) : (
			<FormattedMessage {...getAddEmailMessage(emailValidity)}>
				{(label) => this.renderOption(label as unknown as string)}
			</FormattedMessage>
		);
	}
}
