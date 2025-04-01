/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createIconDocsNew` in icon-build-process/src/create-icon-docs.tsx.
 *
 * @codegen <<SignedSource::61c8e5972c67cf6862ba338f4468f558>>
 * @codegenCommand yarn build:icon-glyphs
 */
interface metadata {
	/**
	 * Default component name for the icon
	 */
	componentName: string;

	/**
	 * Package path to the icon component
	 */
	package: string;

	/**
	 * The category of the icon:
	 * - 'single-purpose' icons should only be used for the purposes listed in the 'usage' field
	 * - 'multi-purpose' icons are designed for various use cases and don't have the same usage restrictions
	 * - 'utility' icons are used for utility purposes
	 */
	categorization: 'single-purpose' | 'multi-purpose' | 'utility';

	/**
	 * The type of the icon - either a 16px 'core' icon, or a 12px 'utility' icon
	 */
	type: 'core' | 'utility';

	/**
	 * Usage guidelines for the icon. For single-purpose icons,
	 */
	usage?: string;

	/**
	 * Additional keywords used to assist in search/lookup of an icon
	 */
	keywords: string[];

	/**
	 * The name of the team owning the icon
	 */
	team: string;

	/**
	 * The status of the icon
	 */
	status?: 'draft' | 'ready-to-publish' | 'published' | 'modified' | 'deprecated';

	/**
	 * Contact slack channel for the team owning the icon
	 */
	slackChannel?: string;

	/**
	 * A list of keys for old icons that have been replaced by this icon
	 */
	oldName?: string[];

	/**
	 * A replacement icon if this icon has been deprecated
	 */
	replacement?: {
		name: string;
		type: 'core' | 'utility';
		location: '@atlaskit/icon' | '@atlaskit/icon-lab' | '@atlassian/icon-private';
	};
}

const metadata: Record<string, metadata> = {
	add: {
		keywords: ['add', 'plus', 'create', 'new', 'icon', 'utility', 'create', 'plus'],
		componentName: 'AddIcon',
		package: '@atlaskit/icon/utility/add',
		oldName: ['add-circle', 'add', 'editor/add', 'emoji/custom'],
		type: 'utility',
		categorization: 'utility',
		usage:
			'Reserved for creating and adding an object as a secondary/tertiary action in a menu item.',
		team: 'Design System Team',
		status: 'published',
	},
	'arrow-down': {
		keywords: ['arrow-down', 'arrowdown', 'icon', 'utility', 'down', 'bottom', 'sorting'],
		componentName: 'ArrowDownIcon',
		package: '@atlaskit/icon/utility/arrow-down',
		oldName: ['arrow-down-circle', 'arrow-down'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Know uses: sorting table headers or Bitbucket code difference.',
		team: 'Design System Team',
		status: 'published',
	},
	'arrow-left': {
		keywords: [
			'arrow-left',
			'arrowleft',
			'back',
			'previous',
			'icon',
			'utility',
			'back',
			'previous',
		],
		componentName: 'ArrowLeftIcon',
		package: '@atlaskit/icon/utility/arrow-left',
		oldName: ['arrow-left-circle', 'arrow-left'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Known uses: back to previous screen, previous slide.',
		team: 'Design System Team',
		status: 'published',
	},
	'arrow-right': {
		keywords: [
			'arrow-right',
			'arrowright',
			'forward',
			'next',
			'icon',
			'utility',
			'forward',
			'next',
			'link',
		],
		componentName: 'ArrowRightIcon',
		package: '@atlaskit/icon/utility/arrow-right',
		oldName: ['arrow-right-circle', 'arrow-right'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Known uses: link to nested menu item, a linked menu item, next slide.',
		team: 'Design System Team',
		status: 'published',
	},
	'arrow-up': {
		keywords: ['arrow-up', 'arrowup', 'icon', 'utility', 'improvement', 'jira status'],
		componentName: 'ArrowUpIcon',
		package: '@atlaskit/icon/utility/arrow-up',
		oldName: ['arrow-up-circle', 'arrow-up'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Known uses: back to top.',
		team: 'Design System Team',
		status: 'published',
	},
	'check-circle': {
		keywords: [
			'check-circle',
			'checkcircle',
			'tick',
			'icon',
			'utility',
			'tick',
			'yes',
			'checkmark',
		],
		componentName: 'CheckCircleIcon',
		package: '@atlaskit/icon/utility/check-circle',
		oldName: ['check-circle', 'check-circle-outline', 'emoji/productivity'],
		type: 'utility',
		categorization: 'utility',
		usage: '📦 @atlaskit/icon/utility/check-circle',
		team: 'Design System Team',
		status: 'published',
	},
	'check-mark': {
		keywords: ['check-mark', 'checkmark', 'icon', 'utility', 'tick'],
		componentName: 'CheckMarkIcon',
		package: '@atlaskit/icon/utility/check-mark',
		oldName: ['check', 'editor/done'],
		type: 'utility',
		categorization: 'utility',
		usage: '📦 @atlaskit/icon/utility/check-mark',
		team: 'Design System Team',
		status: 'published',
	},
	'chevron-double-left': {
		keywords: [
			'chevron-double-left',
			'chevrondoubleleft',
			'icon',
			'utility',
			'calendar year',
			'<<',
			'less than',
			'previous',
		],
		componentName: 'ChevronDoubleLeftIcon',
		package: '@atlaskit/icon/utility/chevron-double-left',
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for calendar year button.',
		team: 'Design System Team',
		status: 'ready-to-publish',
		slackChannel: '#help-design-system',
	},
	'chevron-double-right': {
		keywords: [
			'chevron-double-right',
			'chevrondoubleright',
			'icon',
			'utility',
			'calendar year',
			'>>',
			'greater than',
			'next',
		],
		componentName: 'ChevronDoubleRightIcon',
		package: '@atlaskit/icon/utility/chevron-double-right',
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for calendar year button.',
		team: 'Design System Team',
		status: 'ready-to-publish',
		slackChannel: '#help-design-system',
	},
	'chevron-down': {
		keywords: [
			'chevron-down',
			'chevrondown',
			'expand',
			'collapse',
			'icon',
			'utility',
			'accordion',
			'down',
		],
		componentName: 'ChevronDownIcon',
		package: '@atlaskit/icon/utility/chevron-down',
		oldName: ['chevron-down', 'chevron-down-circle', 'hipchat/chevron-down'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for dropdown menus, selects, accordions, and expands.',
		team: 'Design System Team',
		status: 'published',
	},
	'chevron-left': {
		keywords: [
			'chevron-left',
			'chevronleft',
			'back',
			'previous',
			'icon',
			'utility',
			'less than',
			'<',
			'previous',
		],
		componentName: 'ChevronLeftIcon',
		package: '@atlaskit/icon/utility/chevron-left',
		oldName: ['chevron-left-circle', 'chevron-left', 'chevron-left-large'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for collapse side nav and to indicate previous in dates.',
		team: 'Design System Team',
		status: 'published',
	},
	'chevron-right': {
		keywords: [
			'chevron-right',
			'chevronright',
			'forward',
			'next',
			'icon',
			'utility',
			'greater than',
			'>',
			'next',
		],
		componentName: 'ChevronRightIcon',
		package: '@atlaskit/icon/utility/chevron-right',
		oldName: ['chevron-right-circle', 'chevron-right', 'chevron-right-large'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for menu fly outs and to indicate next in dates.',
		team: 'Design System Team',
		status: 'published',
	},
	'chevron-up': {
		keywords: [
			'chevron-up',
			'chevronup',
			'expand',
			'collapse',
			'icon',
			'utility',
			'up',
			'accordion',
		],
		componentName: 'ChevronUpIcon',
		package: '@atlaskit/icon/utility/chevron-up',
		oldName: ['chevron-up-circle', 'hipchat/chevron-up', 'chevron-up'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for accordions.',
		team: 'Design System Team',
		status: 'published',
	},
	cross: {
		keywords: ['cross', 'close', 'x', 'cancel', 'icon', 'utility', 'remove', 'clear', 'x'],
		componentName: 'CrossIcon',
		package: '@atlaskit/icon/utility/cross',
		oldName: ['editor/close'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Known uses: remove tag.',
		team: 'Design System Team',
		status: 'published',
	},
	'cross-circle': {
		keywords: [
			'cross-circle',
			'crosscircle',
			'close',
			'x',
			'cancel',
			'icon',
			'utility',
			'x',
			'exit',
			'clear',
			'no',
			'filled',
			'form',
		],
		componentName: 'CrossCircleIcon',
		package: '@atlaskit/icon/utility/cross-circle',
		oldName: ['cross-circle', 'editor/error', 'select-clear'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'Design System Team',
		status: 'published',
	},
	'drag-handle': {
		keywords: [
			'drag-handle',
			'draghandle',
			'icon',
			'utility',
			'drag handler',
			'drag dots',
			'reorder',
			'move',
		],
		componentName: 'DragHandleIcon',
		package: '@atlaskit/icon/utility/drag-handle',
		oldName: ['drag-handler'],
		type: 'utility',
		replacement: { name: 'drag-handle-vertical', type: 'utility', location: '@atlaskit/icon' },
		categorization: 'utility',
		usage: 'Reserved for draggable elements.',
		team: 'Design System Team',
		status: 'deprecated',
	},
	'drag-handle-horizontal': {
		keywords: [
			'drag-handle-horizontal',
			'draghandlehorizontal',
			'icon',
			'utility',
			'drag',
			'drag handler',
			'reorder columns',
			'move',
		],
		componentName: 'DragHandleHorizontalIcon',
		package: '@atlaskit/icon/utility/drag-handle-horizontal',
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for dragging elements along a horizontal axis.',
		team: 'Design System Team',
		status: 'published',
		slackChannel: '#icon-contributions',
	},
	'drag-handle-vertical': {
		keywords: [
			'drag-handle-vertical',
			'draghandlevertical',
			'icon',
			'utility',
			'drag',
			'drag handler',
			'move',
			'reorder rows',
		],
		componentName: 'DragHandleVerticalIcon',
		package: '@atlaskit/icon/utility/drag-handle-vertical',
		oldName: ['drag-handler'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for dragging elements along a vertical axis.',
		team: 'Design System Team',
		status: 'published',
		slackChannel: '#icon-contributions',
	},
	error: {
		keywords: [
			'error',
			'warning',
			'alert',
			'icon',
			'utility',
			'filled',
			'status',
			'form',
			'helper',
		],
		componentName: 'ErrorIcon',
		package: '@atlaskit/icon/utility/error',
		oldName: ['error'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'Design System Team',
		status: 'published',
	},
	information: {
		keywords: ['information', 'icon', 'utility', 'info', 'filled', 'helper', 'tip', 'form'],
		componentName: 'InformationIcon',
		package: '@atlaskit/icon/utility/information',
		oldName: ['editor/info', 'editor/panel', 'info'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'Design System Team',
		status: 'published',
	},
	'link-external': {
		keywords: [
			'link-external',
			'linkexternal',
			'icon',
			'utility',
			'new tab',
			'new window',
			'open in',
			'url',
			'hyperlink',
			'www',
			'http',
			'https',
			'website',
			'external',
			'shortcut',
			'diagonal arrow',
			'secondary',
			'tertiary',
		],
		componentName: 'LinkExternalIcon',
		package: '@atlaskit/icon/utility/link-external',
		oldName: ['shortcut'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for links that open up a new tab as a secondary/tertiary action.',
		team: 'Design System Team',
		status: 'published',
	},
	'lock-locked': {
		keywords: [
			'lock-locked',
			'locklocked',
			'icon',
			'utility',
			'secondary',
			'tertiary',
			'permissions',
			'no access',
			'restricted',
			'security',
			'secure',
			'forbidden',
			'authentication',
		],
		componentName: 'LockLockedIcon',
		package: '@atlaskit/icon/utility/lock-locked',
		oldName: ['lock-circle', 'lock-filled', 'lock', 'unlock-circle'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for indicating something is locked in the side navigation Menu Item.',
		team: 'Design System Team',
		status: 'published',
	},
	'lock-unlocked': {
		keywords: [
			'lock-unlocked',
			'lockunlocked',
			'icon',
			'utility',
			'secondary',
			'tertiary',
			'open permissions',
			'unrestricted access',
			'security',
			'insecure',
			'authentication',
		],
		componentName: 'LockUnlockedIcon',
		package: '@atlaskit/icon/utility/lock-unlocked',
		oldName: ['unlock-filled', 'unlock'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for indicating something is locked in the side navigation Menu Item.',
		team: 'Design System Team',
		status: 'published',
	},
	'show-more-horizontal': {
		keywords: [
			'show-more-horizontal',
			'showmorehorizontal',
			'icon',
			'utility',
			'ellipses',
			'three dots',
			'meatball',
			'more actions',
			'secondary',
			'tertiary',
		],
		componentName: 'ShowMoreHorizontalIcon',
		package: '@atlaskit/icon/utility/show-more-horizontal',
		oldName: ['editor/more', 'more'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for secondary/tertiary more action menus.',
		team: 'Design System Team',
		status: 'published',
	},
	'show-more-vertical': {
		keywords: [
			'show-more-vertical',
			'showmorevertical',
			'icon',
			'utility',
			'three dots',
			'kebab',
			'more actions',
			'secondary',
			'tertiary',
		],
		componentName: 'ShowMoreVerticalIcon',
		package: '@atlaskit/icon/utility/show-more-vertical',
		oldName: ['more-vertical'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for secondary/tertiary action menus, traditionally on mobile.',
		team: 'Design System Team',
		status: 'published',
	},
	'star-starred': {
		keywords: [
			'star-starred',
			'starstarred',
			'icon',
			'utility',
			'favourite',
			'star',
			'starred',
			'filled',
			'menu',
			'secondary',
			'tertiary',
		],
		componentName: 'StarStarredIcon',
		package: '@atlaskit/icon/utility/star-starred',
		oldName: ['star-filled'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for starred or favourited objects as a secondary/tertiary action.',
		team: 'Design System Team',
		status: 'published',
	},
	'star-unstarred': {
		keywords: [
			'star-unstarred',
			'starunstarred',
			'icon',
			'utility',
			'favourite',
			'star',
			'form',
			'secondary',
			'tertiary',
		],
		componentName: 'StarUnstarredIcon',
		package: '@atlaskit/icon/utility/star-unstarred',
		oldName: ['star', 'star-large'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for starring or favoriting objects as a secondary/tertiary action.',
		team: 'Design System Team',
		status: 'published',
	},
	success: {
		keywords: ['success', 'icon', 'utility', 'tick', 'yes', 'success', 'filled'],
		componentName: 'SuccessIcon',
		package: '@atlaskit/icon/utility/success',
		oldName: ['check-circle', 'editor/success'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'Design System Team',
		status: 'published',
	},
	warning: {
		keywords: [
			'warning',
			'error',
			'alert',
			'icon',
			'utility',
			'alert',
			'danger',
			'triangle',
			'filled',
			'secondary',
			'tertiary',
		],
		componentName: 'WarningIcon',
		package: '@atlaskit/icon/utility/warning',
		oldName: ['editor/warning', 'warning'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'Design System Team',
		status: 'published',
	},
};

export default metadata;
