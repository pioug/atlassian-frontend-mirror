import transformer from '../upgrade-pragmatic-drag-and-drop-to-stable';

import { check } from './_framework';

describe('transform imports', () => {
	check({
		transformer,
		it: 'should transform safe imports',
		original: "import {draggable} from '@atlaskit/pragmatic-drag-and-drop/adapter/element';",
		expected: "import {draggable} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';",
	});
});
