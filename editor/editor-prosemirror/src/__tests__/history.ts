import * as original from 'prosemirror-history';

import * as wrapper from '../history';

const internalFunctions = [
	// see: https://github.com/ProseMirror/prosemirror-history/blob/7fe1b25f8efd4285e8c04e28f8381608d6fd3def/src/history.js#L251
	'HistoryState',
	'default',
];
describe('prosemirror-history', () => {
	it('should export the same public functions', () => {
		const originalPublicFunctions = Object.keys(original)
			.filter((f) => !f.startsWith('__'))
			.filter((f) => !internalFunctions.includes(f))
			.sort();
		const wrapperFunctions = Object.keys(wrapper).sort();

		expect(wrapperFunctions).toEqual(originalPublicFunctions);
	});
});
