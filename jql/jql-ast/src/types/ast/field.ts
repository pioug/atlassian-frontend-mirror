import { type Argument } from './argument';
import { type AstNode } from './common';

/**
 * A field used in a JQL query.
 */
export interface Field extends AstNode {
	/**
	 * Literal field name (with quotes and escaping preserved).
	 */
	text: string;
	/**
	 * Semantic field name (without quotes or escaping derived from those quotes).
	 */
	value: string;
	/**
	 * When the field refers to a value in an entity property, details of the entity property value.
	 */
	properties: Property[] | void;
}

/**
 * Details of an entity property.
 */
export interface Property extends AstNode {
	/**
	 * The key of the property.
	 */
	key: Argument | void;
	/**
	 * The path in the property value to query.
	 */
	path: Argument[] | void;
}
