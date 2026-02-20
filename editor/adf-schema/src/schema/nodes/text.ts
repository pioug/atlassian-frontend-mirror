import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { text as textFactory } from '../../next-schema/generated/nodeTypes';

/**
 * @name text_node
 */
export interface TextDefinition {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: Array<any>;
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @minLength 1
	 */
	text: string;
	type: 'text';
}

export const text: NodeSpec = textFactory({
	toDebugString:
		process.env.NODE_ENV !== 'production' ? undefined : () => 'text_node',
});
