import type { ADFNode } from '../adfNode';
import type { TransformerNames } from '../transforms/transformerNames';

export type ADFNodeGroup = {
	group: string;
	groupType: 'node';
	isIgnored: (transformerName: TransformerNames) => boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	members: Array<ADFNode<any>>;
};
