import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import type { DocNode } from '@atlaskit/adf-schema/schema';

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<Renderer document={document as DocNode} appearance="full-page" />
		</SmartCardProvider>
	);
}
