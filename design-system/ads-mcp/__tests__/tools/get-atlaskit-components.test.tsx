import { getAtlaskitComponentsTool } from '../../src/tools/get-atlaskit-components';
import { atlaskitComponents } from '../../src/tools/get-atlaskit-components/atlaskit-components.codegen';

describe('ads_get_atlaskit_components tool', () => {
	it('returns all components with only names and packages', async () => {
		const [result] = (await getAtlaskitComponentsTool()).content;
		expect(result.type).toEqual('text');

		const parsed = JSON.parse(result.text);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toEqual(atlaskitComponents.length);

		// Check the first component matches what we expect from the real codegen
		expect(parsed[0]).toEqual({
			name: atlaskitComponents[0].name,
			package: atlaskitComponents[0].package,
		});

		// Verify every item in the response only has name and package
		parsed.forEach((item: any) => {
			expect(Object.keys(item).sort()).toEqual(['name', 'package']);
		});
	});
});
