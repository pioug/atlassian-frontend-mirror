import React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import Example1 from '../../../examples/2-time-range';
import { Example as Example2 } from '../../../examples/exif-orientations-vr';
import Example3 from '../../../examples/get-image-orientation';
import Example4 from '../../../examples/media-image-lazy-loading';
import Example5 from '../../../examples/media-inline-cards';
import Example6 from '../../../examples/read-image-metadata';
import Example7 from '../../../examples/vr-media-inline-card-text-wrap';
import Example8 from '../../../examples/vr-media-inline-card';

test.skip('media-ui server side rendering', async () => {
	const examples = [Example1, Example2, Example3, Example4, Example5, Example6, Example7, Example8];

	for (const Example of examples) {
		expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
	}
});
