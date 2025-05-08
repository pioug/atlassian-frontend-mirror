import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import { isFedRamp } from '@atlaskit/atlassian-context';
import Button from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import commonMessages from '../../messages';

import ErrorSVG from './error-svg';
import messages from './messages';

export const CONTACT_SUPPORT_LINK = 'https://support.atlassian.com/contact/';
export const CONTACT_SUPPORT_LINK_FEDRAMP =
	'https://gcs.atlassian-us-gov-mod.net/servicedesk/customer/portals';

export const ErrorBoundaryUI = () => {
	const intl = useIntl();

	return (
		<EmptyState
			maxImageWidth={82}
			testId={'link-create-error-boundary-ui'}
			header={intl.formatMessage(commonMessages.genericErrorMessage)}
			description={
				<FormattedMessage
					{...messages.description}
					values={{
						a: (label: React.ReactNode[]) => fg('platform-link-create-button-migration') ? (
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
			renderImage={() => <ErrorSVG />}
		/>
	);
};
