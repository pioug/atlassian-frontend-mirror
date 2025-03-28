import type {
	ExtensionManifest,
	ExtensionModule,
	ExtensionModuleNodes,
} from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	cqlDeserializer,
	cqlSerializer,
	mockFieldResolver,
} from '@atlaskit/editor-test-helpers/example-helpers';

import { customFields, nativeFields } from './fields';

const exampleFields = [...nativeFields, ...customFields];

const key = 'allFields';

const quickInsert: ExtensionModule[] = [
	{
		key,
		title: 'All fields',
		icon: () =>
			import(
				/* webpackChunkName: "@atlaskit-internal_icon-code" */ '@atlaskit/icon/glyph/editor/code'
			).then((mod) => mod.default),
		action: {
			type: 'node',
			key,
			parameters: {},
		},
	},
];

const nodes: ExtensionModuleNodes = {
	[key]: {
		type: 'extension',
		render: () => Promise.resolve(() => null),
		getFieldsDefinition: () => Promise.resolve(exampleFields),
	},
};

const manifest: ExtensionManifest = {
	title: 'Editor fields example',
	type: 'twp.editor.example',
	key: 'example-fields',
	description: 'Example of fields supported by the editor',
	icons: {
		'48': () =>
			import(
				/* webpackChunkName: "@atlaskit-internal_icon-code" */ '@atlaskit/icon/glyph/editor/code'
			).then((mod) => mod.default),
	},
	modules: {
		quickInsert,
		nodes,
		fields: {
			custom: {
				'mock-resolver': {
					resolver: mockFieldResolver,
				},
			},
			fieldset: {
				cql: {
					serializer: cqlSerializer,
					deserializer: cqlDeserializer,
				},
			},
			user: {
				'user-jdog-provider': {
					// Ignored via go/ees005
					// eslint-disable-next-line require-await
					provider: async () => {
						return {
							siteId: '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5',
							principalId: 'Context',
							fieldId: 'storybook',
							productKey: 'jira',
						};
					},
				},
			},
		},
	},
};

export default manifest;
