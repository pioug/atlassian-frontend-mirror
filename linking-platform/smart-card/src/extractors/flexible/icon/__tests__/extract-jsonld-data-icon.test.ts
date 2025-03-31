import { type JsonLd } from '@atlaskit/json-ld-types';

import { IconType } from '../../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../../constants';
import extractDocumentTypeIcon from '../extract-document-type-icon';
import extractJsonldDataIcon from '../extract-jsonld-data-icon';

const itIf = (condition: boolean) => (condition ? it : it.skip);
const isDocument = (type: string) => type === 'Document';

describe('extractJsonldDataIcon', () => {
	const baseData: JsonLd.Data.BaseData = {
		'@type': 'Object',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		url: 'https://some-url.com',
	};

	it.each([
		['Document', undefined, undefined],
		['schema:BlogPosting', IconType.Blog, 'Blog'],
		['schema:DigitalDocument', IconType.File, 'File'],
		['schema:TextDigitalDocument', IconType.Document, 'Document'],
		['schema:PresentationDigitalDocument', IconType.Presentation, 'Presentation'],
		['schema:SpreadsheetDigitalDocument', IconType.Spreadsheet, 'Spreadsheet'],
		['atlassian:Template', IconType.Template, 'Template'],
		['atlassian:UndefinedLink', IconType.Document, 'Undefined link'],
		['atlassian:Task', IconType.Task, 'Task'],
		['atlassian:Project', IconType.Project, 'Project'],
		['atlassian:SourceCodeCommit', IconType.Commit, 'Commit'],
		['atlassian:SourceCodePullRequest', IconType.PullRequest, 'Pull request'],
		['atlassian:SourceCodeReference', IconType.Branch, 'Reference'],
		['atlassian:SourceCodeRepository', IconType.Repo, 'Repository'],
		['unknown-type', undefined, undefined],
	])('returns icon descriptor for type %s', (type, expectedIconType, expectedLabel) => {
		const data: JsonLd.Data.BaseData = {
			...baseData,
			'@type': type as JsonLd.Primitives.ObjectType,
		};
		const { icon, label } = extractJsonldDataIcon(data) || {};

		expect(icon).toBe(expectedIconType);
		expect(label).toBe(expectedLabel);
	});

	describe('priority', () => {
		it('returns icon for singular type', () => {
			const data: JsonLd.Data.BaseData = {
				...baseData,
				'@type': 'schema:BlogPosting',
			};
			const { icon } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.Blog);
		});

		it('returns highest priority icon from array of types', () => {
			const data: JsonLd.Data.BaseData = {
				...baseData,
				'@type': ['Document', 'schema:BlogPosting'],
			};
			const { icon } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.Blog);
		});

		it('returns highest priority icon based on priority', () => {
			const expectUrl = 'https://some-icon-url.com';
			const data: JsonLd.Data.BaseData = {
				...baseData,
				'@type': ['Document', 'schema:BlogPosting'],
				icon: expectUrl,
				generator: {
					'@type': 'Object',
					url: 'https://some-url.com',
					name: 'name',
					icon: expectUrl,
					image: 'https://some-image-url.com',
				},
			};
			const { icon, url } = extractJsonldDataIcon(data) || {};

			expect(icon).toBeUndefined();
			expect(url).toBe(expectUrl);
		});
	});

	const docTypes: (JsonLd.Primitives.ObjectType | 'atlassian:Template')[][] = [
		['Document'],
		['schema:BlogPosting'],
		['schema:DigitalDocument'],
		['schema:TextDigitalDocument'],
		['schema:PresentationDigitalDocument'],
		['schema:SpreadsheetDigitalDocument'],
		['atlassian:Template'],
		['atlassian:UndefinedLink'],
	];

	describe.each(docTypes)(
		'when type is %s',
		(type: JsonLd.Primitives.ObjectType | 'atlassian:Template') => {
			const baseTypeData = {
				...baseData,
				'@type': type,
			};

			describe('provider is Confluence (native)', () => {
				it('still returns url icon when url icon, file format icon, document icon and provider icon are defined', () => {
					const providerIconUrl = 'https://some-provider-icon-url.com';
					const backendIconUrl = 'https://backend-jsonld-icon-url.com';
					const data = {
						...baseTypeData,
						icon: backendIconUrl,
						generator: {
							'@type': 'Object',
							'@id': CONFLUENCE_GENERATOR_ID,
							icon: providerIconUrl,
						},
						'schema:fileFormat': 'image/png',
					} as JsonLd.Data.BaseData;
					const { url } = extractJsonldDataIcon(data) || {};
					expect(url).toBe(backendIconUrl);
				});
			});

			describe.each([
				['Confluence', CONFLUENCE_GENERATOR_ID, IconType.Confluence],
				['Jira', JIRA_GENERATOR_ID, IconType.Jira],
			])('provider is %s', (_, provider, providerIcon) => {
				it('returns file format icon - file format icon is defined', () => {
					const data = {
						...baseTypeData,
						generator: { '@type': 'Object', '@id': provider },
						'schema:fileFormat': 'image/png',
					} as JsonLd.Data.BaseData;
					const { icon } = extractJsonldDataIcon(data) || {};

					expect(icon).toBe(IconType.Image);
				});

				itIf(!isDocument(type))('returns document icon - document icon is defined', () => {
					const data = {
						...baseTypeData,
						generator: { '@type': 'Object', '@id': provider },
						'schema:fileFormat': undefined,
					} as JsonLd.Data.BaseData;
					const { icon: iconType } = extractJsonldDataIcon(data) || {};
					const { icon: documentIconType } =
						extractDocumentTypeIcon(type, undefined, provider) || {};

					expect(iconType).toBe(documentIconType);
				});

				itIf(isDocument(type))('returns provider icon - default fallback icon', () => {
					const data = {
						...baseTypeData,
						generator: { '@type': 'Object', '@id': provider },
						'schema:fileFormat': undefined,
					} as JsonLd.Data.BaseData;
					const { icon } = extractJsonldDataIcon(data) || {};

					expect(icon).toBe(providerIcon);
				});
			});

			describe('provider is not native', () => {
				const providerIconUrl = 'https://some-provider-icon-url.com';

				it('returns provider icon - provider icon defined', () => {
					const data = {
						...baseData,
						'@type': type,
						icon: providerIconUrl,
						generator: {
							'@type': 'Object',
							'@id': 'some-provider',
							icon: providerIconUrl,
						},
						'schema:fileFormat': 'image/png',
					} as JsonLd.Data.BaseData;

					const { icon, url } = extractJsonldDataIcon(data) || {};

					expect(icon).toBeUndefined();
					expect(url).toBe(providerIconUrl);
				});

				it('returns file format icon - file format icon defined', () => {
					const data = {
						...baseData,
						'@type': type,
						generator: {
							'@type': 'Object',
							'@id': 'some-provider',
							icon: undefined,
						},
						'schema:fileFormat': 'image/png',
					} as JsonLd.Data.BaseData;

					const { icon } = extractJsonldDataIcon(data) || {};

					expect(icon).toBe(IconType.Image);
				});

				it('returns document icon - default fallback icon', () => {
					const data = {
						...baseData,
						'@type': type,
						generator: {
							'@type': 'Object',
							'@id': 'some-provider',
							icon: undefined,
						},
						'schema:fileFormat': undefined,
					} as JsonLd.Data.BaseData;

					const { icon: iconType } = extractJsonldDataIcon(data) || {};
					const { icon: documentIconType } = extractDocumentTypeIcon(type) || {};

					expect(iconType).toBe(documentIconType);
				});
			});
			const providerIconUrl = 'https://some-provider-icon-url.com';
			const backendIconUrl = 'https://backend-jsonld-icon-url.com';
			describe('provider is not native', () => {
				it('returns url icon when it is defined', () => {
					const data = {
						...baseData,
						'@type': type,
						icon: backendIconUrl,
						generator: {
							'@type': 'Object',
							'@id': 'some-provider',
							icon: undefined,
						},
						'schema:fileFormat': 'image/png',
						url: undefined,
					} as JsonLd.Data.BaseData;

					const { icon, url } = extractJsonldDataIcon(data) || {};

					expect(icon).toBeUndefined();
					expect(url).toBe(backendIconUrl);
				});
				it('returns file format icon when it is defined and icon url is undefined', () => {
					const data = {
						...baseData,
						'@type': type,
						generator: {
							'@type': 'Object',
							'@id': 'someprovider',
							icon: undefined,
						},
						'schema:fileFormat': 'image/png',
						url: undefined,
					} as JsonLd.Data.BaseData;

					const { icon } = extractJsonldDataIcon(data) || {};

					expect(icon).toBe(IconType.Image);
				});

				it('returns file format icon when url icon is undefined', () => {
					const data = {
						...baseData,
						'@type': type,
						generator: {
							'@type': 'Object',
						},
						url: undefined,
						'schema:fileFormat': 'image/png',
					} as JsonLd.Data.BaseData;

					const { icon, url } = extractJsonldDataIcon(data) || {};
					expect(icon).toBe(IconType.Image);
					expect(url).toBe(undefined);
				});

				it('returns provider icon when icon url, fileFormat, and document type are undefined', () => {
					const data = {
						...baseData,
						generator: {
							'@type': 'Object',
							'@id': 'some-provider',
							icon: providerIconUrl,
						},
					} as JsonLd.Data.BaseData;

					const { icon, url } = extractJsonldDataIcon(data) || {};
					expect(url).toBe(providerIconUrl);
					expect(icon).toBeUndefined();
				});

				itIf(extractDocumentTypeIcon(type) !== undefined)(
					'returns document type icon when type is recognised but provider, icon url and file format are undefined',
					() => {
						const data: JsonLd.Data.BaseData = {
							...baseData,
							'@type': type,
							generator: {
								'@id': 'some-provider',
								icon: undefined,
							},
						} as JsonLd.Data.BaseData;
						const { icon: iconType } = extractJsonldDataIcon(data) || {};

						const { icon: documentIconType } = extractDocumentTypeIcon(type) || {};

						expect(iconType).toBe(documentIconType);
					},
				);

				itIf(extractDocumentTypeIcon(type) === undefined)(
					'returns no icon when when provider, icon url, file format is undefined and document type is not recognised',
					() => {
						const data = {
							...baseData,
							generator: {
								'@type': 'Object',
								'@id': 'some-provider',
							},
						} as JsonLd.Data.BaseData;

						const { icon, url } = extractJsonldDataIcon(data) || {};

						expect(url).toBeUndefined();
						expect(icon).toBeUndefined();
					},
				);
			});

			it('returns no icon when when icon url, fileFormat, document type and generator url are undefined', () => {
				const data = {
					...baseData,
					generator: {
						'@type': 'Object',
						'@id': 'some-provider',
					},
				} as JsonLd.Data.BaseData;

				const { icon, url } = extractJsonldDataIcon(data) || {};

				expect(url).toBeUndefined();
				expect(icon).toBeUndefined();
			});

			it('returns document icon url when url icon and fileFormat is undefined', () => {
				const data = {
					...baseData,
					'@type': type,
					generator: {
						'@type': 'Object',
						'@id': 'some-provider',
						icon: undefined,
					},
					url: undefined,
					'schema:fileFormat': undefined,
				} as JsonLd.Data.BaseData;

				const { icon: iconType } = extractJsonldDataIcon(data) || {};
				const { icon: documentIconType } = extractDocumentTypeIcon(type) || {};

				expect(iconType).toBe(documentIconType);
			});
		},
	);

	describe('provider-specific JSON-LD icons', () => {
		it('returns live document icon for Confluence provider', () => {
			const data = {
				...baseData,
				'@type': ['Document', 'schema:DigitalDocument'],
				generator: { '@type': 'Object', '@id': CONFLUENCE_GENERATOR_ID },
				'schema:fileFormat': undefined,
			} as JsonLd.Data.BaseData;
			const { icon } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.LiveDocument);
		});

		it('falls back to default icon when no provider match', () => {
			const data = {
				...baseData,
				'@type': ['Document', 'schema:DigitalDocument'],
				generator: { '@type': 'Object', '@id': 'jims-gym' },
				'schema:fileFormat': undefined,
			} as JsonLd.Data.BaseData;
			const { icon } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.File);
		});
	});

	describe('when type is atlassian:Task and provider is Jira', () => {
		describe('returns type icon for Task (using default) as no url is supplied', () => {
			it('returns type icon for Task (using default) as no url is supplied', () => {
				const data: JsonLd.Data.BaseData = {
					...baseData,
					'@type': 'atlassian:Task',
				};
				const { icon } = extractJsonldDataIcon(data) || {};

				expect(icon).toBe(IconType.Task);
			});
		});

		it('returns icon for Task - using default', () => {
			const data: JsonLd.Data.BaseData = {
				...baseData,
				'@type': 'atlassian:Task',
			};
			const { icon } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.Task);
		});

		describe('returns url icon for Task when icon url is passed', () => {
			it('should be correct', () => {
				const iconUrl = 'https://some-icon-url.com';
				const data = {
					...baseData,
					'@type': 'atlassian:Task',
					icon: iconUrl,
				} as JsonLd.Data.Task;

				const { icon, url } = extractJsonldDataIcon(data) || {};
				expect(url).toBe(iconUrl);
				expect(icon).toBeUndefined();
			});
		});

		describe('JiraCustomTaskType', () => {
			const iconUrl = 'https://some-icon-url.com';
			const taskIconUrl = 'https://some-task-icon-url.com';
			const generator = {
				'@type': 'Object',
				'@id': JIRA_GENERATOR_ID,
			};
			const task = {
				'@type': ['Object', 'atlassian:TaskType'],
				'@id': `https://www.atlassian.com/#JiraCustomTaskType`,
				name: 'some-task-name',
				icon: taskIconUrl,
			};
			const taskBaseData = {
				...baseData,
				'@type': 'atlassian:Task',
				generator,
				icon: iconUrl,
				'atlassian:taskType': task,
			};

			it('returns task icon url - task type icon defined', () => {
				const data = { ...taskBaseData, icon: undefined } as JsonLd.Data.Task;

				const { icon, url } = extractJsonldDataIcon(data) || {};

				expect(icon).toBeUndefined();
				expect(url).toBe(taskIconUrl);
			});

			it('returns icon url - top-level icon defined', () => {
				const iconUrl = 'https://some-icon-url.com';
				const data = {
					...taskBaseData,
					'atlassian:taskType': {
						...task,
						icon: undefined,
					},
				} as JsonLd.Data.Task;

				const { icon, url } = extractJsonldDataIcon(data) || {};

				expect(icon).toBeUndefined();
				expect(url).toBe(iconUrl);
			});

			it('returns provider icon - provider icon defined', () => {
				const data = {
					...taskBaseData,
					icon: undefined,
					'atlassian:taskType': {
						...task,
						icon: undefined,
					},
				} as JsonLd.Data.Task;

				const { icon, url } = extractJsonldDataIcon(data) || {};

				expect(icon).toBe(IconType.Task);
				expect(url).toBeUndefined();
			});

			it('returns task icon - default fallback icon', () => {
				const data = {
					...taskBaseData,
					generator: undefined,
					icon: undefined,
					'atlassian:taskType': {
						...task,
						icon: undefined,
					},
				} as JsonLd.Data.Task;

				const { icon, url } = extractJsonldDataIcon(data) || {};

				expect(icon).toBe(IconType.Task);
				expect(url).toBeUndefined();
			});
		});
	});

	describe('when type is atlassian:Goal', () => {
		it('returns icon for Goal - with top level icon', () => {
			const expectUrl = 'https://some-icon-url.com';
			const data: JsonLd.Data.BaseData = {
				...baseData,
				icon: expectUrl,
				'@type': 'atlassian:Goal',
			};
			const { icon, url } = extractJsonldDataIcon(data) || {};

			expect(icon).toBeUndefined();
			expect(url).toBe(expectUrl);
		});

		it('returns icon for Project - no top level icon', () => {
			const data: JsonLd.Data.BaseData = {
				...baseData,
				'@type': 'atlassian:Goal',
			};
			const { icon, url } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.Task);
			expect(url).toBeUndefined();
		});
	});

	describe('when type is atlassian:Project', () => {
		it('returns icon for Project - with top level icon', () => {
			const expectUrl = 'https://some-icon-url.com';
			const data: JsonLd.Data.BaseData = {
				...baseData,
				icon: expectUrl,
				'@type': 'atlassian:Project',
			};
			const { icon, url } = extractJsonldDataIcon(data) || {};

			expect(icon).toBeUndefined();
			expect(url).toBe(expectUrl);
		});

		it('returns icon for Project - no top level icon', () => {
			const data: JsonLd.Data.BaseData = {
				...baseData,
				'@type': 'atlassian:Project',
			};
			const { icon, url } = extractJsonldDataIcon(data) || {};

			expect(icon).toBe(IconType.Project);
			expect(url).toBeUndefined();
		});
	});
});
