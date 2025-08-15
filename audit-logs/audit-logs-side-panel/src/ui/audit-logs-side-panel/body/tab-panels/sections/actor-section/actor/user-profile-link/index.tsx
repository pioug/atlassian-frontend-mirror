/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import Link from '@atlaskit/link';

import type { AuditLogEventData } from '../../../../../../../../common/types';

const messages = defineMessages({
	userProfileValue: {
		id: 'organization.audit.log.side-panel.tab-panels.details.sub-section.user-profile.row-value',
		defaultMessage: 'Go to profile',
	},
});

interface UserProfileLinkProps {
	actor: AuditLogEventData['attributes']['actor'];
}

export const UserProfileLink = ({ actor }: UserProfileLinkProps) => (
	<Link href={actor?.links?.alt ?? ''} target="_blank">
		<FormattedMessage {...messages.userProfileValue} />
	</Link>
);
