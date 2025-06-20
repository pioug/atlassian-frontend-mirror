import React, { type ChangeEvent } from 'react';
import RendererDemo from './helper/RendererDemo';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import { IntlProvider } from 'react-intl-next';

const ADF_STAGE0 = 'stage0';
const ADF_FINAL = 'final';

export default function Example() {
	const [adfStage, setAdfStage] = React.useState<ADFStage>(ADF_FINAL);
	const schema = getSchemaBasedOnStage(adfStage);

	const onSchemaToggle = (event: ChangeEvent<HTMLInputElement>) => {
		setAdfStage(event.currentTarget.checked ? ADF_STAGE0 : ADF_FINAL);
	};

	const toggleCheckbox = (
		<label>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
			<input type="checkbox" checked={adfStage === ADF_STAGE0} onChange={onSchemaToggle} />
			Use stage0 (experimental) document schema
		</label>
	);

	const doc = {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'table',
				attrs: {
					isNumberColumnEnabled: false,
					layout: 'default',
					localId: 'a0eaf0ad-5d13-4a2d-97bb-5f014338dba1',
					width: 760,
				},
				content: [
					{
						type: 'tableRow',
						content: [
							{
								type: 'tableHeader',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableHeader',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableHeader',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
						],
					},
					{
						type: 'tableRow',
						content: [
							{
								type: 'tableCell',
								attrs: {},
								content: [
									{
										type: 'extension',
										attrs: {
											extensionType: 'com.atlassian.confluence.migration',
											extensionKey: 'nested-table',
											parameters: {
												adf: '{"type":"doc","version":1,"content":[{"type":"table","attrs":{"isNumberColumnEnabled":false,"layout":"default","localId":"a25f0da8-eef7-4e1c-8ec8-a1a1a95db0a9","width":760},"content":[{"type":"tableRow","content":[{"type":"tableHeader","attrs":{},"content":[{"type":"paragraph","content":[]}]},{"type":"tableHeader","attrs":{},"content":[{"type":"paragraph","content":[]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{},"content":[{"type":"paragraph","content":[]}]},{"type":"tableCell","attrs":{},"content":[{"type":"paragraph","content":[]}]}]}]}]}',
											},
										},
									},
								],
							},
							{
								type: 'tableCell',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableCell',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
						],
					},
					{
						type: 'tableRow',
						content: [
							{
								type: 'tableCell',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableCell',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
							{
								type: 'tableCell',
								attrs: {},
								content: [
									{
										type: 'paragraph',
										content: [],
									},
								],
							},
						],
					},
				],
			},
			{
				type: 'bodiedExtension',
				attrs: {
					extensionKey: 'bodied-eh',
					extensionType: 'com.atlassian.confluence.macro.core',
					parameters: {
						macroParams: {},
						macroMetadata: {
							placeholder: [
								{
									data: {
										url: '',
									},
									type: 'icon',
								},
							],
						},
					},
					layout: 'default',
					localId: 'testId',
				},
				content: [
					{
						type: 'table',
						attrs: {
							isNumberColumnEnabled: false,
							layout: 'default',
							localId: '3d19c592-eb3c-4b86-b530-83e3c08947dc',
							width: 760,
						},
						content: [
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableHeader',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
									{
										type: 'tableHeader',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
									{
										type: 'tableHeader',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
								],
							},
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'extension',
												attrs: {
													extensionType: 'com.atlassian.confluence.migration',
													extensionKey: 'nested-table',
													parameters: {
														adf: '{"type":"doc","version":1,"content":[{"type":"table","attrs":{"isNumberColumnEnabled":false,"layout":"default","localId":"135f0951-208d-4e29-9786-c1289e080320","width":760},"content":[{"type":"tableRow","content":[{"type":"tableHeader","attrs":{},"content":[{"type":"paragraph","content":[]}]},{"type":"tableHeader","attrs":{},"content":[{"type":"paragraph","content":[]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{},"content":[{"type":"paragraph","content":[]}]},{"type":"tableCell","attrs":{},"content":[{"type":"paragraph","content":[]}]}]}]}]}',
													},
												},
											},
										],
									},
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
								],
							},
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
									{
										type: 'tableCell',
										attrs: {},
										content: [
											{
												type: 'paragraph',
												content: [],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	};

	return (
		<SmartCardProvider client={new CardClient('staging')}>
			<IntlProvider locale={'en'}>
				<RendererDemo
					document={doc}
					allowColumnSorting
					allowSelectAllTrap
					allowWrapCodeBlock
					allowCopyToClipboard
					serializer="react"
					adfStage={adfStage}
					schema={schema}
					actionButtons={toggleCheckbox}
					withProviders
					useSpecBasedValidator
					withExtension
				/>
			</IntlProvider>
		</SmartCardProvider>
	);
}
