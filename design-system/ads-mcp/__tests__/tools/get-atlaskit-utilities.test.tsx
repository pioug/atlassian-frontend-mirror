import { atlaskitUtilities } from '../../src/tools/get-atlaskit-utilities/atlaskit-utilities.codegen';
import { getAtlaskitUtilitiesTool } from '../../src/tools/get-atlaskit-utilities/get-atlaskit-utilities-tool';

describe('ads_get_atlaskit_utilities tool', () => {
	it('returns all utilities with only names and packages', async () => {
		const [result] = (await getAtlaskitUtilitiesTool()).content;
		expect(result.type).toEqual('text');

		const parsed = JSON.parse(result.text);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toEqual(atlaskitUtilities.length);

		// Check the first utility matches what we expect from the real codegen
		expect(parsed[0]).toEqual({
			name: atlaskitUtilities[0].name,
			package: atlaskitUtilities[0].package,
		});

		// Verify every item in the response only has name and package
		parsed.forEach((item: any) => {
			expect(Object.keys(item).sort()).toEqual(['name', 'package']);
		});
	});
});
