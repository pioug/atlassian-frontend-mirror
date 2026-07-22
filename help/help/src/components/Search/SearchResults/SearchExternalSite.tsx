import React from 'react';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/core/link-external';
import {
	injectIntl,
	FormattedMessage,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';
import { Text } from '@atlaskit/primitives/compiled';

import { messages } from '../../../messages';

import { SearchResultSearchExternalSiteContainer } from './styled';
import { token } from '@atlaskit/tokens';

export interface Props {
	onSearchExternalUrlClick?(
		event?: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent?: UIAnalyticsEvent,
	): void;
	searchExternalUrl?: string;
}

export const SearchExternalSite: React.FC<Props & WrappedComponentProps> = ({
	searchExternalUrl,
	onSearchExternalUrlClick,
	intl: { formatMessage },
}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleExternalUrlClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (onSearchExternalUrlClick) {
			const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
				action: 'clicked',
			});
			onSearchExternalUrlClick(event, analyticsEvent);
		}
	};
	return searchExternalUrl ? (
		<SearchResultSearchExternalSiteContainer>
			<Text as="p">
				<AnalyticsContext
					data={{
						componentName: 'searchExternalUrl',
					}}
				>
					<FormattedMessage
						{...messages.help_search_results_search_external_site}
						values={{
							a: (chunks) => (
								<Button
									appearance="link"
									iconAfter={<ShortcutIcon label="" color={token('color.icon.subtle')} />}
									spacing="compact"
									href={searchExternalUrl}
									target="_blank"
									onClick={handleExternalUrlClick}
								>
									{chunks}
								</Button>
							),
						}}
					/>
				</AnalyticsContext>
			</Text>
		</SearchResultSearchExternalSiteContainer>
	) : null;
};

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(SearchExternalSite);
export default _default_1;
