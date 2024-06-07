import { filterActionableDeprecations } from '../filter-actionable-deprecations';

import mockedDeprecatedAPIsConfig from './__fixtures__/mocked-deprecated-apis.json';
import mockedPackgeJson from './__fixtures__/mocked-package.json';

describe('Empty state', () => {
	const expectedResults = {
		cssFn: [
			{
				moduleSpecifier: '@atlaskit/menu',
				actionableVersion: '1.2.6',
			},
		],
		overrides: [
			{
				moduleSpecifier: '@atlaskit/menu',
				actionableVersion: '1.2.8',
			},
			{
				moduleSpecifier: '@atlaskit/side-navigation',
			},
		],
	};
	it('should render primary action when primaryAction prop is not empty', () => {
		const result = filterActionableDeprecations(
			JSON.stringify(mockedDeprecatedAPIsConfig),
			JSON.stringify(mockedPackgeJson),
		);
		expect(result).toEqual(JSON.stringify(expectedResults));
	});
});
