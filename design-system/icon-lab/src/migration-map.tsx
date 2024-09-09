import type { UNSAFE_IconMigrationMap } from '@atlaskit/icon/types';

const migrationMap: UNSAFE_IconMigrationMap = {
	'bitbucket/builds': {
		newIcon: { name: 'roadmaps-plan', type: 'core', package: '@atlaskit/icon-lab' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/forks': {
		newIcon: { name: 'roadmaps-service', type: 'core', package: '@atlaskit/icon-lab' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
};

export default migrationMap;
