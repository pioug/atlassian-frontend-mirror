import { type SnapshotTestOptions } from '@af/visual-regression';

export const snapshotOptions: SnapshotTestOptions<any> = {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		jira_ai_force_rovo_dev_avatar: true,
	},
};
