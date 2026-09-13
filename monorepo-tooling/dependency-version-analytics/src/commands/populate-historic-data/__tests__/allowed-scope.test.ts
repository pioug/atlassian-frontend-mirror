import { getSupportedScopes, isPackageFromSupportedScopes } from '../util/allowed-scopes';

describe('allowed-scope', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should get supported scopes', () => {
		let scopes = getSupportedScopes(true);
		expect(scopes.length).toBe(3);

		scopes = getSupportedScopes(false);
		expect(scopes.length).toBe(1);

		scopes = getSupportedScopes();
		expect(scopes.length).toBe(1);
	});

	it('should analyse package for scope', () => {
		expect(isPackageFromSupportedScopes('@atlaskit/foo')).toBe(true);
		expect(isPackageFromSupportedScopes('@atlassian/foo')).toBe(true);
		expect(isPackageFromSupportedScopes('@atlassiansox/foo')).toBe(true);
		expect(isPackageFromSupportedScopes('@test/foo')).toBe(false);
		expect(isPackageFromSupportedScopes('@test/@atlaskit')).toBe(false);
	});
});
