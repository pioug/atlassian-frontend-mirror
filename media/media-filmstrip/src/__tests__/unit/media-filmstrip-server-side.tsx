import React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { getExamplesFor } from '@atlaskit/ssr';

test.skip('media-filmstrip server side rendering', async () => {
	const examples = await getExamplesFor('media-filmstrip');
	for (const example of examples) {
		const Example = require(example.filePath).default;

		expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
	}
});
