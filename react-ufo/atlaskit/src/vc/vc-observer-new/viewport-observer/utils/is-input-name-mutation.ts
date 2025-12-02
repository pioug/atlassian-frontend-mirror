import { fg } from '@atlaskit/platform-feature-flags';

// Detecting this is required due to a React/Chromium bug, where React itself triggers an attribute mutation for input elements
// Reference: https://atlassian.slack.com/archives/C08EK6TCUP6/p1764129900970719
export function isInputNameMutation({
	target,
	attributeName,
	oldValue,
	newValue,
}: {
	target?: Node | null;
	attributeName?: string | null;
	oldValue?: string | undefined | null;
	newValue?: string | undefined | null;
}): boolean {
	if (!fg('platform_ufo_ttvc_v4_exclude_input_name_mutation')) {
		return false;
	}

	return (
		target instanceof HTMLInputElement &&
		attributeName === 'name' &&
		(oldValue === '' || newValue === '')
	);
}
