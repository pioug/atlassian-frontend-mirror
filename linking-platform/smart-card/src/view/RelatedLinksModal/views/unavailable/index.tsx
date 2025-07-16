import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { messages } from '../../../../messages';
import { EmptyState } from '../../components/EmptyState';
import { SpotSearchNoResult } from '../errored/error-svg/search-no-result';

const RelatedLinksUnavailableView = () => {
	const intl = useIntl();

	return (
		<EmptyState
			renderImage={() => <SpotSearchNoResult />}
			header={intl.formatMessage(messages.related_links_modal_unavailable_title)}
			description={<FormattedMessage {...messages.related_links_modal_unavailable_description} />}
		/>
	);
};

export default RelatedLinksUnavailableView;
