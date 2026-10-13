import React, { useRef, useState } from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import ConfluenceSearchConfigModal, {
	CONFLUENCE_SEARCH_DATASOURCE_ID,
} from '@atlaskit/link-datasource/confluence-search-modal';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

export default function ConfluenceSearchConfigExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [hasSavedConfiguration, setHasSavedConfiguration] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const closeModal = () => {
		setIsOpen(false);
		// This modal does not forward shouldReturnFocus; the host restores focus after it closes.
		window.requestAnimationFrame(() => triggerRef.current?.focus());
	};

	return (
		<IntlProvider locale="en">
			<SmartCardProvider>
				<Button ref={triggerRef} aria-expanded={isOpen} onClick={() => setIsOpen(true)}>
					Configure Confluence search
				</Button>
				{/* Host integration: replace the placeholder cloud ID with one available to this user. */}
				{isOpen ? (
					<ConfluenceSearchConfigModal
						datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
						parameters={{ cloudId: 'replace-with-an-accessible-cloud-id', searchString: 'roadmap' }}
						onCancel={closeModal}
						onInsert={(configuration) => {
							closeModal();
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
