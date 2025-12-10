import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<Renderer document={document} appearance="full-page" />
		</SmartCardProvider>
	);
}
