import type { IconMigrationMap, IconMigrationSizeGuidance } from './types';

export const migrationOutcomeDescriptionMap: Record<IconMigrationSizeGuidance, string> = {
	swap: 'Swap icon',
	'swap-slight-visual-change':
		'Swap icon for an equivalent in the new set; there will be some slight visual change.',
	'swap-visual-change':
		'Swap icon for an equivalent in the new set; there will be a noticeable visual change.',
	'no-larger-size':
		'This icon should not be used with a larger size; please shift to a smaller size.',
	'not-recommended': 'No equivalent icon in new set. This icon is not recommended.',
	'product-icon':
		'Product icons are not supported; please use the custom SVG component from `@atlaskit/icon/svg`.',
	'icon-lab':
		'Find an alternative icon, or create an updated icon in the new style, and contribute it to `@atlaskit/icon-lab`.',
	'top-nav':
		'This icon is only for use for top navigation; please choose a different icon if used elsewhere.',
	'icon-tile': 'Switch to Icon Tile, use a smaller size or remove.',
	'16-icon-tile': "This icon can be re-created using an Icon tile with size='16'.",
	'24-icon-tile': "This icon can be re-created using an Icon tile with size='24'.",
	'32-icon-tile': "This icon can be re-created using an Icon tile with size='32'.",
	'48-icon-tile': "This icon can be re-created using an Icon tile with size='48'.",
};

const migrationMap: IconMigrationMap = {
	activity: {
		newIcon: {
			name: 'dashboard',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'add-circle': {
		newIcon: {
			name: 'add',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	add: {
		newIcon: { name: 'add', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'add-item': {
		newIcon: { name: 'shortcut', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	addon: {
		newIcon: { name: 'app', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-center': {
		newIcon: { name: 'align-text-center', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'align-center', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-left': {
		newIcon: { name: 'align-text-left', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'align-left', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-right': {
		newIcon: { name: 'align-text-right', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'align-right', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'app-access': {
		newIcon: { name: 'person-added', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'app-switcher': {
		newIcon: { name: 'app-switcher', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	archive: {
		newIcon: { name: 'archive-box', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-down-circle': {
		newIcon: {
			name: 'arrow-down',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-down': {
		newIcon: { name: 'arrow-down', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-left-circle': {
		newIcon: {
			name: 'arrow-left',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-left': {
		newIcon: { name: 'arrow-left', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-right-circle': {
		newIcon: {
			name: 'arrow-right',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-right': {
		newIcon: { name: 'arrow-right', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-up-circle': {
		newIcon: { name: 'arrow-up', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-up': {
		newIcon: { name: 'arrow-up', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	attachment: {
		newIcon: { name: 'attachment', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'audio-circle': {
		newIcon: { name: 'audio', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	audio: {
		newIcon: { name: 'audio', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/audio-only': {
		newIcon: {
			name: 'eye-open-filled',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	backlog: {
		newIcon: { name: 'backlog', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'billing-filled': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	billing: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/branches': {
		newIcon: { name: 'branch', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/builds': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/clone': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/commits': {
		newIcon: { name: 'commit', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/compare': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/forks': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/output': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/pipelines': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/pullrequests': {
		newIcon: { name: 'pull-request', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/repos': {
		newIcon: {
			name: 'angle-brackets',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'bitbucket/snippets': {
		newIcon: { name: 'snippet', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/source': {
		newIcon: {
			name: 'angle-brackets',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	board: {
		newIcon: { name: 'board', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	book: {
		newIcon: {
			name: 'book-with-bookmark',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bullet-list': {
		newIcon: { name: 'list-bulleted', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'calendar-filled': {
		newIcon: { name: 'calendar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	calendar: {
		newIcon: { name: 'calendar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'camera-filled': {
		newIcon: { name: 'camera', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	camera: {
		newIcon: { name: 'camera', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'camera-rotate': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'camera-take-picture': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	canvas: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	checkbox: {
		newIcon: {
			name: 'checkbox-checked',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'checkbox-indeterminate': {
		newIcon: {
			name: 'checkbox-indeterminate',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'check-circle': {
		newIcon: { name: 'success', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'check-circle', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'check-circle-outline': {
		newIcon: { name: 'check-circle', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	check: {
		newIcon: { name: 'check-mark', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/chevron-double-down': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'hipchat/chevron-double-up': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'chevron-down': {
		newIcon: {
			name: 'chevron-down',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-down', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-down-circle': {
		newIcon: {
			name: 'chevron-down',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-down', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'hipchat/chevron-down': {
		newIcon: {
			name: 'chevron-down',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-down', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-left-circle': {
		newIcon: {
			name: 'chevron-left',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-left', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-left': {
		newIcon: {
			name: 'chevron-left',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-left', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-left-large': {
		newIcon: {
			name: 'chevron-left',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-left', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-right-circle': {
		newIcon: {
			name: 'chevron-right',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-right', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-right': {
		newIcon: {
			name: 'chevron-right',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-right', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-right-large': {
		newIcon: {
			name: 'chevron-right',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-right', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-up-circle': {
		newIcon: {
			name: 'chevron-up',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-up', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'hipchat/chevron-up': {
		newIcon: {
			name: 'chevron-up',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-up', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-up': {
		newIcon: {
			name: 'chevron-up',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-up', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'child-issues': {
		newIcon: { name: 'child-work-items', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	code: {
		newIcon: {
			name: 'angle-brackets',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	comment: {
		newIcon: { name: 'comment', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	component: {
		newIcon: { name: 'component', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	copy: {
		newIcon: { name: 'copy', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'creditcard-filled': {
		newIcon: { name: 'credit-card', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	creditcard: {
		newIcon: { name: 'credit-card', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'cross-circle': {
		newIcon: { name: 'cross-circle', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	cross: {
		newIcon: { name: 'cross', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'close', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	dashboard: {
		newIcon: { name: 'dashboard', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	decision: {
		newIcon: { name: 'decision', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	department: {
		newIcon: { name: 'department', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'detail-view': {
		newIcon: {
			name: 'panel-right',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/dial-out': {
		newIcon: { name: 'on-call', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'phone', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'discover-filled': {
		newIcon: { name: 'compass', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	discover: {
		newIcon: { name: 'compass', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'document-filled': {
		newIcon: { name: 'file', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'page', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	document: {
		newIcon: { name: 'file', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'page', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	documents: {
		newIcon: { name: 'files', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'pages', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	download: {
		newIcon: { name: 'download', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'drag-handler': {
		newIcon: { name: 'drag-handle-vertical', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'drag-handle', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	dropbox: {
		sizeGuidance: {
			small: 'product-icon',
			medium: 'product-icon',
			large: 'product-icon',
			xlarge: 'product-icon',
		},
	},
	'edit-filled': {
		newIcon: { name: 'edit', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	edit: {
		newIcon: { name: 'edit', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/add': {
		newIcon: { name: 'add', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/addon': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/advanced': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/align-image-center': {
		newIcon: {
			name: 'align-image-center',
			type: 'core',
			package: '@atlaskit/icon',
		},
		additionalIcons: [{ name: 'content-align-center', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-image-left': {
		newIcon: {
			name: 'align-image-left',
			type: 'core',
			package: '@atlaskit/icon',
		},
		additionalIcons: [{ name: 'content-align-left', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-image-right': {
		newIcon: {
			name: 'align-image-right',
			type: 'core',
			package: '@atlaskit/icon',
		},
		additionalIcons: [{ name: 'content-align-right', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/attachment': {
		newIcon: { name: 'attachment', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/background-color': {
		newIcon: { name: 'paint-bucket', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/bold': {
		newIcon: { name: 'text-bold', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/bullet-list': {
		newIcon: { name: 'list-bulleted', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/close': {
		newIcon: { name: 'cross', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [
			{ name: 'cross', type: 'utility', package: '@atlaskit/icon' },
			{ name: 'close', type: 'core', package: '@atlaskit/icon' },
		],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/code': {
		newIcon: {
			name: 'angle-brackets',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/collapse': {
		newIcon: { name: 'shrink-horizontal', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/date': {
		newIcon: { name: 'calendar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/decision': {
		newIcon: { name: 'decision', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/divider': {
		newIcon: { name: 'minus', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/done': {
		newIcon: { name: 'check-mark', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'check-mark', type: 'utility', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/edit': {
		newIcon: { name: 'edit', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/emoji': {
		newIcon: { name: 'emoji', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/error': {
		newIcon: { name: 'cross-circle', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/expand': {
		newIcon: {
			name: 'grow-horizontal',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/feedback': {
		newIcon: { name: 'feedback', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/file': {
		newIcon: { name: 'file', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/file-preview': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/help': {
		newIcon: {
			name: 'question-circle',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/hint': {
		newIcon: { name: 'lightbulb', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/horizontal-rule': {
		newIcon: { name: 'minus', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/image-border': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/image': {
		newIcon: { name: 'image', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/image-resize': {
		newIcon: { name: 'maximize', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/indent': {
		newIcon: {
			name: 'text-indent-right',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/info': {
		newIcon: { name: 'information', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/italic': {
		newIcon: { name: 'text-italic', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/layout-single': {
		newIcon: {
			name: 'layout-one-column',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/layout-three-equal': {
		newIcon: {
			name: 'layout-three-columns',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/layout-three-with-sidebars': {
		newIcon: {
			name: 'layout-three-columns-sidebars',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/layout-two-equal': {
		newIcon: {
			name: 'layout-two-columns',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/layout-two-left-sidebar': {
		newIcon: {
			name: 'layout-two-columns-sidebar-left',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/layout-two-right-sidebar': {
		newIcon: {
			name: 'layout-two-columns-sidebar-right',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/link': {
		newIcon: { name: 'link', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/media-center': {
		newIcon: {
			name: 'content-width-narrow',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/media-full-width': {
		newIcon: {
			name: 'expand-horizontal',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/media-wide': {
		newIcon: {
			name: 'content-width-wide',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/media-wrap-left': {
		newIcon: { name: 'content-wrap-left', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/media-wrap-right': {
		newIcon: { name: 'content-wrap-right', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/mention': {
		newIcon: { name: 'mention', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/more': {
		newIcon: {
			name: 'show-more-horizontal',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/note': {
		newIcon: { name: 'discovery', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'page', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/number-list': {
		newIcon: { name: 'list-numbered', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/open': {
		newIcon: {
			name: 'arrow-up-right',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/outdent': {
		newIcon: {
			name: 'text-indent-left',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/panel': {
		newIcon: { name: 'information', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/photo': {
		newIcon: { name: 'camera', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/quote': {
		newIcon: {
			name: 'quotation-mark',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/recent': {
		newIcon: { name: 'clock', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/redo': {
		newIcon: { name: 'redo', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/remove-emoji': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/remove': {
		newIcon: { name: 'delete', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/search': {
		newIcon: { name: 'search', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/settings': {
		newIcon: { name: 'settings', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/strikethrough': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/success': {
		newIcon: { name: 'success', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/table-display-options': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/table': {
		newIcon: { name: 'grid', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/task': {
		newIcon: {
			name: 'checkbox-checked',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/text-color': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/text-style': {
		newIcon: { name: 'text-style', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/underline': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/undo': {
		newIcon: { name: 'undo', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/unlink': {
		newIcon: { name: 'link-broken', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/warning': {
		newIcon: { name: 'warning', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	email: {
		newIcon: { name: 'email', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/activity': {
		newIcon: { name: 'basketball', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji-add': {
		newIcon: { name: 'emoji-add', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/atlassian': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji/custom': {
		newIcon: { name: 'add', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/emoji': {
		newIcon: { name: 'emoji', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/flags': {
		newIcon: { name: 'flag', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/food': {
		newIcon: { name: 'takeout-food', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/frequent': {
		newIcon: { name: 'clock', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	emoji: {
		newIcon: { name: 'emoji', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/keyboard': {
		newIcon: { name: 'text-style', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/nature': {
		newIcon: { name: 'tree', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/objects': {
		newIcon: { name: 'lightbulb', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/people': {
		newIcon: { name: 'emoji', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/productivity': {
		newIcon: { name: 'check-circle', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/symbols': {
		newIcon: { name: 'heart', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/travel': {
		newIcon: { name: 'vehicle-car', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	error: {
		newIcon: { name: 'error', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	export: {
		newIcon: { name: 'upload', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	feedback: {
		newIcon: { name: 'feedback', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	file: {
		newIcon: { name: 'file', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	filter: {
		newIcon: { name: 'filter', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'flag-filled': {
		newIcon: { name: 'flag-filled', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'folder-filled': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	folder: {
		newIcon: { name: 'folder-closed', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	followers: {
		newIcon: {
			name: 'person-offboard',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	following: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	googledrive: {
		sizeGuidance: {
			small: 'product-icon',
			medium: 'product-icon',
			large: 'product-icon',
			xlarge: 'product-icon',
		},
	},
	'graph-bar': {
		newIcon: { name: 'chart-bar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'graph-line': {
		newIcon: { name: 'chart-trend', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	gsuite: {
		sizeGuidance: {
			small: 'product-icon',
			medium: 'product-icon',
			large: 'product-icon',
			xlarge: 'product-icon',
		},
	},
	highlights: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'home-circle': {
		newIcon: { name: 'home', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	home: {
		newIcon: { name: 'home', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'image-border': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	image: {
		newIcon: { name: 'image', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'image-resize': {
		newIcon: { name: 'maximize', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	info: {
		newIcon: { name: 'information', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	'invite-team': {
		newIcon: { name: 'person-add', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	issue: {
		newIcon: { name: 'work-item', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'issue-raise': {
		newIcon: { name: 'plus-square', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'swap',
			xlarge: 'swap',
		},
	},
	issues: {
		newIcon: { name: 'work-items', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/capture': {
		newIcon: { name: 'capture', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/failed-build-status': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'jira/labs': {
		newIcon: { name: 'flask', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/test-session': {
		newIcon: { name: 'bug', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	label: {
		newIcon: { name: 'tag', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'lightbulb-filled': {
		newIcon: { name: 'lightbulb', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	lightbulb: {
		newIcon: { name: 'lightbulb', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	like: {
		newIcon: { name: 'thumbs-up', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'link-filled': {
		newIcon: { name: 'link', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	link: {
		newIcon: { name: 'link', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	list: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'hipchat/lobby': {
		newIcon: { name: 'lobby-bell', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	location: {
		newIcon: { name: 'location', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'lock-circle': {
		newIcon: {
			name: 'lock-locked',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'lock-filled': {
		newIcon: { name: 'lock-locked', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	lock: {
		newIcon: { name: 'lock-locked', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	marketplace: {
		newIcon: { name: 'marketplace', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/media-attachment-count': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/actual-size': {
		newIcon: { name: 'grow-diagonal', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'maximize', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/add-comment': {
		newIcon: { name: 'comment-add', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/annotate': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/arrow': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/audio': {
		newIcon: { name: 'audio', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'media-services/blur': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/brush': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/button-option': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/code': {
		newIcon: {
			name: 'angle-brackets',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'media-services/document': {
		newIcon: { name: 'page', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/filter': {
		newIcon: { name: 'filter', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/fit-to-page': {
		newIcon: { name: 'shrink-diagonal', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'minimize', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/full-screen': {
		newIcon: {
			name: 'fullscreen-exit',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/grid': {
		newIcon: { name: 'grid', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/image': {
		newIcon: { name: 'image', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/line': {
		newIcon: { name: 'stroke-weight-small', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'border-weight-thin', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/line-thickness': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/no-image': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/open-mediaviewer': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/oval': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/pdf': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/preselected': {
		newIcon: { name: 'radio-unchecked', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/presentation': {
		newIcon: { name: 'chart-bar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'media-services/rectangle': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/scale-large': {
		newIcon: { name: 'image', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/scale-small': {
		newIcon: { name: 'image', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/spreadsheet': {
		newIcon: {
			name: 'spreadsheet',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/text': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/unknown': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/video': {
		newIcon: { name: 'video', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'media-services/zip': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/zoom-in': {
		newIcon: { name: 'zoom-in', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/zoom-out': {
		newIcon: { name: 'zoom-out', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	mention: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'menu-expand': {
		newIcon: { name: 'menu', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	menu: {
		newIcon: { name: 'menu', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	mobile: {
		newIcon: { name: 'device-mobile', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	more: {
		newIcon: {
			name: 'show-more-horizontal',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'more-vertical': {
		newIcon: {
			name: 'show-more-vertical',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'notification-all': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'notification-direct': {
		newIcon: { name: 'notification', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	notification: {
		newIcon: { name: 'notification', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'office-building-filled': {
		newIcon: {
			name: 'office-building',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'office-building': {
		newIcon: {
			name: 'office-building',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	open: {
		newIcon: {
			name: 'arrow-up-right',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/outgoing-sound': {
		newIcon: { name: 'volume-high', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	overview: {
		newIcon: { name: 'align-text-left', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'page-filled': {
		newIcon: { name: 'page', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	page: {
		newIcon: { name: 'page', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	pdf: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'people-group': {
		newIcon: { name: 'people-group', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	people: {
		newIcon: { name: 'people-group', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'person-circle': {
		newIcon: { name: 'person-avatar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	person: {
		newIcon: { name: 'person', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'person-with-circle': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'person-with-cross': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'person-with-tick': {
		newIcon: { name: 'person-added', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	portfolio: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	preferences: {
		newIcon: { name: 'customize', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	premium: {
		newIcon: { name: 'premium', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'presence-active': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'presence-busy': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'presence-unavailable': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'question-circle': {
		newIcon: {
			name: 'question-circle',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	question: {
		newIcon: {
			name: 'question-circle',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	questions: {
		newIcon: { name: 'comment', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	queues: {
		newIcon: { name: 'pages', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	quote: {
		newIcon: {
			name: 'quotation-mark',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	radio: {
		newIcon: { name: 'radio-checked', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	recent: {
		newIcon: { name: 'clock', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	redo: {
		newIcon: { name: 'redo', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	refresh: {
		newIcon: { name: 'refresh', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	retry: {
		newIcon: { name: 'retry', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	roadmap: {
		newIcon: { name: 'roadmap', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'room-menu': {
		newIcon: { name: 'panel-right', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'schedule-filled': {
		newIcon: { name: 'calendar-plus', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	schedule: {
		newIcon: { name: 'calendar-plus', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	screen: {
		newIcon: { name: 'screen', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/sd-video': {
		newIcon: { name: 'video', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	search: {
		newIcon: { name: 'search', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'select-clear': {
		newIcon: { name: 'cross-circle', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	send: {
		newIcon: { name: 'send', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	settings: {
		newIcon: { name: 'settings', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	share: {
		newIcon: { name: 'share', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	ship: {
		newIcon: { name: 'release', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	shortcut: {
		newIcon: { name: 'link-external', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'sign-in': {
		newIcon: { name: 'log-in', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'sign-out': {
		newIcon: { name: 'log-out', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	sprint: {
		newIcon: { name: 'sprint', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'star-filled': {
		newIcon: { name: 'star-starred', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	star: {
		newIcon: {
			name: 'star-unstarred',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'star-large': {
		newIcon: {
			name: 'star-unstarred',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	status: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	stopwatch: {
		newIcon: { name: 'stopwatch', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	subtask: {
		newIcon: { name: 'subtasks', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	suitcase: {
		newIcon: { name: 'briefcase', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	switcher: {
		newIcon: { name: 'boards', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'app-switcher', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	table: {
		newIcon: { name: 'grid', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	task: {
		newIcon: { name: 'task', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	teams: {
		newIcon: { name: 'teams', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	trash: {
		newIcon: { name: 'delete', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	tray: {
		newIcon: { name: 'inbox', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	undo: {
		newIcon: { name: 'undo', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	unlink: {
		newIcon: { name: 'link-broken', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'unlock-circle': {
		newIcon: {
			name: 'lock-locked',
			type: 'core',
			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
		},
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'unlock-filled': {
		newIcon: { name: 'lock-unlocked', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	unlock: {
		newIcon: { name: 'lock-unlocked', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	upload: {
		newIcon: {
			name: 'cloud-arrow-up',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'user-avatar-circle': {
		newIcon: { name: 'person-avatar', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-audio-muted': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-audio-on': {
		newIcon: { name: 'microphone', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-backward': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-camera-off': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-camera-on': {
		newIcon: { name: 'video', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-connection-circle': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'video-circle': {
		newIcon: { name: 'video', type: 'core', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'video-filled': {
		newIcon: { name: 'video', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-forward': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-full-screen-off': {
		newIcon: { name: 'shrink-diagonal', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'minimize', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-full-screen-on': {
		newIcon: {
			name: 'fullscreen-enter',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-hang-up': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-hd-circle': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-pause': {
		newIcon: { name: 'video-pause', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-play': {
		newIcon: { name: 'video-play', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-raised-hand': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-share-screen': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-speaking-circle': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'vid-volume-full': {
		newIcon: { name: 'volume-high', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-volume-half': {
		newIcon: { name: 'volume-low', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-volume-muted': {
		newIcon: { name: 'volume-muted', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	warning: {
		newIcon: { name: 'warning', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'watch-filled': {
		newIcon: {
			name: 'eye-open-filled',
			type: 'core',
			package: '@atlaskit/icon',
		},
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	watch: {
		newIcon: { name: 'eye-open', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	world: {
		newIcon: { name: 'globe', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'world-small': {
		newIcon: { name: 'globe', type: 'core', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
};

export default migrationMap;
