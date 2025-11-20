import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { GenericErrorIcon } from '../../../../common/ui/icons/generic-error-icon';
import { messages } from '../../../../messages';
import { EmptyState } from '../../components/EmptyState';

const RelatedLinksErroredView = (): React.JSX.Element => {
	const intl = useIntl();

	return (
		<EmptyState
			renderImage={() => <GenericErrorIcon data-testid="related-links-error-svg" />}
			header={intl.formatMessage(messages.related_links_modal_error_title)}
			description={<FormattedMessage {...messages.related_links_modal_error_description} />}
		/>
	);
};

export default RelatedLinksErroredView;
