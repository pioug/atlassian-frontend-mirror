import type { IconMigrationMap } from '@atlaskit/icon/types';

const migrationMap: IconMigrationMap = {
	'bitbucket/builds': {
		newIcon: { name: 'roadmaps-plan', package: '@atlaskit/icon-lab' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/forks': {
		newIcon: { name: 'roadmaps-service', package: '@atlaskit/icon-lab' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
};

export default migrationMap;
