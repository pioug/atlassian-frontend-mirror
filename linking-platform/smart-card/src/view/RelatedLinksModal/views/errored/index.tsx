import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { messages } from '../../../../messages';
import { EmptyState } from '../../components/EmptyState';

import { ErrorSVG } from './error-svg';

const RelatedLinksErroredView = () => {
	const intl = useIntl();

	return (
		<EmptyState
			renderImage={() => <ErrorSVG />}
			header={intl.formatMessage(messages.related_links_modal_error_header)}
			description={<FormattedMessage {...messages.related_links_modal_error_message} />}
		/>
	);
};

export default RelatedLinksErroredView;
