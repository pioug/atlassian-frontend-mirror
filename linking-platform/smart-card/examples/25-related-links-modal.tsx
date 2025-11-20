import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { Stack } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';

import { SmartLinkModalProvider, useSmartLinkModal } from '../src/state/modal';
import RelatedLinksModal from '../src/view/RelatedLinksModal';

import ExampleContainer from './utils/example-container';
import InternalMessage from './utils/internal-message';

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
		<Stack space="space.200">
			<InternalMessage />
			<Label htmlFor="ari-textfield">paste a staging ari here</Label>
			<Textfield
				id="ari-textfield"
				label="Paste a staging ari here"
				value={ari}
				onChange={({ target }) => setAri((target as HTMLInputElement).value)}
			/>
			<Button testId="related-links-modal-show" appearance="primary" onClick={onClick}>
				Open
			</Button>
		</Stack>
	);
};

export default (): React.JSX.Element => (
	<ExampleContainer title="RelatedLinksModal">
		<Provider client={client}>
			<SmartLinkModalProvider>
				<ExampleModal />;
			</SmartLinkModalProvider>
		</Provider>
	</ExampleContainer>
);
