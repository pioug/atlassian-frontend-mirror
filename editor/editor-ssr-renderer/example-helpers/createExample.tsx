import React from 'react';

import { IntlProvider } from 'react-intl-next';
import type { DocNode } from '@atlaskit/adf-schema';

export function createExample(adf: DocNode) {
	return () => {
		return (
			<IntlProvider locale={'en'}>
				<pre>{JSON.stringify(adf, null, 2)}</pre>
			</IntlProvider>
		);
	};
}
