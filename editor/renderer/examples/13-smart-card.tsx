import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import CardClient from '@atlaskit/link-provider/client';
import type { DocNode } from '@atlaskit/adf-schema/doc';

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<Renderer document={document as DocNode} appearance="full-page" />
		</SmartCardProvider>
	);
}
