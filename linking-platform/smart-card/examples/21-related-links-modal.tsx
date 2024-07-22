import React, { useCallback, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import Textfield from '@atlaskit/textfield';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import { Client, Provider } from '../src';
import RelatedLinksModal from '../src/view/RelatedLinksModal';

const client = new Client('stg');
export default () => {
	const [showModal, setShowModal] = useState(true);
	const [ari, setAri] = useState(
		'ari:cloud:confluence:DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:page/453393842267',
	);
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
			<div style={{ padding: token('space.250', '20px') }}>
				<IntlProvider locale={'en'}>
					<Provider client={client}>
						<Button
							testId="related-links-modal-show"
							appearance="primary"
							onClick={useCallback(() => setShowModal(true), [])}
						>
							Open
						</Button>
						<RelatedLinksModal
							ari={ari}
							onClose={useCallback(() => setShowModal(false), [])}
							showModal={showModal}
							baseUriWithNoTrailingSlash="https://pug.jira-dev.com"
						/>
					</Provider>
				</IntlProvider>
			</div>
		</Box>
	);
};
