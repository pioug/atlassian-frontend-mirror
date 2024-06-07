import { type AstNode } from './common';

/**
 * An argument value used in functions or entity properties.
 */
export interface Argument extends AstNode {
	/**
	 * Literal value of the argument (with quotes and escaping preserved).
	 */
	text: string;
	/**
	 * Semantic value of the argument (without quotes or escaping derived from those quotes).
	 */
	value: string;
}
