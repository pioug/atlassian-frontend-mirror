import { UserType } from './types';
import type { MentionDescription } from './types';

export function isAgentMention(mention: MentionDescription): boolean {
	// Like `isAgentTypeAheadItem` in `editor-plugin-mentions/src/ui/type-ahead/index.tsx`
	// and `isAgentUserType` in `editor-plugin-mentions/src/pm-plugins/agent.ts`
	return (
		mention.userType === UserType[UserType.APP] ||
		mention.userType === 'AGENT' ||
		mention.appType === 'agent'
	);
}
