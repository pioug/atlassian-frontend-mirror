import React from 'react';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { Text } from '@atlaskit/primitives';

import NotFoundImage from '../../../../assets/NotFoundImage';
import { messages } from '../../../../messages';

import { WhatsNewResultsEmptyMessageImage, WhatsNewResultsEmptyMessageText } from './styled';

export interface Props {
	onClearFilter: () => void;
}

export const WhatsNewResultsEmpty: React.FC<Props & WrappedComponentProps> = ({
	onClearFilter,
	intl: { formatMessage },
}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleClearFilterLinkClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.preventDefault();
		const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
			action: 'clicked',
		});
		analyticsEvent.fire();
		onClearFilter();
	};

	return (
		<>
			<WhatsNewResultsEmptyMessageImage>
				<NotFoundImage />
			</WhatsNewResultsEmptyMessageImage>

			<WhatsNewResultsEmptyMessageText>
				<Text as="strong">{formatMessage(messages.help_whats_new_no_results)}</Text>
			</WhatsNewResultsEmptyMessageText>

			<WhatsNewResultsEmptyMessageText>
				<Text as="p">
					{formatMessage(messages.help_whats_new_no_results_info)}
					<br />
					<AnalyticsContext
						data={{
							componentName: 'WhatsNewResultsEmpty',
						}}
					>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<a href="#" onClick={handleClearFilterLinkClick}>
							{formatMessage(messages.help_whats_new_no_results_clear_filter_button_label)}
						</a>
						<Text>{formatMessage(messages.help_whats_new_no_results_clear_filter_info)}</Text>
					</AnalyticsContext>
				</Text>
			</WhatsNewResultsEmptyMessageText>
		</>
	);
};

export default injectIntl(WhatsNewResultsEmpty);
