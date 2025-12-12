import { text as textFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name text_node
 */
export interface TextDefinition {
	type: 'text';
	/**
	 * @minLength 1
	 */
	text: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
}

export const text = textFactory({
	toDebugString: process.env.NODE_ENV !== 'production' ? undefined : () => 'text_node',
});
