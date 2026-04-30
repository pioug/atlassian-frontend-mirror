import { type ReactNode } from 'react';

export type NodeBaseProps = {
	iconBefore: ReactNode;
	isLocked?: boolean;
	// isRichNodeDisplay is temporary flag, remove when projects_in_jira_ga_drop is fully rolled out
	isRichNodeDisplay?: boolean;
	text?: string;
};
