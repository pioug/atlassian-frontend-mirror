import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { MediaClient } from '../..';

import Example1 from '../../../examples/1-get-file';
import Example2 from '../../../examples/1-uploader';
import Example3 from '../../../examples/2-get-items';
import Example4 from '../../../examples/2-image-metadata';
import Example5 from '../../../examples/2-upload-file';
import Example6 from '../../../examples/3-upload-touch';
import Example7 from '../../../examples/4-items-batching';

class Example extends React.Component {
	constructor(props: any) {
		super(props);
		const mediaClient = new MediaClient({
			authProvider: () =>
				Promise.resolve({
					clientId: '',
					token: '',
					baseUrl: '',
				}),
		});

		mediaClient.file.getFileState('1');
	}

	render() {
		return <div />;
	}
}

// @ts-ignore
test.skip('media-client server side rendering of project examples', async () => {
	const examples = [Example1, Example2, Example3, Example4, Example5, Example6, Example7];

	for (const EachExample of examples) {
		// @ts-ignore
		expect(() => ReactDOMServer.renderToString(<EachExample />)).not.toThrowError();
	}
});

// @ts-ignore
test.skip('media-client server side rendering of simple component', () => {
	// @ts-ignore
	expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
});
