import React from 'react';
import Button from '@atlaskit/button';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import Heading from '@atlaskit/heading';

import { messages } from '../../../messages';
import SomethingWrongImage from '../../../assets/SomethingWrongImage';

import { LoadingErrorMessage, LoadingErrorButtonContainer, LoadingErrorHeading } from './styled';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'ArticleLoadingFail',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
	// Function executed when the user click "try again"
	onTryAgainButtonClick?(event: React.MouseEvent, analyticsEvent: UIAnalyticsEvent): void;
	intl: WrappedComponentProps['intl'];
}

export const ArticleLoadingFail = ({ onTryAgainButtonClick, intl: { formatMessage } }: Props) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleOnTryAgainButtonClick =
		onTryAgainButtonClick &&
		((event: React.MouseEvent): void => {
			const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
				action: 'clicked',
			});

			onTryAgainButtonClick(event, analyticsEvent);
		});

	return (
		<LoadingErrorMessage>
			<SomethingWrongImage />
			<LoadingErrorHeading>
				<Heading size="large">{formatMessage(messages.help_article_error_title)}</Heading>
			</LoadingErrorHeading>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			<p>{formatMessage(messages.help_article_error_text)}</p>
			<LoadingErrorButtonContainer>
				{handleOnTryAgainButtonClick && (
					<Button onClick={handleOnTryAgainButtonClick}>
						{formatMessage(messages.help_article_error_button_label)}
					</Button>
				)}
			</LoadingErrorButtonContainer>
		</LoadingErrorMessage>
	);
};

const ArticleLoadingFailWithContext: React.FC<Props> = (props) => {
	return (
		<AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
			<ArticleLoadingFail {...props} />
		</AnalyticsContext>
	);
};

export default injectIntl(ArticleLoadingFailWithContext);
