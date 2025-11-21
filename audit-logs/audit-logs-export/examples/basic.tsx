import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { AuditLogExportButton } from '../src';

export default function Basic(): React.JSX.Element {
	const handleExport = async (params: {
		action?: string;
		actor?: string;
		from?: string;
		ip?: string;
		location?: string;
		orgId: string;
		product?: string;
		q?: string;
		to?: string;
	}) => {
		console.log('Export parameters:', params);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		alert('Export completed! Check console for parameters.');
	};

	return (
		<IntlProvider locale="en" messages={{}}>
			<AuditLogExportButton
				onExport={handleExport}
				orgId="example-org-123"
				search="?from=2023-01-01&to=2023-12-31&action=login"
				testId="audit-log-export-button"
			/>
		</IntlProvider>
	);
}
