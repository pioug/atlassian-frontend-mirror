import React from 'react';

import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';
import type { DocNode } from '@atlaskit/adf-schema/schema';

export default function Example(): React.JSX.Element {
	return (
		<SmartCardProvider client={new CardClient('stg')}>
			<Renderer
				document={document as DocNode}
				appearance="full-page"
				eventHandlers={{
					smartCard: {
						onClick: (e, url) => {
							window.open(url, '_blank');
						},
					},
				}}
			/>
		</SmartCardProvider>
	);
}
