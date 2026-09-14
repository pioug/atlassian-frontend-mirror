import { locatePackage } from '../locate-package';

describe('locatePackage', () => {
	it('returns null when the package is missing from the index', () => {
		expect(locatePackage('@atlaskit/missing', new Map())).toBeNull();
	});
});
