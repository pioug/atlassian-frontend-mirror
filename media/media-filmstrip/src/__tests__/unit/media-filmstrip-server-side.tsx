import React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import Example1 from '../../../examples/0-editable';
import Example2 from '../../../examples/0-smart-filmstrip';
import Example3 from '../../../examples/3-pure-component';

test.skip('media-filmstrip server side rendering', async () => {
	const examples = [Example1, Example2, Example3];

	for (const Example of examples) {
		expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
	}
});
