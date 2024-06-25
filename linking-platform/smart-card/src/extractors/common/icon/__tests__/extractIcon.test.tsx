import { extractIcon } from '../extractIcon';
import { TEST_BASE_DATA, TEST_URL, TEST_OBJECT } from '../../__mocks__/jsonld';
import { render, screen } from '@testing-library/react';
import { withIntl } from '../../__mocks__/withIntl';
import { type JsonLd } from 'json-ld-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

ffTest.off(
	'platform.linking-platform.smart-card.standardise-smart-link-icon-behaviour',
	'extractors.icon',
	() => {
		it('returns highest priority icon from array of types', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': ['Document', 'schema:BlogPosting'],
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('blog-icon')).toBeVisible();
		});

		it('returns highest priority icon based on icon priority flag', async () => {
			const icon = extractIcon(
				{
					...TEST_BASE_DATA,
					'@type': ['Document', 'schema:BlogPosting'],
					generator: TEST_OBJECT,
				},
				'provider',
			);
			expect(icon).toBe(TEST_URL);
		});

		it('returns icon for singular type', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'schema:BlogPosting',
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('blog-icon')).toBeVisible();
		});

		it('returns icon for Project - with top level icon', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'atlassian:Project',
			});
			expect(icon).toBe(TEST_URL);
		});

		it('returns icon for Project - no top level icon', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				icon: undefined,
				'@type': 'atlassian:Project',
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('project-icon')).toBeVisible();
		});

		it('returns icon for SourceCodeCommit', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'atlassian:SourceCodeCommit',
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('commit-icon')).toBeVisible();
		});

		it('returns icon for SourceCodePullRequest', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'atlassian:SourceCodePullRequest',
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('pull-request-icon')).toBeVisible();
		});

		it('returns icon for SourceCodeReference', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'atlassian:SourceCodeReference',
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('branch-icon')).toBeVisible();
		});

		it('returns icon for SourceCodeRepository', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'atlassian:SourceCodeRepository',
			});
			render(withIntl(icon));
			expect(await screen.findByTestId('repo-icon')).toBeVisible();
		});

		it('returns icon for Document - using file format', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'Document',
				'schema:fileFormat': 'image/png',
			} as JsonLd.Data.Document);
			render(withIntl(icon));
			expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
		});

		it('returns icon for Document - using provider icon', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'Document',
				generator: {
					'@type': 'Object',
					name: 'DocumentGenerator',
					icon: TEST_URL,
				},
			} as JsonLd.Data.Document);
			expect(icon).toBe(TEST_URL);
		});

		it('returns icon for Task - using default', async () => {
			const icon = extractIcon({
				...TEST_BASE_DATA,
				'@type': 'atlassian:Task',
			} as JsonLd.Data.Task);
			render(withIntl(icon));
			expect(await screen.findByTestId('default-task-icon')).toBeVisible();
		});
	},
);

ffTest.on(
	'platform.linking-platform.smart-card.standardise-smart-link-icon-behaviour',
	'extractors.icon',
	() => {
		it('still returns url icon when priority flag is `provider` as this flag does not override standard logic', async () => {
			const URL_ICON = 'https://test-icon-url.com';
			const icon = extractIcon(
				{
					...TEST_BASE_DATA,
					'@type': ['Document', 'schema:BlogPosting'],
					generator: TEST_OBJECT,
					icon: URL_ICON,
				},
				'provider',
			);
			expect(icon).toBe(URL_ICON);
		});

		it('returns url icon over type icon when it is supplied', async () => {
			const URL_ICON = 'https://test-icon-url.com';
			const icon = extractIcon({
				...TEST_BASE_DATA,
				icon: URL_ICON,
				'@type': 'atlassian:Project',
			});
			expect(icon).toBe(URL_ICON);
		});

		describe('when no url icon is supplied', () => {
			const TEST_BASE_DATA_NO_URL_ICON = {
				...TEST_BASE_DATA,
				// type (document type) icon is not used if icon url is present. Individual tests can override this.
				icon: undefined,
			};
			it('still returns type icon when priority flag is `provider` as this flag does not override standard logic', async () => {
				const icon = extractIcon(
					{
						...TEST_BASE_DATA_NO_URL_ICON,
						'@type': ['Document', 'schema:BlogPosting'],
						generator: TEST_OBJECT,
					},
					'provider',
				);
				render(withIntl(icon));
				expect(await screen.findByTestId('blog-icon')).toBeVisible();
			});
			it('returns highest priority type icon from array of types when no icon url supplied', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': ['Document', 'schema:BlogPosting'],
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('blog-icon')).toBeVisible();
			});

			it('returns icon for singular type', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'schema:BlogPosting',
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('blog-icon')).toBeVisible();
			});
			it('returns icon for Project - no top level icon', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					icon: undefined,
					'@type': 'atlassian:Project',
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('project-icon')).toBeVisible();
			});

			it('returns icon for SourceCodeCommit', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'atlassian:SourceCodeCommit',
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('commit-icon')).toBeVisible();
			});

			it('returns icon for SourceCodePullRequest', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'atlassian:SourceCodePullRequest',
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('pull-request-icon')).toBeVisible();
			});

			it('returns icon for SourceCodeReference', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'atlassian:SourceCodeReference',
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('branch-icon')).toBeVisible();
			});

			it('returns icon for SourceCodeRepository', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'atlassian:SourceCodeRepository',
				});
				render(withIntl(icon));
				expect(await screen.findByTestId('repo-icon')).toBeVisible();
			});

			it('returns icon for Document - using file format', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'Document',
					'schema:fileFormat': 'image/png',
				} as JsonLd.Data.Document);
				render(withIntl(icon));
				expect(await screen.findByTestId('document-file-format-icon')).toBeVisible();
			});

			it('returns icon for Document - using provider icon', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'Document',
					generator: {
						'@type': 'Object',
						name: 'DocumentGenerator',
						icon: TEST_URL,
					},
				} as JsonLd.Data.Document);
				expect(icon).toBe(TEST_URL);
			});
			it('returns harcoded icon for type `atlassian:Goal` when no file format included', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'atlassian:Goal',
				} as JsonLd.Data.Goal);
				render(withIntl(icon));
				expect(await screen.findByTestId('task-icon')).toBeVisible();
			});
			it('returns icon for Task - using default', async () => {
				const icon = extractIcon({
					...TEST_BASE_DATA_NO_URL_ICON,
					'@type': 'atlassian:Task',
				} as JsonLd.Data.Task);
				render(withIntl(icon));
				expect(await screen.findByTestId('default-task-icon')).toBeVisible();
			});
		});
	},
);
