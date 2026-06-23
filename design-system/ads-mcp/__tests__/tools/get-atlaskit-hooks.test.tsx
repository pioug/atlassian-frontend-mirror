import { atlaskitHooks } from '../../src/tools/get-atlaskit-hooks/atlaskit-hooks.codegen';
import { getAtlaskitHooksTool } from '../../src/tools/get-atlaskit-hooks/get-atlaskit-hooks-tool';

describe('ads_get_atlaskit_hooks tool', () => {
	it('returns all hooks with only names and packages', async () => {
		const [result] = (await getAtlaskitHooksTool()).content;
		expect(result.type).toEqual('text');

		const parsed = JSON.parse(result.text);
		expect(Array.isArray(parsed)).toBe(true);
		expect(parsed.length).toEqual(atlaskitHooks.length);

		// Check the first hook matches what we expect from the real codegen
		expect(parsed[0]).toEqual({
			name: atlaskitHooks[0].name,
			package: atlaskitHooks[0].package,
		});

		// Verify every item in the response only has name and package
		parsed.forEach((item: any) => {
			expect(Object.keys(item).sort()).toEqual(['name', 'package']);
		});
	});
});
