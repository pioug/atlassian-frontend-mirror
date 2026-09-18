import React from 'react';

import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';

import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import Button from '@atlaskit/button/button';
import Heading from '@atlaskit/heading/heading';
import { Text } from '@atlaskit/primitives/compiled';

import SomethingWrongImage from '../../../assets/SomethingWrongImage';
import { messages } from '../../../messages';
import { LoadingErrorMessage, LoadingErrorButtonContainer, LoadingErrorHeading } from './styled';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'ArticleLoadingFail',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface Props {
	intl: WrappedComponentProps['intl'];
	// Function executed when the user click "try again"
	onTryAgainButtonClick?(event: React.MouseEvent, analyticsEvent: UIAnalyticsEvent): void;
}

export const ArticleLoadingFail = ({
	onTryAgainButtonClick,
	intl: { formatMessage },
}: Props): React.JSX.Element => {
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
			<Text as="p">{formatMessage(messages.help_article_error_text)}</Text>
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

const _default_1: React.FC<WithIntlProps<Props>> & {
	WrappedComponent: React.ComponentType<Props>;
} = injectIntl(ArticleLoadingFailWithContext);
export default _default_1;
