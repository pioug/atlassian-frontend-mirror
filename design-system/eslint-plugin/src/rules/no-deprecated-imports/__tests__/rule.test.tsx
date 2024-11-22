import { tester } from '../../__tests__/utils/_tester';
import { getConfig } from '../../utils/get-deprecated-config';
import { importNameWithCustomMessageId, pathWithCustomMessageId } from '../constants';
import rule from '../index';

import { invalidDeprecatedIconTests } from './__helpers/icon-test-helper';

const deprecatedImports = getConfig('imports');

const pathImports: { path: string; message: string }[] = [];
const namedImports: {
	path: string;
	import: { importName: string; message: string };
}[] = [];

for (const [path, value] of Object.entries(deprecatedImports)) {
	if (value.message) {
		pathImports.push({ path, message: value.message as string });
	} else if (value.importSpecifiers) {
		for (const individualImport of value.importSpecifiers) {
			namedImports.push({
				path,
				import: individualImport,
			});
		}
	}
}

jest.mock('@atlaskit/icon/metadata', () => ({
	coreIconMetadata: {
		activity: {
			keywords: ['dashboard', 'window', 'grid', 'icon', 'core', 'activity', 'view'],
			componentName: 'ActivityIcon',
			package: '@atlaskit/icon/core/activity',
			type: 'core',
			replacement: { name: 'dashboard', type: 'core', location: '@atlaskit/icon' },
			categorization: 'single-purpose',
			usage: 'Single purpose - Reserved for activities in Jira.',
			team: 'Design System Team',
		},
		'bulleted-list': {
			keywords: ['bulleted-list', 'bulletedlist', 'icon', 'core', 'bullets', 'unordered list'],
			location: '@atlaskit/icon',
			oldName: ['bullet-list', 'editor/bullet-list'],
			type: 'core',
			categorization: 'multi-purpose',
			usage: 'Multi purpose - Known uses: bulleted lists, view all.',
			team: 'Design System Team',
			status: 'deprecated',
			replacement: {
				name: 'list-bulleted',
				type: 'core',
				location: '@atlaskit/icon',
			},
		},
		expand: {
			keywords: ['expand', 'icon', 'core', 'diagonal', 'resize', 'enlarge'],
			componentName: 'ExpandIcon',
			package: '@atlaskit/icon/core/expand',
			oldName: ['editor/expand', 'editor/image-resize', 'image-resize'],
			type: 'core',
			categorization: 'single-purpose',
			usage:
				'Single purpose - Reserved for resizing screens, panels, modals, or media to its maximum size.',
			team: 'Design System Team',
			status: 'deprecated',
			replacement: {
				name: 'grow-horizontal',
				type: 'core',
				location: '@atlaskit/icon',
			},
		},
		page: {
			keywords: [
				'page',
				'file',
				'document',
				'icon',
				'core',
				'single page',
				'feed',
				'document',
				'jira status',
			],
			componentName: 'PageIcon',
			package: '@atlaskit/icon/core/page',
			oldName: [
				'document-filled',
				'document',
				'editor/note',
				'media-services/document',
				'page-filled',
				'page',
			],
			type: 'core',
			categorization: 'single-purpose',
			usage: 'Single purpose - Reserved for pages in Confluence.',
			team: 'Design System Team',
			status: 'deprecated',
		},
	},
	utilityIconMetadata: {
		'chevron-up-circle': {
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
			componentName: 'ChevronUpCircleIcon',
			package: '@atlaskit/icon/utility/chevron-up-circle',
			oldName: ['chevron-up-circle', 'hipchat/chevron-up', 'chevron-up'],
			type: 'utility',
			replacement: { name: 'chevron-up', type: 'core', location: '@atlaskit/icon' },
			categorization: 'utility',
			usage: 'Reserved for accordions.',
			team: 'Design System Team',
		},
	},
}));

jest.mock('@atlaskit/icon-lab/metadata', () => ({
	activity: {
		keywords: ['dashboard', 'window', 'grid', 'icon', 'core', 'activity', 'view'],
		componentName: 'ActivityIcon',
		package: '@atlaskit/icon-lab/core/activity',
		type: 'core',
		replacement: { name: 'dashboard', type: 'core', location: '@atlaskit/icon-lab' },
		categorization: 'single-purpose',
		usage: 'Single purpose - Reserved for activities in Jira.',
		team: 'Design System Team',
	},
}));

jest.mock('@atlaskit/icon/UNSAFE_migration-map', () => ({
	'bullet-list': {
		newIcon: { name: 'list-bulleted', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'bulleted-list', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap',
			medium: 'swap',
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
	'image-resize': {
		newIcon: { name: 'maximize', type: 'core', package: '@atlaskit/icon' },
		additionalIcons: [{ name: 'expand', type: 'core', package: '@atlaskit/icon' }],
		sizeGuidance: {
			small: 'swap-visual-change',
			medium: 'swap-visual-change',
			large: 'icon-tile',
			xlarge: 'icon-tile',
		},
	},
}));

/**
 * Run the tests
 */

describe('no-deprecated-imports', () => {
	tester.run('basic cases', rule, {
		valid: [
			{
				code: `import foo from 'foo';`,
			},
			{
				code: `import Table from '@atlaskit/table'`,
			},
		],
		invalid: [
			{
				code: `import * as _ from '@atlaskit/global-navigation';`,
				errors: [{ messageId: pathWithCustomMessageId }],
			},
			{
				code: `import _ from 'foo';`,
				errors: [{ messageId: pathWithCustomMessageId }],
				options: [
					{
						deprecatedConfig: JSON.parse('{"foo":{"message":"foo message."}}'),
					},
				],
			},
			{
				code: `export { default as foo } from 'foo';`,
				errors: [{ messageId: pathWithCustomMessageId }],
				options: [
					{
						deprecatedConfig: JSON.parse('{"foo":{"message":"foo message."}}'),
					},
				],
			},
			{
				code: `export { bar } from 'foo';`,
				errors: [{ messageId: importNameWithCustomMessageId }],
				options: [
					{
						deprecatedConfig: JSON.parse(
							'{"foo":{"importSpecifiers":[{"importName": "bar", "message": "foo message."}]}}',
						),
					},
				],
			},
			{
				code: `import { foo } from 'foo';`,
				errors: [{ messageId: importNameWithCustomMessageId }],
				options: [
					{
						deprecatedConfig: JSON.parse(
							'{"foo":{"importSpecifiers":[{"importName":"foo","message":"foo message."}]}}',
						),
					},
				],
			},

			...namedImports.map(({ path, import: { importName } }) => ({
				code: `import { ${importName} } from '${path}';`,
				errors: [
					{
						messageId: importNameWithCustomMessageId,
					},
				],
			})),

			...pathImports.map(({ path }) => ({
				code: `import _ from '${path}';`,
				errors: [
					{
						messageId: pathWithCustomMessageId,
					},
				],
			})),
		],
	});
	tester.run('deprecated icons', rule, {
		valid: [],
		invalid: [...invalidDeprecatedIconTests],
	});
});
