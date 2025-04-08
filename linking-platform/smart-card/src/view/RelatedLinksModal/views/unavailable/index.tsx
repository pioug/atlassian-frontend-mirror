import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { messages } from '../../../../messages';
import { EmptyState } from '../../components/EmptyState';
import { SpotSearchNoResult } from '../errored/error-svg/search-no-result';

import { UnavailableSVG } from './unavailable-svg';

const RelatedLinksUnavailableView = () => {
	const intl = useIntl();

	return fg('platform-linking-visual-refresh-v2') ? (
		<EmptyState
			renderImage={() => (
				<SpotSearchNoResult
					size={'large'}
					alt={intl.formatMessage(messages.related_links_modal_unavailable_title)}
				/>
			)}
			header={intl.formatMessage(messages.related_links_modal_unavailable_title)}
			description={<FormattedMessage {...messages.related_links_modal_unavailable_description} />}
		/>
	) : (
		<EmptyState
			renderImage={() => <UnavailableSVG />}
			header={intl.formatMessage(messages.related_links_modal_unavailable_header)}
			description={<FormattedMessage {...messages.related_links_modal_unavailable_message} />}
		/>
	);
};

export default RelatedLinksUnavailableView;
