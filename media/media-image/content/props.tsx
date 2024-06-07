import React from 'react';
import { md, PropsTable } from '@atlaskit/docs';

export const mediaImageProps = {
	kind: 'program',
	component: {
		kind: 'generic',
		value: {
			kind: 'object',
			members: [
				{
					kind: 'property',
					optional: false,
					key: {
						kind: 'id',
						name: 'identifier',
					},
					value: {
						kind: 'generic',
						value: {
							kind: 'import',
							importKind: 'value',
							name: 'FileIdentifier',
							moduleSpecifier: '@atlaskit/media-client',
						},
					},
					leadingComments: [
						{
							type: 'commentBlock',
							value: 'Instance of file identifier',
							raw: '* Instance of file identifier ',
						},
					],
					trailingComments: [
						{
							type: 'commentBlock',
							value: 'Instance of Media MediaClientConfig',
							raw: '* Instance of Media MediaClientConfig ',
						},
					],
				},
				{
					kind: 'property',
					optional: false,
					key: {
						kind: 'id',
						name: 'mediaClientConfig',
					},
					value: {
						kind: 'generic',
						value: {
							kind: 'import',
							importKind: 'value',
							name: 'MediaClientConfig',
							moduleSpecifier: '@atlaskit/media-client',
						},
					},
					leadingComments: [
						{
							type: 'commentBlock',
							value: 'Instance of Media MediaClientConfig',
							raw: '* Instance of Media MediaClientConfig ',
						},
					],
					trailingComments: [
						{
							type: 'commentBlock',
							value: 'Media API Configuration object',
							raw: '* Media API Configuration object ',
						},
					],
				},
				{
					kind: 'property',
					optional: true,
					key: {
						kind: 'id',
						name: 'apiConfig',
					},
					value: {
						kind: 'generic',
						value: {
							kind: 'import',
							importKind: 'value',
							name: 'MediaStoreGetFileImageParams',
							moduleSpecifier: '@atlaskit/media-client',
						},
					},
					leadingComments: [
						{
							type: 'commentBlock',
							value: 'Media API Configuration object',
							raw: '* Media API Configuration object ',
						},
					],
					trailingComments: [
						{
							type: 'commentBlock',
							value: 'Render props returning `MediaImageChildrenProps` data structure',
							raw: '* Render props returning `MediaImageChildrenProps` data structure ',
						},
					],
					default: {
						kind: 'object',
						members: [],
					},
				},
				{
					kind: 'property',
					optional: false,
					key: {
						kind: 'id',
						name: 'children',
					},
					value: {
						kind: 'generic',
						value: {
							kind: 'function',
							returnType: {
								kind: 'generic',
								value: {
									kind: 'import',
									importKind: 'value',
									name: 'ReactNode',
									moduleSpecifier: 'react',
								},
							},
							parameters: [
								{
									kind: 'param',
									value: {
										kind: 'id',
										name: 'props',
									},
									type: null,
								},
							],
						},
					},
					leadingComments: [
						{
							type: 'commentBlock',
							value: 'Render props returning `MediaImageChildrenProps` data structure',
							raw: '* Render props returning `MediaImageChildrenProps` data structure ',
						},
					],
					trailingComments: [
						{
							type: 'commentBlock',
							value: 'Server-Side-Rendering modes are "server" and "client"',
							raw: '* Server-Side-Rendering modes are "server" and "client" ',
						},
					],
				},
				{
					kind: 'property',
					optional: true,
					key: {
						kind: 'id',
						name: 'ssr',
					},
					value: {
						kind: 'generic',
						value: {
							kind: 'import',
							importKind: 'value',
							name: 'SSR',
							moduleSpecifier: '@atlaskit/media-common',
						},
					},
					leadingComments: [
						{
							type: 'commentBlock',
							value: 'Server-Side-Rendering modes are "server" and "client"',
							raw: '* Server-Side-Rendering modes are "server" and "client" ',
						},
					],
				},
			],
			referenceIdName: 'MediaImageInternalProps',
		},
		name: {
			kind: 'id',
			name: 'MediaImageInternal',
			type: null,
		},
	},
};

export default md`
  ${(<PropsTable heading="MediaImage Props" props={mediaImageProps} />)}
`;
