import { createSpacingStylesFromTemplate } from '../spacing-codegen-template';

describe('@atlaskit/eslint-plugin-design-system', () => {
	// spacing
	test('spacing styles are generated correctly', () => {
		expect(createSpacingStylesFromTemplate()).toMatchSnapshot();
	});
});
