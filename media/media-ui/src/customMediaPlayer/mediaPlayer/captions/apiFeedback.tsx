import React from 'react';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { token } from '@atlaskit/tokens';
import { type WithIntlProps, type WrappedComponentProps, injectIntl } from 'react-intl';
import { messages } from '../../../messages';

export type NotificationTypes = 'success' | 'error' | null;

export interface ApiFeedbackProps {
	notificationType: NotificationTypes;
	onDismissed: () => void;
	successDescription: string;
	errorDescription: string;
}

function ApiFeedback({
	notificationType,
	onDismissed,
	successDescription,
	errorDescription,
	intl,
}: ApiFeedbackProps & WrappedComponentProps) {
	let flag: React.ReactElement | undefined;

	if (notificationType === 'success') {
		flag = (
			<AutoDismissFlag
				id={'success'}
				icon={
					<SuccessIcon label="Success" color={token('color.icon.success')} spacing="spacious" />
				}
				key={'success'}
				title={intl.formatMessage(messages.success)}
				description={successDescription}
			/>
		);
	} else if (notificationType === 'error') {
		flag = (
			<AutoDismissFlag
				id={'error'}
				icon={<ErrorIcon label="Error" color={token('color.icon.danger')} spacing="spacious" />}
				key={'error'}
				title={intl.formatMessage(messages.error)}
				description={errorDescription}
			/>
		);
	}
	return <FlagGroup onDismissed={onDismissed}>{flag}</FlagGroup>;
}

const _default_1: React.FC<WithIntlProps<ApiFeedbackProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<ApiFeedbackProps & WrappedComponentProps>;
} = injectIntl(ApiFeedback);
export default _default_1;
