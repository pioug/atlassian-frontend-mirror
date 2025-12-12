import * as original from 'prosemirror-commands';

import * as wrapper from '../commands';

describe('prosemirror-commands', () => {
	it('should export the same public functions', () => {
		const originalPublicFunctions = Object.keys(original)
			.filter((f) => !f.startsWith('__'))
			// Removed as this is automatically added for cjs interop
			// See more info here: https://www.typescriptlang.org/docs/handbook/modules/appendices/esm-cjs-interop.html
			.filter((f) => f !== 'default')
			.sort();
		const wrapperFunctions = Object.keys(wrapper).sort();

		expect(wrapperFunctions).toEqual(originalPublicFunctions);
	});
});
