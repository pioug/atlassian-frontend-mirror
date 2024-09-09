/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `UNSAFE_createIconDocsNew` in icon-build-process/src/create-icon-docs.tsx.
 *
 * @codegen <<SignedSource::5cdf67bfa1b09f0b2b18ce9fe05cffe6>>
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
	coins: {
		keywords: ['coins', 'icon', 'icon-lab', 'core', 'currency', 'money', 'loose change'],
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
			'octagon',
			'cross',
			'stop',
			'block',
		],
		componentName: 'CrossOctagonIcon',
		package: '@atlaskit/icon-lab/core/cross-octagon',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	editions: {
		keywords: [
			'editions',
			'icon',
			'icon-lab',
			'core',
			'editions',
			'gem',
			'premium',
			'diamond',
			'precious stone',
		],
		componentName: 'EditionsIcon',
		package: '@atlaskit/icon-lab/core/editions',
		type: 'core',
		categorization: 'single-purpose',
		usage:
			'Single purpose - Reserved for representing premium features and functionality. Editions may replace the current premium sparkle icon.',
		team: 'Design System Team',
	},
	'field-text': {
		keywords: [
			'field-text',
			'fieldtext',
			'icon',
			'icon-lab',
			'core',
			'text field',
			'form',
			'input',
			'label',
			'cursor',
		],
		componentName: 'FieldTextIcon',
		package: '@atlaskit/icon-lab/core/field-text',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	highlight: {
		keywords: [
			'highlight',
			'icon',
			'icon-lab',
			'core',
			'highlight',
			'highlighter',
			'stabilo',
			'pen',
		],
		componentName: 'HighlightIcon',
		package: '@atlaskit/icon-lab/core/highlight',
		type: 'core',
		categorization: 'single-purpose',
		usage: 'Single purpose - Reserved for highlight text tool in Confluence Editor.',
		team: 'Design System Team',
	},
	'paint-brush': {
		keywords: [
			'paint-brush',
			'paintbrush',
			'icon',
			'icon-lab',
			'core',
			'paint',
			'brush',
			'appearance',
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
			'paint',
			'roller',
			'background',
		],
		componentName: 'PaintRollerIcon',
		package: '@atlaskit/icon-lab/core/paint-roller',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
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
		usage: 'Single purpose - Reserved for roadmaps plan.',
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
		usage: 'Single purpose - Reserved for roadmaps service.',
		team: 'Design System Team',
	},
	speedometer: {
		keywords: ['speedometer', 'icon', 'icon-lab', 'core', 'dial', 'speed', 'performance'],
		componentName: 'SpeedometerIcon',
		package: '@atlaskit/icon-lab/core/speedometer',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	'takeout-container': {
		keywords: [
			'takeout-container',
			'takeoutcontainer',
			'icon',
			'icon-lab',
			'core',
			'takeaway',
			'takeout',
			'food',
		],
		componentName: 'TakeoutContainerIcon',
		package: '@atlaskit/icon-lab/core/takeout-container',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose - Known usages: Alternative option for food emoji category.',
		team: 'Design System Team',
	},
	ticket: {
		keywords: ['ticket', 'icon', 'icon-lab', 'core', 'ticket', 'stub'],
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
			'car',
			'transportation',
			'vehicle',
		],
		componentName: 'VehicleTrainIcon',
		package: '@atlaskit/icon-lab/core/vehicle-train',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose - Known usages: Alternative option for transport emoji category.',
		team: 'Design System Team',
	},
	wallet: {
		keywords: ['wallet', 'icon', 'icon-lab', 'core', 'wallet', 'money', 'sales', 'payment'],
		componentName: 'WalletIcon',
		package: '@atlaskit/icon-lab/core/wallet',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
	wrench: {
		keywords: ['wrench', 'icon', 'icon-lab', 'core', 'tool', 'wrench', 'spanner'],
		componentName: 'WrenchIcon',
		package: '@atlaskit/icon-lab/core/wrench',
		type: 'core',
		categorization: 'multi-purpose',
		usage: 'Multi purpose',
		team: 'Design System Team',
	},
};

export default metadata;
