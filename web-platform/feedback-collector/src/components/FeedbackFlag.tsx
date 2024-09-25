import React, { type FunctionComponent } from 'react';

import { useIntl } from 'react-intl-next';

import { AutoDismissFlag } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/migration/success--check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { messages } from '../messages';

import { IntlProviderWithResolvedMessages } from './IntlProviderWithResolvedMessages';

interface AkProps {
	isDismissAllowed?: boolean;
	description?: React.ReactText;
	title?: React.ReactText;
	onDismissed?: (...args: Array<any>) => void;
}
const FeedbackFlag = ({ description, title }: AkProps) => {
	const { formatMessage } = useIntl();
	return (
		<AutoDismissFlag
			icon={
				<SuccessIcon spacing="spacious" color={token('color.icon.success', G300)} label="Success" />
			}
			id="feedbackSent"
			description={description || formatMessage(messages.feedbackSuccessFlagDescription)}
			title={title || formatMessage(messages.feedbackSuccessFlagTitle)}
		/>
	);
};

const FeedbackFlagWithIntl: FunctionComponent<AkProps & { locale?: string }> = (props) => (
	<IntlProviderWithResolvedMessages locale={props.locale}>
		<FeedbackFlag {...props} />
	</IntlProviderWithResolvedMessages>
);

export default FeedbackFlagWithIntl;
