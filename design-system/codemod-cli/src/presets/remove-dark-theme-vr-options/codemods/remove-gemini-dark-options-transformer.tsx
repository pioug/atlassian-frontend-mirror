import { getImportDeclaration } from '@hypermod/utils';
import { type API, type FileInfo } from 'jscodeshift';

const PRINT_SETTINGS = {
	quote: 'single' as const,
};

function transformer(file: FileInfo, api: API) {
	const j = api.jscodeshift;
	const source = j(file.source);

	// check if import from @af/visual-regression
	const imports = getImportDeclaration(j, source, '@af/visual-regression');

	if (!imports.length) {
		return file.source;
	}

	// find ObjectProperty that has a "environment" property
	// and then a "colorScheme" property inside the "environment" property
	// and value is "dark" inside the "colorScheme" property
	source
		.find(j.ObjectExpression)
		.filter((path) => {
			const environmentProperty = path.node.properties.find(
				(prop) =>
					prop.type === 'ObjectProperty' &&
					prop.key.type === 'Identifier' &&
					prop.key.name === 'environment',
			);
			if (!environmentProperty) {
				return false;
			}
			const colorSchemeProperty =
				environmentProperty.type === 'ObjectProperty' &&
				environmentProperty.value.type === 'ObjectExpression' &&
				environmentProperty.value.properties.find(
					(path) =>
						path.type === 'ObjectProperty' &&
						path.key.type === 'Identifier' &&
						path.key.name === 'colorScheme',
				);
			if (!colorSchemeProperty) {
				return false;
			}
			return (
				colorSchemeProperty.type === 'ObjectProperty' &&
				colorSchemeProperty.value.type === 'StringLiteral' &&
				colorSchemeProperty.value.value === 'dark'
			);
		})
		.remove();

	return source.toSource(PRINT_SETTINGS);
}

export default transformer;
