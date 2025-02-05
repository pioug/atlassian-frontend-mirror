/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createIconDocsNew` in icon-build-process/src/create-icon-docs.tsx.
 *
 * @codegen <<SignedSource::6dd383b7ae5466d0bcf982abba2d9cdf>>
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
	'assets-data-manager': {
		keywords: [
			'assets-data-manager',
			'assetsdatamanager',
			'icon',
			'icon-lab',
			'core',
			'data manager',
			'assets',
			'CMDB',
			'configuration management database',
		],
		componentName: 'AssetsDataManagerIcon',
		package: '@atlaskit/icon-lab/core/assets-data-manager',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for JSM Assets.',
		team: 'Assets',
	},
	'assets-schema': {
		keywords: [
			'assets-schema',
			'assetsschema',
			'icon',
			'icon-lab',
			'core',
			'assets',
			'CMDB',
			'configuration management database',
		],
		componentName: 'AssetsSchemaIcon',
		package: '@atlaskit/icon-lab/core/assets-schema',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for JSM Assets.',
		team: 'Assets',
	},
	'book-open': {
		keywords: [
			'book-open',
			'bookopen',
			'icon',
			'icon-lab',
			'core',
			'book',
			'knowledgebase article',
		],
		componentName: 'BookOpenIcon',
		package: '@atlaskit/icon-lab/core/book-open',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Known uses: None',
		team: 'Design System Team',
	},
	'cloud-offline': {
		keywords: [
			'cloud-offline',
			'cloudoffline',
			'icon',
			'icon-lab',
			'core',
			'cloud',
			'offline',
			'disconnected',
			'strikethrough',
		],
		componentName: 'CloudOfflineIcon',
		package: '@atlaskit/icon-lab/core/cloud-offline',
		type: 'core',
		categorization: 'single-purpose',
		usage: "Reserved for showing when a connection can't be established to the cloud.",
		team: 'Content Types',
	},
	'cloud-saved': {
		keywords: [
			'cloud-saved',
			'cloudsaved',
			'icon',
			'icon-lab',
			'core',
			'cloud',
			'check mark',
			'saved',
			'success',
		],
		componentName: 'CloudSavedIcon',
		package: '@atlaskit/icon-lab/core/cloud-saved',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for showing saved status after successful cloud synchronisation.',
		team: 'Content Types',
	},
	coins: {
		keywords: ['coins', 'icon', 'icon-lab', 'core', 'money', 'loose change', 'currency'],
		componentName: 'CoinsIcon',
		package: '@atlaskit/icon-lab/core/coins',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'cross-octagon': {
		keywords: [
			'cross-octagon',
			'crossoctagon',
			'icon',
			'icon-lab',
			'core',
			'cross',
			'stop',
			'block',
			'octagon',
		],
		componentName: 'CrossOctagonIcon',
		package: '@atlaskit/icon-lab/core/cross-octagon',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'database-storage': {
		keywords: [
			'database-storage',
			'databasestorage',
			'icon',
			'icon-lab',
			'core',
			'database',
			'db',
			'storage',
			'sql',
		],
		componentName: 'DatabaseStorageIcon',
		package: '@atlaskit/icon-lab/core/database-storage',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Known uses: SQL database in Developer Console',
		team: 'Ecosystem',
		slackChannel: '#forge-sql',
	},
	'database-storage-cache': {
		keywords: [
			'database-storage-cache',
			'databasestoragecache',
			'icon',
			'icon-lab',
			'core',
			'database',
			'db',
			'storage',
			'sql',
			'cache',
		],
		componentName: 'DatabaseStorageCacheIcon',
		package: '@atlaskit/icon-lab/core/database-storage-cache',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Known uses: Storage cache in Developer Console.',
		team: 'Ecosystem',
		slackChannel: '#forge-sql',
	},
	duplicate: {
		keywords: ['duplicate', 'icon', 'icon-lab', 'core', 'clone', 'duplicate', 'plus'],
		componentName: 'DuplicateIcon',
		package: '@atlaskit/icon-lab/core/duplicate',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for cloning and duplicating objects.',
		team: 'Design System Team',
		slackChannel: '#icon-contributions',
	},
	editions: {
		keywords: [
			'editions',
			'icon',
			'icon-lab',
			'core',
			'gem',
			'premium',
			'diamond',
			'precious stone',
			'editions',
		],
		componentName: 'EditionsIcon',
		package: '@atlaskit/icon-lab/core/editions',
		type: 'core',
		categorization: 'single-purpose',
		usage:
			'Reserved for representing premium features and functionality. Editions may replace the current premium sparkle icon.',
		team: 'Design System Team',
	},
	'field-text': {
		keywords: [
			'field-text',
			'fieldtext',
			'icon',
			'icon-lab',
			'core',
			'form',
			'input',
			'label',
			'cursor',
			'text field',
		],
		componentName: 'FieldTextIcon',
		package: '@atlaskit/icon-lab/core/field-text',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	initiative: {
		keywords: [
			'initiative',
			'icon',
			'icon-lab',
			'core',
			'fortune teller',
			'crystal ball',
			'future',
			'issue type',
			'system object',
			'work collection',
		],
		componentName: 'InitiativeIcon',
		package: '@atlaskit/icon-lab/core/initiative',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Representing Jira Initiatives',
		team: 'Jira Enterprise',
	},
	lozenge: {
		keywords: ['lozenge', 'icon', 'icon-lab', 'core', 'insert', 'status', 'badge'],
		componentName: 'LozengeIcon',
		package: '@atlaskit/icon-lab/core/lozenge',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for inserting status lozenges in Editor.',
		team: 'Editor',
	},
	'page-live-doc': {
		keywords: [
			'page-live-doc',
			'pagelivedoc',
			'icon',
			'icon-lab',
			'core',
			'page',
			'live edit',
			'lightning bolt',
			'multiplayer',
			'document',
			'live doc',
		],
		componentName: 'PageLiveDocIcon',
		package: '@atlaskit/icon-lab/core/page-live-doc',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for Live Document content type.',
		team: 'Content Types',
	},
	'paint-brush': {
		keywords: [
			'paint-brush',
			'paintbrush',
			'icon',
			'icon-lab',
			'core',
			'brush',
			'appearance',
			'paint',
		],
		componentName: 'PaintBrushIcon',
		package: '@atlaskit/icon-lab/core/paint-brush',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'paint-roller': {
		keywords: [
			'paint-roller',
			'paintroller',
			'icon',
			'icon-lab',
			'core',
			'roller',
			'background',
			'paint',
		],
		componentName: 'PaintRollerIcon',
		package: '@atlaskit/icon-lab/core/paint-roller',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'qr-code': {
		keywords: ['qr-code', 'qrcode', 'icon', 'icon-lab', 'core', 'QR code', 'barcode'],
		componentName: 'QrCodeIcon',
		package: '@atlaskit/icon-lab/core/qr-code',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for QR code experiences.',
		team: 'Assets',
	},
	'roadmaps-plan': {
		keywords: [
			'roadmaps-plan',
			'roadmapsplan',
			'icon',
			'icon-lab',
			'core',
			'roadmaps',
			'roadmap',
			'plan',
		],
		componentName: 'RoadmapsPlanIcon',
		package: '@atlaskit/icon-lab/core/roadmaps-plan',
		oldName: ['bitbucket/builds'],
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for roadmaps plan.',
		team: 'Design System Team',
	},
	'roadmaps-service': {
		keywords: [
			'roadmaps-service',
			'roadmapsservice',
			'icon',
			'icon-lab',
			'core',
			'roadmaps',
			'service',
			'roadmap',
		],
		componentName: 'RoadmapsServiceIcon',
		package: '@atlaskit/icon-lab/core/roadmaps-service',
		oldName: ['bitbucket/forks'],
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for roadmaps service.',
		team: 'Design System Team',
	},
	speedometer: {
		keywords: ['speedometer', 'icon', 'icon-lab', 'core', 'speed', 'performance', 'dial'],
		componentName: 'SpeedometerIcon',
		package: '@atlaskit/icon-lab/core/speedometer',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	sunset: {
		keywords: [
			'sunset',
			'icon',
			'icon-lab',
			'core',
			'sun',
			'horizon',
			'farewell',
			'goodbye',
			'sky',
			'farewell feed',
		],
		componentName: 'SunsetIcon',
		package: '@atlaskit/icon-lab/core/sunset',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Farewell feed in hello.',
		team: 'confluence insights',
	},
	sync: {
		keywords: [
			'sync',
			'icon',
			'icon-lab',
			'core',
			'sync',
			'synch',
			'synchronise',
			'synchronize',
			'saving',
			'arrows',
		],
		componentName: 'SyncIcon',
		package: '@atlaskit/icon-lab/core/sync',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for syncing changes and save operations.',
		team: 'Content Types',
	},
	'takeout-container': {
		keywords: [
			'takeout-container',
			'takeoutcontainer',
			'icon',
			'icon-lab',
			'core',
			'takeout',
			'food',
			'takeaway',
		],
		componentName: 'TakeoutContainerIcon',
		package: '@atlaskit/icon-lab/core/takeout-container',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Known usages: Alternative option for food emoji category.',
		team: 'Design System Team',
	},
	ticket: {
		keywords: ['ticket', 'icon', 'icon-lab', 'core', 'stub', 'ticket'],
		componentName: 'TicketIcon',
		package: '@atlaskit/icon-lab/core/ticket',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'vehicle-train': {
		keywords: [
			'vehicle-train',
			'vehicletrain',
			'icon',
			'icon-lab',
			'core',
			'transportation',
			'vehicle',
			'car',
		],
		componentName: 'VehicleTrainIcon',
		package: '@atlaskit/icon-lab/core/vehicle-train',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Known usages: Alternative option for transport emoji category.',
		team: 'Design System Team',
	},
	vulnerability: {
		keywords: [
			'vulnerability',
			'icon',
			'icon-lab',
			'core',
			'vulnerability',
			'security',
			'alert',
			'warning',
		],
		componentName: 'VulnerabilityIcon',
		package: '@atlaskit/icon-lab/core/vulnerability',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Reserved for security vulnerabilities.',
		team: 'Automation',
	},
	wallet: {
		keywords: ['wallet', 'icon', 'icon-lab', 'core', 'money', 'sales', 'payment', 'wallet'],
		componentName: 'WalletIcon',
		package: '@atlaskit/icon-lab/core/wallet',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'welcome-feed': {
		keywords: [
			'welcome-feed',
			'welcomefeed',
			'icon',
			'icon-lab',
			'core',
			'welcome',
			'hello',
			'blog',
			'smile',
			'intro',
		],
		componentName: 'WelcomeFeedIcon',
		package: '@atlaskit/icon-lab/core/welcome-feed',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Known uses: Intro blog feed picker on Hello',
		team: 'Insights',
		slackChannel: '#cc-insights-and-reporting',
	},
	wrench: {
		keywords: ['wrench', 'icon', 'icon-lab', 'core', 'wrench', 'spanner', 'tool'],
		componentName: 'WrenchIcon',
		package: '@atlaskit/icon-lab/core/wrench',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
};

export default metadata;
