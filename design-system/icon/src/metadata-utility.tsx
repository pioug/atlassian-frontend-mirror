/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `UNSAFE_createIconDocsNew` in icon-build-process/src/create-icon-docs.tsx.
 *
 * @codegen <<SignedSource::7a591dd4eb936ca5574aca6d23fdb2ac>>
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
	 * Contact slack channel for the team owning the icon
	 */
	slackChannel?: string;

	/**
	 * A list of keys for old icons that have been replaced by this icon
	 */
	oldName?: string[];
}

const metadata: Record<string, metadata> = {
	add: {
		keywords: ['add', 'plus', 'create', 'new', 'icon', 'utility', 'create', 'plus'],
		componentName: 'AddIcon',
		package: '@atlaskit/icon/utility/add',
		oldName: ['add-circle', 'add', 'editor/add', 'emoji/custom'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for creating and adding an object as a secondary action within a Menu Item.',
		team: 'ADS',
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
			'success',
			'filled',
		],
		componentName: 'CheckCircleIcon',
		package: '@atlaskit/icon/utility/check-circle',
		oldName: ['check-circle', 'editor/success'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'ADS',
	},
	'check-mark': {
		keywords: [
			'check-mark',
			'checkmark',
			'icon',
			'utility',
			'Known uses: table cells',
			'checkboxes.',
		],
		componentName: 'CheckMarkIcon',
		package: '@atlaskit/icon/utility/check-mark',
		oldName: ['check', 'editor/done'],
		type: 'utility',
		categorization: 'utility',
		usage: 'TBD',
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		usage: 'Reserved for menu fly-outs and to indicate next in dates.',
		team: 'ADS',
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
		team: 'ADS',
	},
	cross: {
		keywords: ['cross', 'close', 'x', 'cancel', 'icon', 'utility', 'remove', 'clear', 'x'],
		componentName: 'CrossIcon',
		package: '@atlaskit/icon/utility/cross',
		type: 'utility',
		categorization: 'utility',
		usage: 'Known uses: remove tag.',
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
	},
	information: {
		keywords: ['information', 'icon', 'utility', 'info', 'filled', 'helper', 'tip', 'form'],
		componentName: 'InformationIcon',
		package: '@atlaskit/icon/utility/information',
		oldName: ['editor/info', 'editor/panel', 'info'],
		type: 'utility',
		categorization: 'utility',
		usage: 'Reserved for Helper Messages in Forms.',
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
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
		team: 'ADS',
	},
};

export default metadata;
