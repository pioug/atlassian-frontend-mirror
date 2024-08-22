import { ssr } from '@atlaskit/ssr';
import Loadable from 'react-loadable';

Loadable.preloadAll();

import Example1 from '../../../../examples/00-simple-emoji';
import Example2 from '../../../../examples/01-skin-tone-emoji-by-shortcut';
import Example3 from '../../../../examples/02-content-resourced-emoji';
import Example4 from '../../../../examples/03-standard-emoji-typeahead';
import Example5 from '../../../../examples/04-inline-emoji-typeahead-with-usage';
import Example6 from '../../../../examples/05-standard-emoji-picker-with-upload';
import Example7 from '../../../../examples/06-emoji-picker-with-usage';
import Example8 from '../../../../examples/07-resourced-emoji-real-emoji-resource';
import Example9 from '../../../../examples/08-big-resourced-emoji-real-emoji-resource';
import Example10 from '../../../../examples/09-picker-with-real-emoji-resource';
import Example11 from '../../../../examples/10-typeahead-with-real-emoji-resource';
import Example12 from '../../../../examples/11-emoji-preview-with-description';
import Example13 from '../../../../examples/12-emoji-preview-with-long-name-description';
import Example14 from '../../../../examples/13-emoji-typeahead-list';
import Example15 from '../../../../examples/14-emoji-picker-list';
import Example16 from '../../../../examples/15-category-selector';
import Example17 from '../../../../examples/16-tone-selector';
import Example18 from '../../../../examples/17-emoji-upload-preview';
import Example19 from '../../../../examples/18-emoji-upload-preview-error';
import Example20 from '../../../../examples/19-emoji-uploader-with-upload';
import Example21 from '../../../../examples/20-emoji-ssr-hydration';
import Example22 from '../../../../examples/21-emoji-ufo-with-real-resource';
import Example23 from '../../../../examples/22-resourced-emoji-real-resource-backend';
import Example24 from '../../../../examples/23-optimistic-emoji';
import Example25 from '../../../../examples/23-sprite-emoji';
import Example26 from '../../../../examples/24-emoji-placeholder';
import Example27 from '../../../../examples/24-flicking-issue-demo';
import Example28 from '../../../../examples/25-emoji-picker-sizes';
import Example29 from '../../../../examples/26-emoji-common-provider-with-real-backend';
import Example30 from '../../../../examples/27-emoji-picker-in-form';

describe('ssr for emoji', () => {
	it('should not throw when rendering any example on the server', async () => {
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
		];

		const results = await Promise.allSettled(examples.map((file: any) => ssr(file)));

		expect(results.every((result) => result.status === 'fulfilled')).toBeTruthy();
	});
});
