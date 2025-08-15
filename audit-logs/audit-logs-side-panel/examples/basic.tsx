import React from 'react';

import type { AuditLogEventData } from '../src/common/types';
import { AuditLogsSidePanel } from '../src/ui/audit-logs-side-panel';

const exampleEvent: AuditLogEventData = {
	id: '7a12e4bd-c3e5-4aed-8945-b97438c01283',
	type: 'events',
	attributes: {
		action: 'service_account_created',
		actor: {
			id: '70121:bca886e4-bec8-46f8-80cf-1ec5b201eeb4',
			name: 'David Kucsai',
			email: 'dkucsai@atlassian.com',
			picture: 'https://example.com/avatar.jpg',
			links: {
				alt: 'https://example.com/profile',
				self: 'https://example.com/api/user/123',
			},
		},
		location: {
			ip: '104.30.160.152',
			city: 'Sydney',
		},
		time: '2024-01-15T10:30:00Z',
	},
	message: 'Created sadsdsadasd-mbriqxr43c@serviceaccount.atlassian.com',
};

export default function Basic() {
	return <AuditLogsSidePanel event={exampleEvent} />;
}
