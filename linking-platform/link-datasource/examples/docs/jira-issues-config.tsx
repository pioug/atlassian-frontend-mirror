import React, { useRef, useState } from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import JiraIssuesConfigModal, {
	JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource/jira-issues-modal';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

export default function JiraIssuesConfigExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [hasSavedConfiguration, setHasSavedConfiguration] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider>
				<Button ref={triggerRef} aria-expanded={isOpen} onClick={() => setIsOpen(true)}>
					Configure Jira issues
				</Button>
				{/* Host integration: replace the placeholder cloud ID with one available to this user. */}
				{isOpen ? (
					<JiraIssuesConfigModal
						datasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}
						parameters={{
							cloudId: 'replace-with-an-accessible-cloud-id',
							jql: 'project = DEMO ORDER BY created DESC',
						}}
						shouldReturnFocus={triggerRef}
						onCancel={() => setIsOpen(false)}
						onInsert={(configuration) => {
							setIsOpen(false);
							setHasSavedConfiguration(true);
							// Replace this local state update with persistence in the host editor or product.
						}}
					/>
				) : null}
				{hasSavedConfiguration ? (
					<p role="status">
						Configuration captured in this example. Persist it in the host editor.
					</p>
				) : null}
			</SmartCardProvider>
		</IntlProvider>
	);
}
