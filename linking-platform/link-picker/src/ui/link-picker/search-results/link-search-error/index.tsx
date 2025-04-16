import React from 'react';

import { defineMessages, FormattedMessage, useIntl } from 'react-intl-next';

import { isFedRamp } from '@atlaskit/atlassian-context';
import Button from '@atlaskit/button';
import NewButton from '@atlaskit/button/new';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import { GenericErrorSVG } from '../../../../common/generic-error-svg';
import { GenericErrorSVGV2 } from '../../../../common/generic-error-svg-v2';
import { EmptyState } from '../../../../common/ui/empty-state';

export const CONTACT_SUPPORT_LINK = 'https://support.atlassian.com/contact/';
export const CONTACT_SUPPORT_LINK_FEDRAMP =
	'https://gcs.atlassian-us-gov-mod.net/servicedesk/customer/portals';

export const messages = defineMessages({
	searchErrorHeader: {
		id: 'fabric.linkPicker.search.error.heading',
		defaultMessage: 'We’re having trouble loading data.',
		description: 'Heading message shown when a search throws an error',
	},
	searchErrorDescription: {
		id: 'fabric.linkPicker.search.error.description',
		defaultMessage:
			'Refresh the page, or contact <a>Atlassian Support</a> if this keeps happening.',
		description: 'Describes possible actions when search throws an error',
	},
	searchErrorAction: {
		id: 'fabric.linkPicker.search.error.retry',
		defaultMessage: 'Refresh',
		description: 'Describe the action user can take to retry the search',
	},
});

export const testIds = {
	searchError: 'link-search-error',
};

type LinkSearchErrorProps = {
	/** Only used if fg `platform-linking-visual-refresh-link-picker` is enabled */
	onRetry?: () => void;
};

export const LinkSearchError = ({ onRetry }: LinkSearchErrorProps) => {
	const intl = useIntl();

	const ButtonComponent = fg('platform-link-picker-remove-legacy-button') ? NewButton : Button;
	return (
		<EmptyState
			testId={testIds.searchError}
			header={intl.formatMessage(messages.searchErrorHeader)}
			description={
				<FormattedMessage
					{...messages.searchErrorDescription}
					values={{
						a: (label: React.ReactNode[]) =>
							fg('platform-link-picker-remove-legacy-button') ? (
								<Link
									href={isFedRamp() ? CONTACT_SUPPORT_LINK_FEDRAMP : CONTACT_SUPPORT_LINK}
									target="_blank"
									rel="noopener noreferrer"
								>
									{label}
								</Link>
							) : (
								<Button
									appearance="link"
									spacing="none"
									href={isFedRamp() ? CONTACT_SUPPORT_LINK_FEDRAMP : CONTACT_SUPPORT_LINK}
									target="_blank"
									rel="noopener noreferrer"
								>
									{label}
								</Button>
							),
					}}
				/>
			}
			action={
				onRetry && fg('platform-linking-visual-refresh-link-picker') ? (
					<ButtonComponent appearance="primary" onClick={onRetry}>
						<FormattedMessage {...messages.searchErrorAction} />
					</ButtonComponent>
				) : null
			}
			renderImage={
				fg('platform-linking-visual-refresh-link-picker')
					? () => <GenericErrorSVGV2 />
					: () => <GenericErrorSVG />
			}
		/>
	);
};
