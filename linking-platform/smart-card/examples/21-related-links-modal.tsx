import React, { useCallback, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import Textfield from '@atlaskit/textfield';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import { Client, Provider } from '../src';
import RelatedLinksModal from '../src/view/RelatedLinksModal';
import { SmartLinkModalProvider, useSmartLinkModal } from '../src/state/modal';

const client = new Client('stg');
const ExampleModal = () => {
	const modal = useSmartLinkModal();

	const [ari, setAri] = useState(
		'ari:cloud:confluence:DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:page/453393842267',
	);

	const onClick = useCallback(() => {
		modal.open(
			<RelatedLinksModal
				ari={ari}
				onClose={() => modal.close()}
				showModal={true}
				baseUriWithNoTrailingSlash="https://pug.jira-dev.com"
			/>,
		);
	}, [ari, modal]);

	return (
		<Box padding="space.1000">
			<Label htmlFor="ari-textfield">paste a staging ari here</Label>
			<Textfield
				id="ari-textfield"
				label="Paste a staging ari here"
				value={ari}
				onChange={({ target }) => setAri((target as HTMLInputElement).value)}
			/>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<div style={{ padding: token('space.250', '20px') }}></div>
			<Button testId="related-links-modal-show" appearance="primary" onClick={onClick}>
				Open
			</Button>
		</Box>
	);
};

export default () => (
	<IntlProvider locale={'en'}>
		<Provider client={client}>
			<SmartLinkModalProvider>
				<ExampleModal />;
			</SmartLinkModalProvider>
		</Provider>
	</IntlProvider>
);
