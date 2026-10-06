import { getGuidelinesTool } from '../../src/tools/get-guidelines/get-guidelines-tool';

describe('ads_get_guidelines generated color content', () => {
	it.each(['selected state colors', 'hovered and pressed states'])(
		'retrieves the published color guidance for %s',
		async (term) => {
			const result = await getGuidelinesTool({ terms: [term] });
			const guidance = result.content[0].text;

			expect(guidance).toContain('Keep selected and focused states distinct');
			expect(guidance).toContain('Layer hovered and pressed states onto the current state');
			expect(guidance).toContain('`color.border.selected`');
			expect(guidance).toContain('`color.border.focused`');
		},
	);
});
