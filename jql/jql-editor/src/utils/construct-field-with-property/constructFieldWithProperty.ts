import { type Field } from '@atlaskit/jql-ast/field';

/**
 * Reconstructs the full field identity from an AST field node, including any entity property keys.
 *
 * Hydration keys fields by their full jqlTerm (e.g. `agentSessions[agent]`), but when a field is
 * written unquoted in the JQL the parser splits the entity property out of `field.value` (leaving
 * `agentSessions`) and into `field.properties` (`[agent]`). Comparing against `field.value` alone
 * would therefore miss these fields, so we rebuild `value[propertyKey]` to mirror how the field is
 * printed.
 *
 * Fields without properties simply return `field.value` unchanged, so all other fields (including
 * quoted collapsed fields like `Team[team]`, where the brackets remain part of `field.value`) are
 * unaffected.
 */
export const constructFieldWithProperty = (field: Field): string => {
	if (!field.properties || field.properties.length === 0) {
		return field.value;
	}

	const propertyKeys = field.properties
		.map((property) => (property.key ? `[${property.key.value}]` : ''))
		.join('');

	return `${field.value}${propertyKeys}`;
};
