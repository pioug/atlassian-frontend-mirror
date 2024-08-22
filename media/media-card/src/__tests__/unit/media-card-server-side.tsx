import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import waitForExpect from 'wait-for-expect';

import Example1 from '../../../examples/00-file-card-flow';
import Example2 from '../../../examples/01-inline-video-card';
import Example3 from '../../../examples/02-media-viewer-integration';
import Example4 from '../../../examples/03-media-inline-card';
import Example5 from '../../../examples/04-card-editable';
import Example6 from '../../../examples/05-card-files';
import Example7 from '../../../examples/06-card-filestates';
import Example8 from '../../../examples/07-card-lazy-load';
import Example9 from '../../../examples/08-card-light';
import Example10 from '../../../examples/09-card-media-type-matrix';
import Example11 from '../../../examples/10-card-resizing-modes';
import Example12 from '../../../examples/11-card-view-editableCard';
import Example13 from '../../../examples/12-card-view-icons';
import Example14 from '../../../examples/13-card-view-matrix';
import Example15 from '../../../examples/14-orientation-example';
import Example16 from '../../../examples/15-i18n';
import Example17 from '../../../examples/16-inline-card-filestates';
import Example18 from '../../../examples/17-card-v2';
import Example19 from '../../../examples/18-card-v2-SSR-hydration';
import Example20 from '../../../examples/19-card-v2-SSR-cases';
import Example21 from '../../../examples/20-svg-load';
import Example22 from '../../../examples/21-svg-responsive';
import Example23 from '../../../examples/Test-Integration-card-files-mocked';
import Example24 from '../../../examples/Test-Integration-media-pollinator';
import Example25 from '../../../examples/Test-Integration-surrounding-elements';
import Example26 from '../../../examples/Test-VR-card-view';
import Example27 from '../../../examples/Test-VR-inline-player';
import Example28 from '../../../examples/Test-VR-inline-video-card';
import Example29 from '../../../examples/Test-VR-media-inline';
import Example30 from '../../../examples/Test-VR-SSR-cases';
import Example31 from '../../../examples/Test-VR-SSR-hydration';
import Example32 from '../../../examples/unhandled-error-card';

test('media-card server side rendering', async () => {
	const examples = [
		Example1,
		Example2,
		Example3,
		Example4,
		Example5,
		Example6,
		Example7,
		Example8,
		Example9,
		Example10,
		Example11,
		Example12,
		Example13,
		Example14,
		Example15,
		Example16,
		Example17,
		Example18,
		Example19,
		Example20,
		Example21,
		Example22,
		Example23,
		Example24,
		Example25,
		Example26,
		Example27,
		Example28,
		Example29,
		Example30,
		Example31,
		Example32,
	];

	for (const Example of examples) {
		await waitForExpect(() => {
			expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
		});
	}
});
