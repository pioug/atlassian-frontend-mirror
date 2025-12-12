import type { ADFMark } from './adfMark';
import type { ADFMarkGroup } from './types/ADFMarkGroup';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adfMarkGroup(group: string, members: Array<ADFMark<any>> = []): ADFMarkGroup {
	if (group.includes(' ')) {
		throw new Error('Group name cannot contain spaces');
	}
	for (const member of members) {
		if (!member.getGroup()) {
			member.setGroup(group);
		}
	}
	return { group, groupType: 'mark', members: members };
}
