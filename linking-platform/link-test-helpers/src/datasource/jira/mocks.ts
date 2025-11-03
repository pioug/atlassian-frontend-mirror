import { defaults } from '@atlaskit/json-ld-types';
import {
	type DatasourceDataResponseItem,
	type DatasourceDetailsResponse,
	type DatasourceResponseSchemaProperty,
	type RichText,
	type StatusType,
	type User,
} from '@atlaskit/linking-types';

import { YouTubeVideoUrl } from '../../index';
import { type GenerateDataResponse } from '../types';

import { defaultInitialVisibleColumnKeys, mockJiraData } from './data';

export { defaultInitialVisibleColumnKeys };

const columns: DatasourceResponseSchemaProperty[] = [
	{
		key: 'id',
		title: '',
		type: 'string',
	},
	{
		key: 'key',
		title: 'Key',
		type: 'link',
	},
	{
		key: 'type',
		type: 'icon',
		title: 'Type',
	},
	{
		key: 'summary',
		title: 'Summary',
		type: 'string',
	},
	{
		key: 'link',
		title: 'Link',
		type: 'link',
	},
	{
		key: 'description',
		title: 'Description',
		type: 'richtext',
	},
	{
		key: 'assignee',
		title: 'Assignee',
		type: 'user',
	},
	{
		key: 'people',
		title: 'People',
		type: 'user',
		isList: true,
	},
	{
		key: 'priority',
		title: 'Priority',
		type: 'icon',
	},
	{
		key: 'labels',
		title: 'Labels',
		type: 'tag',
		isList: true,
	},
	{
		key: 'status',
		title: 'Status for each issue',
		type: 'status',
	},
	{
		key: 'created',
		title: 'Date of Creation for each issue',
		type: 'date',
	},
	{
		key: 'due',
		title: 'Due Date',
		type: 'date',
	},
	...new Array<DatasourceResponseSchemaProperty>(100)
		.fill({
			key: 'due',
			title: 'Due Date',
			type: 'date',
		})
		.map((prop, i) => ({ ...prop, key: prop.key + i, title: prop.title + i })),
];

const defaultDetailsResponse: DatasourceDetailsResponse = {
	meta: {
		access: 'granted',
		auth: [],
		definitionId: 'object-resolver-service',
		destinationObjectTypes: ['issue'],
		objectTypesEntity: 'work-item',
		extensionKey: 'jira-object-provider',
		providerName: 'Jira',
		product: 'jira',
		visibility: 'restricted',
	},
	data: {
		ari: 'ari:cloud:linking-platform:datasource/12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
		id: '12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
		name: 'JQL Datasource',
		description: 'Fetches Issues using JQL',
		parameters: [
			{
				key: 'cloudId',
				type: 'string',
				description: 'Cloud Id',
			},
			{
				key: 'jql',
				type: 'string',
				description: 'JQL query to retrieve list of issues',
			},
		],
		schema: {
			properties: columns,
			defaultProperties: defaultInitialVisibleColumnKeys,
		},
	},
};

const resolveJqlSuccess = {
	body: {
		meta: defaults.meta.granted,
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			generator: {
				'@type': 'Application',
				'@id': 'https://www.atlassian.com/#Jira',
				name: 'Jira',
			},
			'@type': ['Document', 'Object'],
			url: 'https://a4t-moro.jira-dev.com/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
			name: '0 Issues',
			summary: "JQL Query: 'created >= -30d order by created DESC'",
		},
		datasources: [
			{
				key: 'datasource-jira-issues',
				parameters: {
					jql: 'created >= -30d order by created DESC',
					cloudId: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
				},
				id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
				ari: 'ari:cloud:linking-platform::datasource/d8b75300-dfda-4519-b6cd-e49abbd50401',
				description: 'For extracting a list of Jira issues using JQL',
				name: 'Jira issues',
			},
		],
	},
	status: 200,
};

export const generateResolveResponse = (resourceUrl: string) => {
	const url = new URL(resourceUrl);
	if (url.search.includes('jql=')) {
		return resolveJqlSuccess;
	}
};

export const generateDetailsResponse = (
	initialColumnKeys: string[],
): DatasourceDetailsResponse => ({
	...defaultDetailsResponse,
	meta: {
		...defaultDetailsResponse.meta,
		schema: {
			...defaultDetailsResponse.meta.schema,
			defaultProperties: initialColumnKeys,
		},
	},
});

const buildDataResponse = ({
	cloudId = '',
	maxItems = 99,
	numberOfLoads = 0,
	includeSchema,
	initialVisibleColumnKeys,
	isUnauthorized = false,
	includeAuthInfo = false,
	includeUnsupportedLinks = true,
}: Parameters<GenerateDataResponse>[0] & {
	includeAuthInfo?: boolean;
	includeUnsupportedLinks?: boolean;
	isUnauthorized?: boolean;
	maxItems?: number;
}): ReturnType<GenerateDataResponse> => {
	const schema = {
		properties: defaultDetailsResponse.data.schema.properties.filter(({ key }) => {
			return initialVisibleColumnKeys.includes(key);
		}),
	};

	return {
		meta: {
			access: isUnauthorized ? 'unauthorized' : 'granted',
			providerName: 'Amplitude',
			auth: includeAuthInfo
				? [
						{
							key: 'amplitude',
							displayName: 'Atlassian Links - Amplitude',
							url: 'https://id.atlassian.com/login',
						},
					]
				: [],
			definitionId: 'object-resolver-service',
			destinationObjectTypes: ['issue'],
			objectTypesEntity: 'work-item',
			key: 'jira-object-provider',
			product: 'jira',
			visibility: 'restricted',
		},
		data: {
			items: mockJiraData.data.slice(0, maxItems).map((item, idx): DatasourceDataResponseItem => {
				return {
					ari: {
						data: item.ari.data + numberOfLoads,
					},
					// Fake identifier attribute that is a primitive value.
					// Adding number of pages to make all issueNumbers unique
					id: {
						data: item.issueNumber + numberOfLoads,
					},
					type: {
						data: { source: item.type.source, label: item.type.label },
					},
					key: {
						data: {
							url: item.link,
							text: item.issueNumber + numberOfLoads,
							style: {
								appearance: 'key',
							},
						},
					},
					description: idx % 2 === 0 ? adfSample : adfTableSample,
					link: {
						data: {
							url:
								idx === 0
									? 'https://link-that-is-not-found.com/long'
									: idx === 1
										? 'https://link-that-is-forbidden.com'
										: idx % 10 === 0
											? includeUnsupportedLinks
												? 'https://link-that-is-unsupported.com'
												: 'https://link-that-is-forbidden.com'
											: idx % 5 === 0
												? 'https://link-that-does-not-resolve.com'
												: idx % 4 === 0
													? 'https://link-that-is-unauthorized.com'
													: idx % 3 === 0
														? 'https://link-that-is-still-resolving.com/long-url/very-very-very-very-very-very-very-long'
														: item.link,
							text: idx % 2 === 1 && idx > 10 ? `[${cloudId}] ${item.summary}` : undefined,
						},
					},
					summary: {
						data: item.summary,
					},
					assignee: {
						data: {
							displayName: item.assignee?.displayName,
							avatarSource: item.assignee?.source,
						},
					},
					people: {
						data: (item.people || []) as User[],
					},
					priority: {
						data: {
							source: item.priority.source,
							label: item.priority.label,
							text: item.priority.text,
						},
					},
					status: {
						data: {
							text: item.status.text,
							style: {
								appearance: item?.status?.status,
							},
						} as StatusType['value'],
					},
					created: {
						data: item.created,
					},
					due: {
						data: item.due,
					},
					projectId: {
						data: item.project.id,
					},
					...(item.labels?.length && {
						labels: {
							data: item.labels.map((label) => ({ text: label })),
						},
					}),
				};
			}),
			totalCount: maxItems === 0 || maxItems === 1 ? maxItems : mockJiraData.totalIssues,
			nextPageCursor: numberOfLoads < 4 && maxItems > 1 ? 'c3RhcnRBdD01' : undefined,
			...(includeSchema && { schema }),
		},
	};
};

export const generateDataResponse: GenerateDataResponse = ({
	cloudId = '',
	numberOfLoads = 0,
	includeSchema,
	initialVisibleColumnKeys,
}) => {
	if (cloudId === '11111') {
		return buildDataResponse({
			cloudId,
			maxItems: 1,
			numberOfLoads,
			includeSchema,
			initialVisibleColumnKeys,
		});
	} else if (cloudId === '22222') {
		return buildDataResponse({
			cloudId,
			maxItems: 0,
			numberOfLoads,
			includeSchema,
			initialVisibleColumnKeys,
		});
	} else if (cloudId === '33333') {
		throw new Error('Mock error');
	} else if (cloudId === '44444') {
		return buildDataResponse({
			cloudId,
			numberOfLoads,
			includeSchema,
			isUnauthorized: true,
			initialVisibleColumnKeys,
		});
	} else if (cloudId === '1234') {
		return buildDataResponse({
			cloudId,
			numberOfLoads,
			includeSchema,
			isUnauthorized: true,
			initialVisibleColumnKeys,
			includeAuthInfo: true,
		});
		// unsupported links with thrown errors will break atlaskit docs examples
	} else if (cloudId === 'doc-cloudId') {
		return buildDataResponse({
			cloudId,
			numberOfLoads,
			includeSchema,
			initialVisibleColumnKeys,
			includeUnsupportedLinks: false,
		});
	} else {
		return buildDataResponse({
			cloudId,
			numberOfLoads,
			includeSchema,
			initialVisibleColumnKeys,
		});
	}
};

const adfTableSample = {
	data: {
		type: 'adf',
		text: JSON.stringify({
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'table',
					attrs: {
						layout: 'full-width',
					},
					content: [
						{
							type: 'tableRow',
							content: [
								{
									type: 'tableHeader',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Header content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableHeader',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Header content 2',
												},
											],
										},
									],
								},
								{
									type: 'tableHeader',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Header content 3',
												},
											],
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
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 2',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 3',
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					type: 'table',
					attrs: {
						layout: 'wide',
					},
					content: [
						{
							type: 'tableRow',
							content: [
								{
									type: 'tableHeader',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Header content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableHeader',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Header content 2',
												},
											],
										},
									],
								},
								{
									type: 'tableHeader',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Header content 3',
												},
											],
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
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									content: [
										{
											type: 'mediaSingle',
											attrs: {
												layout: 'center',
											},
											content: [
												{
													type: 'media',
													attrs: {
														type: 'external',
														url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
													},
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 3',
												},
											],
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
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'bodied-eh',
						parameters: {
							macroParams: {},
							macroMetadata: {
								macroId: {
									value: 1532948101320,
								},
								placeholder: {
									'0': {
										data: {
											url: '',
										},
										type: 'icon',
									},
								},
							},
						},
						layout: 'wide',
					},
					content: [
						{
							type: 'table',
							attrs: {
								layout: 'full-width',
							},
							content: [
								{
									type: 'tableRow',
									content: [
										{
											type: 'tableHeader',
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Header content 1',
														},
													],
												},
											],
										},
										{
											type: 'tableHeader',
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Header content 2',
														},
													],
												},
											],
										},
										{
											type: 'tableHeader',
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Header content 3',
														},
													],
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
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'This table is inside a bodied extension.',
														},
													],
												},
											],
										},
										{
											type: 'tableCell',
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Body content 2',
														},
													],
												},
											],
										},
										{
											type: 'tableCell',
											content: [
												{
													type: 'paragraph',
													content: [
														{
															type: 'text',
															text: 'Body content 3',
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
				},
				{
					type: 'table',
					attrs: {
						isNumberColumnEnabled: true,
						layout: 'default',
					},
					content: [
						{
							type: 'tableRow',
							content: [
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 2',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 3',
												},
											],
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
											content: [
												{
													type: 'text',
													text: 'Body content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 2',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 3',
												},
											],
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
											content: [
												{
													type: 'text',
													text: 'Body content 1',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 2',
												},
											],
										},
									],
								},
								{
									type: 'tableCell',
									attrs: {},
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Body content 3',
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
		}),
	},
};

const adfSample: { data: RichText } = {
	data: {
		type: 'adf',
		text: JSON.stringify({
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'panel',
					attrs: {
						panelType: 'info',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'normal info panel',
								},
							],
						},
					],
				},
				{
					type: 'panel',
					attrs: {
						panelType: 'custom',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'custom - missing defaults',
								},
							],
						},
					],
				},
				{
					type: 'panel',
					attrs: {
						panelType: 'custom',
						panelColor: '#34eb6e',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'custom - only background',
								},
							],
						},
					],
				},
			],
		}),
		html: `<ul>\n\t<li><del>Talk with Stan</del></li>\n\t<li>-Do another spike with -\n\t<ul>\n\t\t<li><del>Media resolved</del></li>\n\t\t<li>Mentions resolved</li>\n\t\t<li>Emojis resolved</li>\n\t</ul>\n\t</li>\n</ul>\n\n\n\n\n<p><b>bold</b>, <em>italic</em>, <ins>underlined</ins>, <del>strikethrough</del>, <sup>superscript</sup>, and <sub>subscript</sub>. </p>\n\n<h1><a name=\"Heading1bolditalic\"></a>Heading 1 <b>bold</b> <em>italic</em> <font color=\"#bf2600\">colored</font></h1>\n\n<h2><a name=\"Heading2bolditalic\"></a>Heading 2 <b>bold</b> <em>italic</em> <font color=\"#bf2600\">colored</font></h2>\n\n<h4><a name=\"Heading3bolditalic\"></a>Heading 3 <b>bold</b> <em>italic</em></h4>\n\n<h4><a name=\"Heading4bolditalic\"></a>Heading 4 <b>bold</b> <em>italic</em></h4>\n\n<p>Smart links:<a href=\"${YouTubeVideoUrl}\" title=\"smart-link\" class=\"external-link\" rel=\"nofollow noreferrer\">${YouTubeVideoUrl}</a> </p>\n\n<p><a href=\"https://hello.jira.atlassian.cloud/browse/NAVX-2016\" title=\"smart-card\" class=\"external-link\" rel=\"nofollow noreferrer\">https://hello.jira.atlassian.cloud/browse/NAVX-2016</a></p>\n\n<p><a href=\"https://hello.jira.atlassian.cloud/browse/NAVX-2016\" title=\"smart-embed\" class=\"external-link\" rel=\"nofollow noreferrer\">https://hello.jira.atlassian.cloud/browse/NAVX-2016</a></p>\n\n<p><a href=\"https://hello.atlassian.net/issues/?jql=parent%3DNAVX-1835%20ORDER%20BY%20rank\" title=\"smart-card\" class=\"external-link\" rel=\"nofollow noreferrer\">https://hello.atlassian.net/issues/?jql=parent%3DNAVX-1835%20ORDER%20BY%20rank</a></p>\n\n<ul>\n\t<li>bullet point <font color=\"#bf2600\">color</font> <b>bold</b> <em>italic</em></li>\n\t<li>second point\n\t<ul>\n\t\t<li>another one deeper</li>\n\t</ul>\n\t</li>\n</ul>\n\n\n<ol>\n\t<li>numbered list item</li>\n\t<li>another one\n\t<ol>\n\t\t<li>subpoint <font color=\"#bf2600\">color</font> <b>bold</b> <em>italic</em></li>\n\t</ol>\n\t</li>\n</ol>\n\n\n<blockquote><p>This blockquote contains a <b>rich list</b>:</p>\n\n<ul>\n\t<li>First item with <b>bold text</b></li>\n\t<li>Second item with <em>italic text</em></li>\n\t<li>Third item with a <a href=\"https://www.atlassian.com/\" class=\"external-link\" rel=\"nofollow noreferrer\"><ins>link</ins></a></li>\n</ul>\n</blockquote>\n\n<p><font color=\"#FF5630\"><b>[ MY STATUS ]</b></font> <font color=\"#00B8D9\"><b>[ MY STATUS ]</b></font> <font color=\"#36B37E\"><b>[ MY STATUS ]</b></font> </p>\n\n<p><tt>2025-09-17</tt></p>\n\n<ul>\n\t<li>Action item</li>\n\t<li><del>Done action item</del>\n\t<ul>\n\t\t<li>Intended action item</li>\n\t</ul>\n\t</li>\n</ul>\n\n\n<ul>\n\t<li>&lt;&gt; Decision to be made</li>\n</ul>\n\n\n<div class=\"panel\" style=\"background-color: #fffae6;border-width: 1px;\"><div class=\"panelContent\" style=\"background-color: #fffae6;\">\n<p>warning panel <b>bold</b> <em>italic</em> <font color=\"#bf2600\"><em>colored</em></font></p>\n\n<p>second line</p>\n</div></div>\n\n<div class=\"panel\" style=\"background-color: #deebff;border-width: 1px;\"><div class=\"panelContent\" style=\"background-color: #deebff;\">\n<p>info panel</p>\n</div></div>\n\n<p>Here are some <tt>inline code</tt> examples</p>\n\n<div class=\"code panel\" style=\"border-width: 1px;\"><div class=\"codeContent panelContent\">\n<pre class=\"code-javascript\"><span class=\"code-comment\">// Create a map.\n</span><span class=\"code-keyword\">final</span> IntIntOpenHashMap map = <span class=\"code-keyword\">new</span> IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);\n<span class=\"code-keyword\"><span class=\"code-object\">int</span></span> count = map.forEach(<span class=\"code-keyword\">new</span> IntIntProcedure()\n{\n   <span class=\"code-keyword\"><span class=\"code-object\">int</span></span> count;\n   <span class=\"code-keyword\">public</span> <span class=\"code-keyword\">void</span> apply(<span class=\"code-keyword\"><span class=\"code-object\">int</span></span> key, <span class=\"code-keyword\"><span class=\"code-object\">int</span></span> value)\n   {\n       <span class=\"code-keyword\">if</span> (value &gt;= 5) count++;\n   }\n}).count;\n<span class=\"code-object\">System</span>.out.println(<span class=\"code-quote\">\"There are \"</span> + count + <span class=\"code-quote\">\" values &gt;= 5\"</span>);</pre>\n</div></div>\n\n<p>Emoji: 😄 :custom_test: </p>\n\n<p>Mention: <a href=\"https://hello.atlassian.net/secure/ViewProfile.jspa?accountId=557057%3Af9c4fdc8-455d-420f-b13d-18ff5a18b5c1\" class=\"user-hover\" rel=\"557057:f9c4fdc8-455d-420f-b13d-18ff5a18b5c1\" data-account-id=\"557057:f9c4fdc8-455d-420f-b13d-18ff5a18b5c1\" accountid=\"557057:f9c4fdc8-455d-420f-b13d-18ff5a18b5c1\" rel=\"noreferrer\">Aleksandr Sasha Motsjonov</a> </p>\n\n<p>Media single:</p>\n\n<p><span class=\"image-wrap\" style=\"\"><img src=\"/rest/api/3/attachment/content/2751749\" alt=\"I00048.JPG\" width=\"694\" style=\"border: 0px solid black\" /></span></p>\n\n<p><b>Expand title blah</b></p>\n\n<ol>\n\t<li>numbered list item</li>\n\t<li>another one\n\t<ol>\n\t\t<li>subpoint <font color=\"#bf2600\">color</font> <b>bold</b> <em>italic</em></li>\n\t</ol>\n\t</li>\n</ol>\n\n\n<!-- ADF macro (type = 'table') -->\n\n<p>divider: </p>\n\n<hr />`,
	},
};
