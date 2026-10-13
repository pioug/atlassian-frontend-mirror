import React, { useRef, useState } from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import AssetsConfigModal, {
	ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource/assets-modal';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

export default function AssetsConfigExample(): React.JSX.Element {
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
					Configure Assets objects
				</Button>
				{/* Host integration: replace placeholders with IDs available to this user. */}
				{isOpen ? (
					<AssetsConfigModal
						datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
						parameters={{
							workspaceId: 'replace-with-an-accessible-workspace-id',
							schemaId: 'replace-with-an-accessible-schema-id',
							aql: 'objectType = "Application"',
						}}
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
