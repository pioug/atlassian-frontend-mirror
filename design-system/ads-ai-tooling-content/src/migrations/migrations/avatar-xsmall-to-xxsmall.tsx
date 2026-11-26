import type { MigrationGuide } from '../types';

export const avatarXsmallToXxsmall: MigrationGuide = {
	id: 'avatar-xsmall-to-xxsmall',
	title: 'Avatar xsmall to xxsmall migration',
	description: 'Use when code uses the 16px `xsmall` Avatar size from `@atlaskit/avatar`.',
	fromPackage: '@atlaskit/avatar',
	toPackage: '@atlaskit/avatar',
	examples: [
		{
			title: 'Rename 16px Avatar size',
			description: 'Use `xxsmall` for 16px avatars. `xsmall` is being reserved for 20px avatars.',
			before: `
import Avatar from '@atlaskit/avatar/avatar';

export const Example = () => <Avatar size="xsmall" name="Alex" />;
`,
			after: `
import Avatar from '@atlaskit/avatar/avatar';

export const Example = () => <Avatar size="xxsmall" name="Alex" />;
`,
			explanation:
				'The current 16px `xsmall` size is renamed to `xxsmall`. The temporary `UNSAFE_xsmall` value remains the 20px Avatar-only size until a future major makes `xsmall` the public 20px size.',
		},
	],
	bestPractices: [
		'Run the Avatar codemod before manually editing call sites.',
		'Check dynamic size values marked with `TODO: (from codemod)` because the codemod only updates static `xsmall` values.',
		'Do not migrate unrelated `xsmall` strings from heading, icon, spinner, or product-specific size APIs.',
		'AvatarGroup still does not support 16px or 20px sizes.',
	],
	additionalResources:
		'See https://atlassian.design/components/avatar/migration-guide for the full migration guide.',
};
