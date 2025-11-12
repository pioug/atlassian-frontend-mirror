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
		newIcon: { name: 'add', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'add-item': {
		newIcon: { name: 'shortcut', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	addon: {
		newIcon: { name: 'app', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-center': {
		newIcon: { name: 'align-text-center', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'align-center', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-left': {
		newIcon: { name: 'align-text-left', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'align-left', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-right': {
		newIcon: { name: 'align-text-right', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'align-right', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'app-access': {
		newIcon: { name: 'person-added', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'app-switcher': {
		newIcon: { name: 'app-switcher', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	archive: {
		newIcon: { name: 'archive-box', package: '@atlaskit/icon' },
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
		newIcon: { name: 'arrow-down', package: '@atlaskit/icon' },
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
		newIcon: { name: 'arrow-left', package: '@atlaskit/icon' },
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
		newIcon: { name: 'arrow-right', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-up-circle': {
		newIcon: { name: 'arrow-up', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-up': {
		newIcon: { name: 'arrow-up', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	attachment: {
		newIcon: { name: 'attachment', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'audio-circle': {
		newIcon: { name: 'audio', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	audio: {
		newIcon: { name: 'audio', package: '@atlaskit/icon' },
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
		newIcon: { name: 'backlog', package: '@atlaskit/icon' },
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
		newIcon: { name: 'branch', package: '@atlaskit/icon' },
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
		newIcon: { name: 'commit', package: '@atlaskit/icon' },
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
		newIcon: { name: 'pull-request', package: '@atlaskit/icon' },
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
		newIcon: { name: 'snippet', package: '@atlaskit/icon' },
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
		newIcon: { name: 'board', package: '@atlaskit/icon' },
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
		newIcon: { name: 'list-bulleted', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'calendar-filled': {
		newIcon: { name: 'calendar', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	calendar: {
		newIcon: { name: 'calendar', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'camera-filled': {
		newIcon: { name: 'camera', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	camera: {
		newIcon: { name: 'camera', package: '@atlaskit/icon' },
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
		newIcon: { name: 'status-success', package: '@atlaskit/icon' },
		additionalIcons: [
			{ name: 'check-circle', package: '@atlaskit/icon' },
			{ name: 'success', package: '@atlaskit/icon' },
		],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'check-circle-outline': {
		newIcon: { name: 'check-circle', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	check: {
		newIcon: { name: 'check-mark', package: '@atlaskit/icon' },
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-down', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-down', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-down', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-left', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-left', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-left', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-right', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-right', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-right', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-up', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-up', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
			isMigrationUnsafe: true,
			shouldForceSmallIcon: true,
		},
		additionalIcons: [{ name: 'chevron-up', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'child-issues': {
		newIcon: { name: 'child-work-items', package: '@atlaskit/icon' },
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
		newIcon: { name: 'comment', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	component: {
		newIcon: { name: 'component', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	copy: {
		newIcon: { name: 'copy', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'creditcard-filled': {
		newIcon: { name: 'credit-card', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	creditcard: {
		newIcon: { name: 'credit-card', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'cross-circle': {
		newIcon: { name: 'cross-circle', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	cross: {
		newIcon: { name: 'cross', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'close', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	dashboard: {
		newIcon: { name: 'dashboard', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	decision: {
		newIcon: { name: 'decision', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	department: {
		newIcon: { name: 'department', package: '@atlaskit/icon' },
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
		newIcon: { name: 'on-call', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'phone', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'discover-filled': {
		newIcon: { name: 'compass', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	discover: {
		newIcon: { name: 'compass', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'document-filled': {
		newIcon: { name: 'file', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'page', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	document: {
		newIcon: { name: 'file', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'page', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	documents: {
		newIcon: { name: 'files', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'pages', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	download: {
		newIcon: { name: 'download', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'drag-handler': {
		newIcon: { name: 'drag-handle-vertical', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'drag-handle', package: '@atlaskit/icon' }],
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
		newIcon: { name: 'edit', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	edit: {
		newIcon: { name: 'edit', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/add': {
		newIcon: { name: 'add', package: '@atlaskit/icon' },
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

			package: '@atlaskit/icon',
		},
		additionalIcons: [{ name: 'content-align-center', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
		},
		additionalIcons: [{ name: 'content-align-left', package: '@atlaskit/icon' }],
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

			package: '@atlaskit/icon',
		},
		additionalIcons: [{ name: 'content-align-right', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/attachment': {
		newIcon: { name: 'attachment', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/background-color': {
		newIcon: { name: 'paint-bucket', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/bold': {
		newIcon: { name: 'text-bold', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/bullet-list': {
		newIcon: { name: 'list-bulleted', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/close': {
		newIcon: { name: 'cross', package: '@atlaskit/icon' },
		additionalIcons: [
			{ name: 'cross', package: '@atlaskit/icon' },
			{ name: 'close', package: '@atlaskit/icon' },
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
		newIcon: { name: 'shrink-horizontal', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/date': {
		newIcon: { name: 'calendar', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/decision': {
		newIcon: { name: 'decision', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/divider': {
		newIcon: { name: 'minus', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/done': {
		newIcon: { name: 'check-mark', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'check-mark', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/edit': {
		newIcon: { name: 'edit', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/emoji': {
		newIcon: { name: 'emoji', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/error': {
		newIcon: { name: 'cross-circle', package: '@atlaskit/icon' },
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
		newIcon: { name: 'feedback', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/file': {
		newIcon: { name: 'file', package: '@atlaskit/icon' },
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
		newIcon: { name: 'lightbulb', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/horizontal-rule': {
		newIcon: { name: 'minus', package: '@atlaskit/icon' },
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
		newIcon: { name: 'image', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/image-resize': {
		newIcon: { name: 'maximize', package: '@atlaskit/icon' },
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
		newIcon: { name: 'status-information', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'information', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/italic': {
		newIcon: { name: 'text-italic', package: '@atlaskit/icon' },
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
		newIcon: { name: 'link', package: '@atlaskit/icon' },
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
		newIcon: { name: 'content-wrap-left', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/media-wrap-right': {
		newIcon: { name: 'content-wrap-right', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/mention': {
		newIcon: { name: 'mention', package: '@atlaskit/icon' },
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
		newIcon: { name: 'discovery', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'page', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/number-list': {
		newIcon: { name: 'list-numbered', package: '@atlaskit/icon' },
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
		newIcon: { name: 'status-information', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'information', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/photo': {
		newIcon: { name: 'camera', package: '@atlaskit/icon' },
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
		newIcon: { name: 'clock', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/redo': {
		newIcon: { name: 'redo', package: '@atlaskit/icon' },
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
		newIcon: { name: 'delete', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/search': {
		newIcon: { name: 'search', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/settings': {
		newIcon: { name: 'settings', package: '@atlaskit/icon' },
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
		newIcon: { name: 'status-success', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'success', package: '@atlaskit/icon' }],
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
		newIcon: { name: 'grid', package: '@atlaskit/icon' },
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
		newIcon: { name: 'text-style', package: '@atlaskit/icon' },
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
		newIcon: { name: 'undo', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/unlink': {
		newIcon: { name: 'link-broken', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/warning': {
		newIcon: { name: 'status-warning', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'warning', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	email: {
		newIcon: { name: 'email', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/activity': {
		newIcon: { name: 'basketball', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji-add': {
		newIcon: { name: 'emoji-add', package: '@atlaskit/icon' },
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
		newIcon: { name: 'add', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/emoji': {
		newIcon: { name: 'emoji', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/flags': {
		newIcon: { name: 'flag', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/food': {
		newIcon: { name: 'takeout-food', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/frequent': {
		newIcon: { name: 'clock', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	emoji: {
		newIcon: { name: 'emoji', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/keyboard': {
		newIcon: { name: 'text-style', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/nature': {
		newIcon: { name: 'tree', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/objects': {
		newIcon: { name: 'lightbulb', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/people': {
		newIcon: { name: 'emoji', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/productivity': {
		newIcon: { name: 'check-circle', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/symbols': {
		newIcon: { name: 'heart', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/travel': {
		newIcon: { name: 'vehicle-car', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	error: {
		newIcon: { name: 'status-error', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'error', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	export: {
		newIcon: { name: 'upload', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	feedback: {
		newIcon: { name: 'feedback', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	file: {
		newIcon: { name: 'file', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	filter: {
		newIcon: { name: 'filter', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'flag-filled': {
		newIcon: { name: 'flag-filled', package: '@atlaskit/icon' },
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
		newIcon: { name: 'folder-closed', package: '@atlaskit/icon' },
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
		newIcon: { name: 'chart-bar', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'graph-line': {
		newIcon: { name: 'chart-trend', package: '@atlaskit/icon' },
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
		newIcon: { name: 'home', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	home: {
		newIcon: { name: 'home', package: '@atlaskit/icon' },
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
		newIcon: { name: 'image', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'image-resize': {
		newIcon: { name: 'maximize', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	info: {
		newIcon: { name: 'status-information', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'information', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	'invite-team': {
		newIcon: { name: 'person-add', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	issue: {
		newIcon: { name: 'work-item', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'issue-raise': {
		newIcon: { name: 'plus-square', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'swap',
			xlarge: 'swap',
		},
	},
	issues: {
		newIcon: { name: 'work-items', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/capture': {
		newIcon: { name: 'capture', package: '@atlaskit/icon' },
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
		newIcon: { name: 'flask', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/test-session': {
		newIcon: { name: 'bug', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	label: {
		newIcon: { name: 'tag', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'lightbulb-filled': {
		newIcon: { name: 'lightbulb', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	lightbulb: {
		newIcon: { name: 'lightbulb', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	like: {
		newIcon: { name: 'thumbs-up', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'link-filled': {
		newIcon: { name: 'link', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	link: {
		newIcon: { name: 'link', package: '@atlaskit/icon' },
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
		newIcon: { name: 'lobby-bell', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	location: {
		newIcon: { name: 'location', package: '@atlaskit/icon' },
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
		newIcon: { name: 'lock-locked', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	lock: {
		newIcon: { name: 'lock-locked', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	marketplace: {
		newIcon: { name: 'marketplace', package: '@atlaskit/icon' },
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
		newIcon: { name: 'grow-diagonal', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'maximize', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/add-comment': {
		newIcon: { name: 'comment-add', package: '@atlaskit/icon' },
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
		newIcon: { name: 'audio', package: '@atlaskit/icon', isMigrationUnsafe: true },
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
		newIcon: { name: 'page', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/filter': {
		newIcon: { name: 'filter', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/fit-to-page': {
		newIcon: { name: 'shrink-diagonal', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'minimize', package: '@atlaskit/icon' }],
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
		newIcon: { name: 'grid', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/image': {
		newIcon: { name: 'image', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/line': {
		newIcon: { name: 'stroke-weight-small', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'border-weight-thin', package: '@atlaskit/icon' }],
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
		newIcon: { name: 'radio-unchecked', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/presentation': {
		newIcon: { name: 'chart-bar', package: '@atlaskit/icon' },
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
		newIcon: { name: 'image', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/scale-small': {
		newIcon: { name: 'image', package: '@atlaskit/icon' },
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
		newIcon: { name: 'video', package: '@atlaskit/icon', isMigrationUnsafe: true },
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
		newIcon: { name: 'zoom-in', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/zoom-out': {
		newIcon: { name: 'zoom-out', package: '@atlaskit/icon' },
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
		newIcon: { name: 'menu', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	menu: {
		newIcon: { name: 'menu', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	mobile: {
		newIcon: { name: 'device-mobile', package: '@atlaskit/icon' },
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
		newIcon: { name: 'notification', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	notification: {
		newIcon: { name: 'notification', package: '@atlaskit/icon' },
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
		newIcon: { name: 'volume-high', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	overview: {
		newIcon: { name: 'align-text-left', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'page-filled': {
		newIcon: { name: 'page', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	page: {
		newIcon: { name: 'page', package: '@atlaskit/icon' },
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
		newIcon: { name: 'people-group', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	people: {
		newIcon: { name: 'people-group', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'person-circle': {
		newIcon: { name: 'person-avatar', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	person: {
		newIcon: { name: 'person', package: '@atlaskit/icon' },
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
		newIcon: { name: 'person-added', package: '@atlaskit/icon' },
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
		newIcon: { name: 'customize', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	premium: {
		newIcon: { name: 'premium', package: '@atlaskit/icon' },
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
		newIcon: { name: 'comment', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	queues: {
		newIcon: { name: 'pages', package: '@atlaskit/icon' },
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
		newIcon: { name: 'radio-checked', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	recent: {
		newIcon: { name: 'clock', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	redo: {
		newIcon: { name: 'redo', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	refresh: {
		newIcon: { name: 'refresh', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	retry: {
		newIcon: { name: 'retry', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	roadmap: {
		newIcon: { name: 'roadmap', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'room-menu': {
		newIcon: { name: 'panel-right', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'schedule-filled': {
		newIcon: { name: 'calendar-plus', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	schedule: {
		newIcon: { name: 'calendar-plus', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	screen: {
		newIcon: { name: 'screen', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/sd-video': {
		newIcon: { name: 'video', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	search: {
		newIcon: { name: 'search', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'select-clear': {
		newIcon: { name: 'cross-circle', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	send: {
		newIcon: { name: 'send', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	settings: {
		newIcon: { name: 'settings', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	share: {
		newIcon: { name: 'share', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	ship: {
		newIcon: { name: 'release', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	shortcut: {
		newIcon: { name: 'link-external', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'sign-in': {
		newIcon: { name: 'log-in', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'sign-out': {
		newIcon: { name: 'log-out', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	sprint: {
		newIcon: { name: 'sprint', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'star-filled': {
		newIcon: { name: 'star-starred', package: '@atlaskit/icon' },
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
		newIcon: { name: 'stopwatch', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	subtask: {
		newIcon: { name: 'subtasks', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	suitcase: {
		newIcon: { name: 'briefcase', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	switcher: {
		newIcon: { name: 'boards', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'app-switcher', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	table: {
		newIcon: { name: 'grid', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	task: {
		newIcon: { name: 'task', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	teams: {
		newIcon: { name: 'teams', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	trash: {
		newIcon: { name: 'delete', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	tray: {
		newIcon: { name: 'inbox', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	undo: {
		newIcon: { name: 'undo', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	unlink: {
		newIcon: { name: 'link-broken', package: '@atlaskit/icon' },
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
		newIcon: { name: 'lock-unlocked', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	unlock: {
		newIcon: { name: 'lock-unlocked', package: '@atlaskit/icon' },
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
		newIcon: { name: 'person-avatar', package: '@atlaskit/icon' },
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
		newIcon: { name: 'microphone', package: '@atlaskit/icon' },
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
		newIcon: { name: 'video', package: '@atlaskit/icon' },
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
		newIcon: { name: 'video', package: '@atlaskit/icon', isMigrationUnsafe: true },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'video-filled': {
		newIcon: { name: 'video', package: '@atlaskit/icon' },
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
		newIcon: { name: 'shrink-diagonal', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'minimize', package: '@atlaskit/icon' }],
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
		newIcon: { name: 'video-pause', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-play': {
		newIcon: { name: 'video-play', package: '@atlaskit/icon' },
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
		newIcon: { name: 'volume-high', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-volume-half': {
		newIcon: { name: 'volume-low', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-volume-muted': {
		newIcon: { name: 'volume-muted', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	warning: {
		newIcon: { name: 'status-warning', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'warning', package: '@atlaskit/icon' }],
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
		newIcon: { name: 'eye-open', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	world: {
		newIcon: { name: 'globe', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'world-small': {
		newIcon: { name: 'globe', package: '@atlaskit/icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
};

export default migrationMap;
