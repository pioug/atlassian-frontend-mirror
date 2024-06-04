import React, { useCallback, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';
import Textfield from '@atlaskit/textfield';
import { Label } from '@atlaskit/form';
import { CodeBlock } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';
import { Client, Provider } from '../src';
import RelatedLinksBaseModal from '../src/view/RelatedLinksModal/components/RelatedLinksBaseModal';
import RelatedLinksResolvedView from '../src/view/RelatedLinksModal/views/resolved';
import { useIncomingOutgoingAri } from '../src/state/hooks/use-incoming-outgoing-links';

export default () => {
	const [showModal, setShowModal] = useState(true);
	const [ari, setAri] = useState(
		'ari:cloud:confluence:DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:page/453393842267',
	);
	const [incomingOutGoingAris, setIncomingOutgoingAris] = useState<{
		incomingAris: string[];
		outgoingAris: string[];
	}>();
	const { getIncomingOutgoingAris } = useIncomingOutgoingAri('https://pug.jira-dev.com');
	const getAris = useCallback(async () => {
		const { incomingAris = [], outgoingAris = [] } = await getIncomingOutgoingAris(ari);
		setIncomingOutgoingAris({ incomingAris, outgoingAris });
	}, [ari, getIncomingOutgoingAris]);
	useEffect(() => {
		getAris();
	}, [getAris]);

	return (
		<Box padding="space.1000">
			<Label htmlFor="ari-textfield">paste a staging ari here</Label>
			<Textfield
				id="ari-textfield"
				label="Paste a staging ari here"
				value={ari}
				onChange={({ target }) => setAri((target as HTMLInputElement).value)}
			/>
			<Heading size="small">Incoming</Heading>
			<CodeBlock
				text={JSON.stringify(incomingOutGoingAris?.incomingAris, null, 2)}
				language="json"
			/>
			<Heading size="small">Outgoing</Heading>
			<CodeBlock
				text={JSON.stringify(incomingOutGoingAris?.outgoingAris, null, 2)}
				language="json"
			/>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<div style={{ padding: token('space.250', '20px') }}>
				<IntlProvider locale={'en'}>
					<Provider client={new Client('stg')}>
						<Button
							testId="related-links-modal-show"
							appearance="primary"
							onClick={() => setShowModal(true)}
						>
							Open
						</Button>
						<RelatedLinksBaseModal
							onClose={() => {
								setShowModal(false);
							}}
							showModal={showModal}
						>
							<RelatedLinksResolvedView
								incomingLinks={[
									'https://www.youtube.com/watch?v=jmvngQzy_3M',
									'https://pug.jira-dev.com/wiki/spaces/~986526081/pages/452399595559/This+is+an+example+of+a+page+with+an+emoji',
									'https://pug.jira-dev.com/wiki/spaces/~986526081/pages/452399595559/This+is+an+example+of+a+page+with+an+emoji',
									'https://www.youtube.com/watch?v=uhHyh55n5l0',
									'https://pug.jira-dev.com/wiki/spaces/~986526081',
								]}
								outgoingLinks={[]}
							/>
						</RelatedLinksBaseModal>
					</Provider>
				</IntlProvider>
			</div>
		</Box>
	);
};
