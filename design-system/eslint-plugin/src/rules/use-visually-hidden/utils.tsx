// eslint-disable-next-line import/no-extraneous-dependencies
import type { SourceCode } from 'eslint';
import { isNodeOfType, type ObjectExpression, type Property } from 'eslint-codemod-utils';

// eslint-disable-next-line @atlaskit/design-system/use-visually-hidden
const referenceObject = {
	width: '1px',
	height: '1px',
	padding: '0',
	position: 'absolute',
	border: '0',
	clip: 'rect(1px, 1px, 1px, 1px)',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
};

type KeyValue = {
	key: string;
	value: string;
};

export type ReferenceObject = typeof referenceObject;

/**
 * Returns the first import in the esprima AST.
 */
export const getFirstImport = (source: SourceCode) => {
	return source.ast.body.find((node) => node.type === 'ImportDeclaration');
};

/**
 * Takes a template literal and returns [key, value] array of the css properties
 */
export const makeTemplateLiteralIntoEntries = (templateString: string) => {
	return templateString
		.replace(/\n/g, '')
		.split(/;|{|}/)
		.filter((el) => !el.match(/\@/))
		.map((el) =>
			el
				.trim()
				.split(':')
				.map((e) => e.trim()),
		);
};

/**
 * Given a node, translate the node into css key-value pairs and
 * compare the output to the reference styles required to make a
 * visually hidden element.
 *
 * @returns {number} A fraction between 0-1 depending on the object's likeness.
 */
export const getObjectLikeness = (node: ObjectExpression) => {
	const styleEntries = node.properties
		.filter((node): node is Property => isNodeOfType(node, 'Property'))
		.map(({ key, value }) => {
			if (key.type === 'Identifier') {
				return {
					key: key.name,
					value: value.type === 'Literal' && value.value,
				};
			}

			return null;
		})
		.filter((node): node is KeyValue => Boolean(node));

	return countMatchingKeyValues(styleEntries);
};

export const countMatchingKeyValues = (styleEntries: KeyValue[]) => {
	const matchingStyleEntries = styleEntries.filter(
		(entry: any): entry is Partial<ReferenceObject> => {
			return entry.key in referenceObject;
		},
	);

	if (styleEntries.length < 5) {
		return 0;
	}

	return (
		matchingStyleEntries.reduce(
			(acc, curr) =>
				acc + (referenceObject[curr?.key as keyof ReferenceObject] === curr?.value ? 1.5 : 0.75),
			0,
		) / styleEntries.length
	);
};
