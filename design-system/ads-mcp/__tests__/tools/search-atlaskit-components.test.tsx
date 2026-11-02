import { loadAllComponents } from '../../src/tools/get-all-components/load-all-components';
import { atlaskitComponents } from '../../src/tools/get-atlaskit-components/atlaskit-components.codegen';
import { searchAtlaskitComponentsTool } from '../../src/tools/search-atlaskit-components/search-atlaskit-components-tool';

describe('panel-system Platform offerings discovery', () => {
	it('publishes panel-system through the fallback catalog without an ADS exception', () => {
		expect(
			loadAllComponents().some((component) => component.package === '@atlassian/panel-system'),
		).toBe(false);
		expect(atlaskitComponents).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: 'LayoutWithPanel', package: '@atlassian/panel-system' }),
			]),
		);
	});

	it('returns the internal-only restriction and complete resizing contract in fallback search', async () => {
		const result = await searchAtlaskitComponentsTool({ terms: ['LayoutWithPanel'] });
		const text = result.content[0].type === 'text' ? result.content[0].text : '[]';
		const components = JSON.parse(text);
		const layout = components.find(
			(component: { name: string }) => component.name === 'LayoutWithPanel',
		);
		expect(layout).toBeDefined();
		expect(layout.description).toContain('not available for use outside Atlassian');
		expect(layout.props).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'panelWidth',
					description: expect.stringContaining('onPanelWidthChange'),
				}),
			]),
		);
	});
});
