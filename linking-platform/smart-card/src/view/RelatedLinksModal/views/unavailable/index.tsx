import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';
import { messages } from '../../../../messages';
import { EmptyState } from '../../components/EmptyState';
import { UnavailableSVG } from './unavailable-svg';

export const RelatedLinksUnavailableView = () => {
	const intl = useIntl();

	return (
		<EmptyState
			renderImage={() => <UnavailableSVG />}
			header={intl.formatMessage(messages.related_links_modal_unavailable_header)}
			description={<FormattedMessage {...messages.related_links_modal_unavailable_message} />}
		/>
	);
};
