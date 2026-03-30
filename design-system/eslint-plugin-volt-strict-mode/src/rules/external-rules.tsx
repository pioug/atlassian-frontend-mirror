import type { LintRuleMeta } from '@atlaskit/eslint-utils/create-rule';

/**
 * External rules must be scoped, have a display name, and external urls.
 */
export type ExternalRuleMeta = LintRuleMeta & {
	isExternal: true;
	name: `@${string}/${string}`;
	displayName: string;
	docs: { externalUrl: `https://${string}` };
};

export const externalRules: ExternalRuleMeta[] = [];
