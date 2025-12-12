import type { ADFNode } from './adfNode';
import type { TransformerNames } from './transforms/transformerNames';
import type { ADFNodeGroup } from './types/ADFNodeGroup';

export function adfNodeGroup(
	group: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	members: Array<ADFNode<any, any>> = [],
	spec?: {
		ignore: Array<TransformerNames>;
	},
): ADFNodeGroup {
	if (group.includes(' ')) {
		throw new Error('Group name cannot contain spaces');
	}
	for (const member of members) {
		member.setGroup(group);
	}
	return {
		group,
		groupType: 'node',
		members,
		isIgnored: (transformerName: TransformerNames) => {
			return spec?.ignore?.includes(transformerName) || false;
		},
	};
}
