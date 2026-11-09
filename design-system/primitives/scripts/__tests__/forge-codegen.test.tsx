import { createColorStylesFromTemplate } from '../color-codegen-template';

jest.mock('@atlaskit/tokens/atlassian-light', () => ({
	__esModule: true,
	default: ['active', 'deprecated', 'experimental'].map((state) => ({
		name: `color.text.${state}`,
		value: '#000000',
		attributes: { state },
	})),
}));

test('excludes experimental tokens only when requested by Forge', () => {
	const internalStyles = createColorStylesFromTemplate('text');
	const forgeStyles = createColorStylesFromTemplate('text', { excludeExperimental: true });

	expect(internalStyles).toContain("'color.text.experimental'");
	expect(forgeStyles).not.toContain("'color.text.experimental'");
	expect(forgeStyles).toContain("'color.text.active'");
	expect(forgeStyles).toContain("'color.text.deprecated'");
});
