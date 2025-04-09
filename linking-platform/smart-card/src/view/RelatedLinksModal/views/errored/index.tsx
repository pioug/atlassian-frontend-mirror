import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { GenericErrorIcon } from '../../../../common/ui/icons/generic-error-icon';
import { messages } from '../../../../messages';
import { EmptyState } from '../../components/EmptyState';

import { ErrorSVG } from './error-svg';

const RelatedLinksErroredView = () => {
	const intl = useIntl();

	return fg('platform-linking-visual-refresh-v2') ? (
		<EmptyState
			renderImage={() => <GenericErrorIcon />}
			header={intl.formatMessage(messages.related_links_modal_error_title)}
			description={<FormattedMessage {...messages.related_links_modal_error_description} />}
		/>
	) : (
		<EmptyState
			renderImage={() => <ErrorSVG />}
			header={intl.formatMessage(messages.related_links_modal_error_header)}
			description={<FormattedMessage {...messages.related_links_modal_error_message} />}
		/>
	);
};

export default RelatedLinksErroredView;
