import React from 'react';

import { EmbeddedDocument, DocumentBody } from '../src';
import MockServiceProvider from './helpers/mock-provider';
import { Container } from './helpers/styles';

export default function Example(): React.JSX.Element {
	const mockProvider = new MockServiceProvider();
	return (
		<Container>
			<EmbeddedDocument
				provider={mockProvider}
				objectId="ari:cloud:demo::document/1"
				documentId="demo-doc"
			>
				<DocumentBody />
			</EmbeddedDocument>
		</Container>
	);
}
