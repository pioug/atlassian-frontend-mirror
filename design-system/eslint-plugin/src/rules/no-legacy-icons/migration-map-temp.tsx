export const outcomeDescriptionMap: { [key: string]: string } = {
	swap: 'Swap icon',
	'swap-slight-visual-change':
		'Swap icon for an equivalent in the new set; there will be some slight visual change.',
	'swap-visual-change':
		'Swap icon for an equivalent in the new set; there will be a noticeable visual change.',
	'swap-size-shift-utility': 'Swap icon for a 12px utility icon; expect some size shift.',
	'no-larger-size':
		'This icon should not be used with a larger size; please shift to a smaller size.',
	'not-recommended': 'No equivalent icon in new set. This icon is not recommended.',
	'product-icon':
		'Product icons are not supported; please use the custom SVG component from `@atlaskit/icon/svg`.',
	'icon-lab':
		'Find an alternative icon, or create an updated icon in the new style, and contribute it to `@atlassian/icon-lab`.',
	'top-nav':
		'This icon is only for use for top navigation; please choose a different icon if used elsewhere.',
	'icon-tile': 'Switch to Icon Tile, use a smaller size or remove.',
	'16-icon-tile': "This icon can be re-created using an Icon tile with size='16'.",
	'24-icon-tile': "This icon can be re-created using an Icon tile with size='24'.",
	'32-icon-tile': "This icon can be re-created using an Icon tile with size='32'.",
	'48-icon-tile': "This icon can be re-created using an Icon tile with size='48'.",
};

export const sizes = ['small', 'medium', 'large', 'xlarge'] as const;
export type Size = (typeof sizes)[number];

export const isSize = (size: any): size is Size => sizes.includes(size as Size);

const migrationMap: {
	[lib: string]: {
		sizeGuidance: { small: string; medium: string; large: string; xlarge: string };
		newIcon?: { name: string; type: string; library: string };
	};
} = {
	activity: {
		newIcon: { name: 'dashboard', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'add-circle': {
		newIcon: { name: 'add', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	add: {
		newIcon: { name: 'add', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'add-item': {
		newIcon: { name: 'shortcut', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	addon: {
		newIcon: { name: 'app', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-center': {
		newIcon: { name: 'align-center', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-left': {
		newIcon: { name: 'align-left', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/align-right': {
		newIcon: { name: 'align-right', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'app-access': {
		newIcon: { name: 'person-added', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'app-switcher': {
		newIcon: { name: 'app-switcher', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'top-nav',
			medium: 'top-nav',
			large: 'top-nav',
			xlarge: 'top-nav',
		},
	},
	archive: {
		newIcon: { name: 'archive-box', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-down-circle': {
		newIcon: { name: 'arrow-down', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-down': {
		newIcon: { name: 'arrow-down', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-left-circle': {
		newIcon: { name: 'arrow-left', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-left': {
		newIcon: { name: 'arrow-left', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-right-circle': {
		newIcon: { name: 'arrow-right', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-right': {
		newIcon: { name: 'arrow-right', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'arrow-up-circle': {
		newIcon: { name: 'arrow-up', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'arrow-up': {
		newIcon: { name: 'arrow-up', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	attachment: {
		newIcon: { name: 'attachment', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'audio-circle': {
		newIcon: { name: 'audio', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	audio: {
		newIcon: { name: 'audio', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/audio-only': {
		newIcon: { name: 'eye-open-filled', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	backlog: {
		newIcon: { name: 'backlog', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'branch', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/builds': {
		newIcon: { name: 'roadmaps-code', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
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
		newIcon: { name: 'commit', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'pull-request', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/repos': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'bitbucket/snippets': {
		newIcon: { name: 'snippet', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bitbucket/source': {
		newIcon: { name: 'angle-brackets', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	board: {
		newIcon: { name: 'board', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	book: {
		newIcon: { name: 'book-with-bookmark', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'bullet-list': {
		newIcon: { name: 'bulleted-list', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'calendar-filled': {
		newIcon: { name: 'calendar', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	calendar: {
		newIcon: { name: 'calendar', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'camera-filled': {
		newIcon: { name: 'camera', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	camera: {
		newIcon: { name: 'camera', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'checkbox-checked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'checkbox-indeterminate': {
		newIcon: { name: 'checkbox-indeterminate', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'check-circle': {
		newIcon: { name: 'check-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'check-circle-outline': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	check: {
		newIcon: { name: 'check-mark', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'chevron-down', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-down-circle': {
		newIcon: { name: 'chevron-down', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'hipchat/chevron-down': {
		newIcon: { name: 'chevron-down', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-left-circle': {
		newIcon: { name: 'chevron-left', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-left': {
		newIcon: { name: 'chevron-left', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-left-large': {
		newIcon: { name: 'chevron-left', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-right-circle': {
		newIcon: { name: 'chevron-right', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-right': {
		newIcon: { name: 'chevron-right', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-right-large': {
		newIcon: { name: 'chevron-right', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-up-circle': {
		newIcon: { name: 'chevron-up', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'hipchat/chevron-up': {
		newIcon: { name: 'chevron-up', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'chevron-up': {
		newIcon: { name: 'chevron-up', type: 'utility', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'no-larger-size',
			xlarge: 'no-larger-size',
		},
	},
	'child-issues': {
		newIcon: { name: 'child-issues', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	code: {
		newIcon: { name: 'angle-brackets', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	comment: {
		newIcon: { name: 'comment', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	component: {
		newIcon: { name: 'component', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	copy: {
		newIcon: { name: 'copy', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'creditcard-filled': {
		newIcon: { name: 'credit-card', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	creditcard: {
		newIcon: { name: 'credit-card', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'cross-circle': {
		newIcon: { name: 'cross-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	cross: {
		newIcon: { name: 'close', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	dashboard: {
		newIcon: { name: 'dashboard', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	decision: {
		newIcon: { name: 'decision', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	department: {
		newIcon: { name: 'department', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'detail-view': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'hipchat/dial-out': {
		newIcon: { name: 'phone', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'discover-filled': {
		newIcon: { name: 'compass', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	discover: {
		newIcon: { name: 'compass', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'document-filled': {
		newIcon: { name: 'page', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	document: {
		newIcon: { name: 'page', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	documents: {
		newIcon: { name: 'pages', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	download: {
		newIcon: { name: 'cloud-arrow-down', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'drag-handler': {
		newIcon: { name: 'drag-handle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'edit', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	edit: {
		newIcon: { name: 'edit', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/add': {
		newIcon: { name: 'edit', type: 'core', library: 'icon' },
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
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/align-image-left': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/align-image-right': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/attachment': {
		newIcon: { name: 'attachment', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/background-color': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/bold': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/bullet-list': {
		newIcon: { name: 'bulleted-list', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/close': {
		newIcon: { name: 'close', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/code': {
		newIcon: { name: 'angle-brackets', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/collapse': {
		newIcon: { name: 'collapse', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/date': {
		newIcon: { name: 'calendar', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/decision': {
		newIcon: { name: 'decision', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/divider': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/done': {
		newIcon: { name: 'check-mark', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/edit': {
		newIcon: { name: 'edit', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/emoji': {
		newIcon: { name: 'emoji', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/error': {
		newIcon: { name: 'cross-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/expand': {
		newIcon: { name: 'expand', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/feedback': {
		newIcon: { name: 'feedback', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/file': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
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
		newIcon: { name: 'question-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/hint': {
		newIcon: { name: 'lightbulb', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/horizontal-rule': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
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
		newIcon: { name: 'image', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/image-resize': {
		newIcon: { name: 'expand', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/indent': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/info': {
		newIcon: { name: 'information', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/italic': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/layout-single': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/layout-three-equal': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/layout-three-with-sidebars': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/layout-two-equal': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/layout-two-left-sidebar': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/layout-two-right-sidebar': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/link': {
		newIcon: { name: 'link', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/media-center': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/media-full-width': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/media-wide': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/media-wrap-left': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/media-wrap-right': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/mention': {
		newIcon: { name: 'mention', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/more': {
		newIcon: { name: 'show-more-horizontal', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/note': {
		newIcon: { name: 'page', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/number-list': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/open': {
		newIcon: { name: 'arrow-up-right', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/outdent': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/panel': {
		newIcon: { name: 'information', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/photo': {
		newIcon: { name: 'camera', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/quote': {
		newIcon: { name: 'quotation-mark', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/recent': {
		newIcon: { name: 'clock', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/redo': {
		newIcon: { name: 'redo', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'delete', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/search': {
		newIcon: { name: 'search', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/settings': {
		newIcon: { name: 'settings', type: 'core', library: 'icon' },
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
		newIcon: { name: 'check-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'editor/task': {
		newIcon: { name: 'checkbox-checked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'text-style', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'undo', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/unlink': {
		newIcon: { name: 'link-broken', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'editor/warning': {
		newIcon: { name: 'warning', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	email: {
		newIcon: { name: 'email', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/activity': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji-add': {
		newIcon: { name: 'emoji-add', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'add', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/emoji': {
		newIcon: { name: 'emoji', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/flags': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji/food': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji/frequent': {
		newIcon: { name: 'clock', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	emoji: {
		newIcon: { name: 'emoji', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/keyboard': {
		newIcon: { name: 'text-style', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/nature': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji/objects': {
		newIcon: { name: 'lightbulb', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/people': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji/productivity': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'emoji/symbols': {
		newIcon: { name: 'heart', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'emoji/travel': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	error: {
		newIcon: { name: 'error', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	export: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	feedback: {
		newIcon: { name: 'feedback', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	file: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	filter: {
		newIcon: { name: 'filter', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'flag-filled': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
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
		newIcon: { name: 'folder-closed', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	followers: {
		newIcon: { name: 'person-offboard', type: 'core', library: 'icon' },
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
		newIcon: { name: 'chart-bar', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'graph-line': {
		newIcon: { name: 'chart-trend', type: 'core', library: 'icon' },
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
		newIcon: { name: 'home', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	home: {
		newIcon: { name: 'home', type: 'core', library: 'icon' },
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
		newIcon: { name: 'image', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'image-resize': {
		newIcon: { name: 'expand', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	info: {
		newIcon: { name: 'information', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	'invite-team': {
		newIcon: { name: 'person-add', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	issue: {
		newIcon: { name: 'issue', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'issue-raise': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	issues: {
		newIcon: { name: 'issues', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/capture': {
		newIcon: { name: 'capture', type: 'core', library: 'icon' },
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
		newIcon: { name: 'flask', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'jira/test-session': {
		newIcon: { name: 'bug', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	label: {
		newIcon: { name: 'tag', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'lightbulb-filled': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	lightbulb: {
		newIcon: { name: 'lightbulb', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	like: {
		newIcon: { name: 'thumbs-up', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'link-filled': {
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	link: {
		newIcon: { name: 'link', type: 'core', library: 'icon' },
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
		newIcon: { name: 'lobby-bell', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	location: {
		newIcon: { name: 'location', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'lock-circle': {
		newIcon: { name: 'lock-locked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'lock-filled': {
		newIcon: { name: 'lock-locked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	lock: {
		newIcon: { name: 'lock-locked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	marketplace: {
		newIcon: { name: 'marketplace', type: 'core', library: 'icon' },
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
		newIcon: { name: 'maximize', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/add-comment': {
		newIcon: { name: 'comment-add', type: 'core', library: 'icon' },
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
		newIcon: { name: 'audio', type: 'core', library: 'icon' },
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
		newIcon: { name: 'angle-brackets', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'media-services/document': {
		newIcon: { name: 'page', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/filter': {
		newIcon: { name: 'filter', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/fit-to-page': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/full-screen': {
		newIcon: { name: 'fullscreen-exit', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/grid': {
		newIcon: { name: 'grid', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/image': {
		newIcon: { name: 'image', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/line': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
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
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'media-services/presentation': {
		newIcon: { name: 'chart-bar', type: 'core', library: 'icon' },
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
		newIcon: { name: 'image', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/scale-small': {
		newIcon: { name: 'image', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/spreadsheet': {
		newIcon: { name: 'spreadsheet', type: 'core', library: 'icon' },
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
		newIcon: { name: 'video', type: 'core', library: 'icon' },
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
		newIcon: { name: 'zoom-in', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'media-services/zoom-out': {
		newIcon: { name: 'zoom-out', type: 'core', library: 'icon' },
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
		newIcon: { name: 'menu', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	menu: {
		newIcon: { name: 'menu', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	mobile: {
		newIcon: { name: 'device-mobile', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	more: {
		newIcon: { name: 'show-more-horizontal', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'more-vertical': {
		newIcon: { name: 'show-more-vertical', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'notification', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	notification: {
		newIcon: { name: 'notification', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'office-building-filled': {
		newIcon: { name: 'office-building', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'office-building': {
		newIcon: { name: 'office-building', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	open: {
		newIcon: { name: 'arrow-up-right', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/outgoing-sound': {
		newIcon: { name: 'volume-high', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	overview: {
		newIcon: { name: 'align-left', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'page-filled': {
		newIcon: { name: 'page', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	page: {
		newIcon: { name: 'page', type: 'core', library: 'icon' },
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
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	people: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'person-circle': {
		newIcon: { name: 'person-avatar', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	person: {
		newIcon: { name: 'person', type: 'core', library: 'icon' },
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
		newIcon: { name: 'person-added', type: 'core', library: 'icon' },
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
		newIcon: { name: 'customize', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	premium: {
		newIcon: { name: 'premium', type: 'core', library: 'icon' },
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
		newIcon: { name: 'question-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	question: {
		newIcon: { name: 'question-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	questions: {
		newIcon: { name: 'comment', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	queues: {
		newIcon: { name: 'pages', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	quote: {
		newIcon: { name: 'quotation-mark', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	radio: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	recent: {
		newIcon: { name: 'clock', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	redo: {
		newIcon: { name: 'redo', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	refresh: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	retry: {
		newIcon: { name: 'retry', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	roadmap: {
		newIcon: { name: 'roadmap', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'room-menu': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	'schedule-filled': {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	schedule: {
		sizeGuidance: {
			small: 'icon-lab',
			medium: 'icon-lab',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	screen: {
		newIcon: { name: 'screen', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'hipchat/sd-video': {
		newIcon: { name: 'video', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	search: {
		newIcon: { name: 'search', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'select-clear': {
		newIcon: { name: 'cross-circle', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	send: {
		newIcon: { name: 'send', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	settings: {
		newIcon: { name: 'settings', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	share: {
		newIcon: { name: 'share', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	ship: {
		newIcon: { name: 'release', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	shortcut: {
		newIcon: { name: 'link-external', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'sign-in': {
		newIcon: { name: 'log-in', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'sign-out': {
		newIcon: { name: 'log-out', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	sprint: {
		newIcon: { name: 'sprint', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'star-filled': {
		newIcon: { name: 'star-starred', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	star: {
		newIcon: { name: 'star-unstarred', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'star-large': {
		newIcon: { name: 'star-unstarred', type: 'core', library: 'icon' },
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
		newIcon: { name: 'stopwatch', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	subtask: {
		newIcon: { name: 'subtasks', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	suitcase: {
		newIcon: { name: 'briefcase', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	switcher: {
		newIcon: { name: 'app-switcher', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	table: {
		newIcon: { name: 'grid', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'not-recommended',
			xlarge: 'not-recommended',
		},
	},
	task: {
		newIcon: { name: 'task', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	teams: {
		newIcon: { name: 'teams', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	trash: {
		newIcon: { name: 'delete', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	tray: {
		newIcon: { name: 'inbox', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	undo: {
		newIcon: { name: 'undo', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	unlink: {
		newIcon: { name: 'link-broken', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'unlock-circle': {
		newIcon: { name: 'lock-locked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'unlock-filled': {
		newIcon: { name: 'lock-unlocked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-size-shift-utility',
			medium: 'swap-size-shift-utility',
			large: 'icon-lab',
			xlarge: 'icon-lab',
		},
	},
	unlock: {
		newIcon: { name: 'lock-unlocked', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	upload: {
		newIcon: { name: 'cloud-arrow-up', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'user-avatar-circle': {
		newIcon: { name: 'person-avatar', type: 'core', library: 'icon' },
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
		newIcon: { name: 'audio', type: 'core', library: 'icon' },
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
		newIcon: { name: 'video', type: 'core', library: 'icon' },
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
		newIcon: { name: 'video', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: '16-icon-tile',
			medium: '24-icon-tile',
			large: '32-icon-tile',
			xlarge: '48-icon-tile',
		},
	},
	'video-filled': {
		newIcon: { name: 'video', type: 'core', library: 'icon' },
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
		newIcon: { name: 'fullscreen-exit', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-full-screen-on': {
		newIcon: { name: 'fullscreen-enter', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
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
		newIcon: { name: 'video-pause', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-play': {
		newIcon: { name: 'video-play', type: 'core', library: 'icon' },
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
		newIcon: { name: 'volume-high', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-volume-half': {
		newIcon: { name: 'volume-low', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'vid-volume-muted': {
		newIcon: { name: 'volume-muted', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-slight-visual-change',
			medium: 'swap-slight-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	warning: {
		newIcon: { name: 'warning', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'watch-filled': {
		newIcon: { name: 'eye-open-filled', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	watch: {
		newIcon: { name: 'eye-open', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	world: {
		newIcon: { name: 'globe', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
	'world-small': {
		newIcon: { name: 'globe', type: 'core', library: 'icon' },
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
};

export default migrationMap;
