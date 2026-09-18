import React from 'react';

import type { DocNode } from '@atlaskit/adf-schema/doc';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card-embed.adf.json';

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<Renderer
				document={document as DocNode}
				appearance="full-page"
				smartLinks={{
					frameStyle: 'hide',
				}}
			/>
		</SmartCardProvider>
	);
}
