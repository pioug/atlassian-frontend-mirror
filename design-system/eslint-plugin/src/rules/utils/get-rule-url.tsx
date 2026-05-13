import { getPathSafeName } from '@atlaskit/eslint-utils/create-rule';

export function getRuleUrl(ruleName: string) {
	const name = getPathSafeName(ruleName);
	return `https://atlassian.design/components/eslint-plugin-design-system/${name}/usage`;
}
