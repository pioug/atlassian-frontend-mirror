import React from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import SmartLinkClient from '../../../../../examples-helpers/smartLinkCustomClient';
import { useCurrentUserInfo } from '../../basic-filters/hooks/useCurrentUserInfo';
import { ConfluenceSearchConfigModal } from '../index';

jest.mock('../../basic-filters/hooks/useCurrentUserInfo');

const DATASOURCE_ID = 'confluence-datasource-id';

describe('ConfluenceSearchConfigModal', () => {
	const userPerformSearchWithCurrentTerm = async () => {
		await userEvent.click(
			screen.getByTestId('confluence-search-datasource-modal--basic-search-button'),
		);
	};

	const userPerformSearchWithTerm = async (term: string) => {
		const input = screen.getByTestId('confluence-search-datasource-modal--basic-search-input');
		await userEvent.clear(input);
		await userEvent.type(input, term);

		await userPerformSearchWithCurrentTerm();

		await screen.findByTestId('confluence-search-datasource-table');
	};

	const userChangeSite = async (site: string) => {
		const trigger = await within(
			await screen.findByTestId('confluence-search-datasource-modal--site-selector--trigger'),
		).findByRole('button');
		await userEvent.type(trigger, site);
		await userEvent.type(trigger, '{enter}');
	};

	const userClickInsert = async () => {
		await userEvent.click(screen.getByTestId('confluence-search-datasource-modal--insert-button'));
	};

	const userOpenModal = async (
		props: Partial<React.ComponentProps<typeof ConfluenceSearchConfigModal>> = {},
	) => {
		render(
			<IntlProvider locale="en">
				<SmartCardProvider client={new SmartLinkClient()}>
					<ConfluenceSearchConfigModal
						datasourceId={DATASOURCE_ID}
						onCancel={() => {}}
						onInsert={() => {}}
						{...props}
					/>
				</SmartCardProvider>
			</IntlProvider>,
		);

		await screen.findByTestId('confluence-search-datasource-modal--site-selector--trigger');
	};

	const mockFetchDataResponse = (pages: { id: string; title: string }[]) => ({
		meta: {
			access: 'granted',
			visibility: 'restricted',
			auth: [],
		},
		data: {
			items: pages.map((page) => ({
				id: { data: page.id },
				title: { data: page.title },
			})),
			schema: {
				defaultProperties: ['title'],
				properties: [
					{
						key: 'title',
						title: 'Title',
						type: 'string',
					},
				],
			},
			totalCount: 1,
		},
	});

	const givenDatasourceForAllQueries = (pages: { id: string; title: string }[]) => {
		fetchMock.post(
			{
				url: `/gateway/api/object-resolver/datasource/${DATASOURCE_ID}/fetch/data`,
			},
			mockFetchDataResponse(pages),
		);
	};

	const givenDatasourceDataForQuery = (
		{
			searchString,
			spaceKeys,
			entityTypes,
		}: {
			searchString?: string;
			spaceKeys?: string[];
			entityTypes?: string[];
		},
		pages: { id: string; title: string }[],
	) => {
		fetchMock.post((url: string, options: any) => {
			const { parameters } = JSON.parse(options.body);

			const sortArray = (arr: string[] = []) => {
				return [...arr].sort((a, b) => a.localeCompare(b));
			};

			return (
				url === `/gateway/api/object-resolver/datasource/${DATASOURCE_ID}/fetch/data` &&
				parameters.searchString === searchString &&
				sortArray(entityTypes).toString() === sortArray(parameters.entityTypes).toString() &&
				sortArray(spaceKeys).toString() === sortArray(parameters.spaceKeys).toString()
			);
		}, mockFetchDataResponse(pages));
	};

	const mockAvailableSites = () => {
		fetchMock.post({
			url: '/gateway/api/available-sites',
			response: {
				sites: [
					{
						cloudId: '1',
						url: 'https://hello.atlassian.net',
						displayName: 'Hello Site',
					},
					{
						cloudId: '2',
						url: 'https://world.atlassian.net',
						displayName: 'World Site',
					},
				],
			},
		});
	};

	beforeEach(() => {
		fetchMock.reset();
		mockAvailableSites();
		asMock(useCurrentUserInfo).mockReturnValue({
			user: {
				accountId: '123',
			},
		});
	});

	it('should return all results when user search with empty search term', async () => {
		givenDatasourceForAllQueries([
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/921076941',
				title: 'Confluence Page 1',
			},
		]);

		await userOpenModal();

		await userPerformSearchWithCurrentTerm();

		expect(
			await within(await screen.findByTestId('confluence-search-datasource-table')).findByText(
				'Confluence Page 1',
			),
		).toBeVisible();
	});

	it('should return filtered results when user search with search term', async () => {
		givenDatasourceDataForQuery({ searchString: 'Confluence Page 1' }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/921076941',
				title: 'Confluence Page 1',
			},
		]);

		await userOpenModal();

		await userPerformSearchWithTerm('Confluence Page 1');

		expect(
			await within(await screen.findByTestId('confluence-search-datasource-table')).findByText(
				'Confluence Page 1',
			),
		).toBeVisible();
	});

	it('should return results matching the latest search term when user search multiple times', async () => {
		givenDatasourceDataForQuery({ searchString: 'search term 1' }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/1',
				title: 'Confluence Page 1',
			},
		]);
		givenDatasourceDataForQuery({ searchString: 'search term 2' }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/2',
				title: 'Confluence Page 2',
			},
		]);

		await userOpenModal();

		await userPerformSearchWithTerm('search term 1');
		await userPerformSearchWithTerm('search term 2');

		expect(
			await within(await screen.findByTestId('confluence-search-datasource-table')).findByText(
				'Confluence Page 2',
			),
		).toBeVisible();
	});

	it('should load results that reflect valid parameters on modal open even if no form fields are interacted with', async () => {
		givenDatasourceDataForQuery({ searchString: '', spaceKeys: ['foo'], entityTypes: ['page'] }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/1',
				title: 'Confluence Page 1',
			},
		]);
		givenDatasourceDataForQuery(
			{ searchString: '', spaceKeys: ['space-key-1'], entityTypes: ['blog'] },
			[
				{
					id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:blog/1',
					title: 'Confluence Blog 1',
				},
			],
		);

		const onInsert = jest.fn();

		await userOpenModal({
			parameters: {
				cloudId: '1',
				searchString: '',
				spaceKeys: ['space-key-1'],
			},
			overrideParameters: {
				entityTypes: ['blog'],
			},
			onInsert,
		});

		const table = await screen.findByTestId('confluence-search-datasource-table');
		expect(await within(table).findByText('Confluence Blog 1')).toBeVisible();

		await userClickInsert();

		expect(onInsert).toHaveBeenCalledWith(
			expect.objectContaining({
				attrs: expect.objectContaining({
					url: 'https://hello.atlassian.net/wiki/search?text=',
					datasource: expect.objectContaining({
						id: 'confluence-datasource-id',
						parameters: expect.objectContaining({
							cloudId: '1',
							spaceKeys: ['space-key-1'],
							entityTypes: ['blog'],
						}),
					}),
				}),
			}),
			expect.anything(),
		);
	});

	it('should load results that reflect overrides on modal open if parameters prop is a valid set of parameters', async () => {
		givenDatasourceDataForQuery({ searchString: 'search term 1', entityTypes: ['page'] }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/1',
				title: 'Confluence Page 1',
			},
		]);
		givenDatasourceDataForQuery({ searchString: 'search term 1', entityTypes: ['blog'] }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:blog/1',
				title: 'Confluence Blog 1',
			},
		]);

		await userOpenModal({
			parameters: {
				cloudId: '1',
				searchString: 'search term 1',
			},
			overrideParameters: {
				entityTypes: ['blog'],
			},
		});

		const table = await screen.findByTestId('confluence-search-datasource-table');
		expect(await within(table).findByText('Confluence Blog 1')).toBeVisible();
		expect(within(table).queryByText('Confluence Page 1')).not.toBeInTheDocument();
	});

	it('should reset parameters but preserve parameters not controlled by form fields', async () => {
		givenDatasourceDataForQuery({ searchString: 'search term 1', spaceKeys: ['space-key-1'] }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:page/1',
				title: 'Confluence Page 1',
			},
		]);
		givenDatasourceDataForQuery({ searchString: 'search term 2', spaceKeys: ['space-key-1'] }, [
			{
				id: 'ari:cloud:confluence:61ae97a3-2835-4727-82d6-3d6a055c39a9:blog/1',
				title: 'Confluence Blog 1',
			},
		]);

		const onInsert = jest.fn();

		await userOpenModal({
			onInsert,
			parameters: {
				cloudId: '1',
				searchString: 'search term 1',
				spaceKeys: ['space-key-1'],
			},
		});

		expect(
			await within(await screen.findByTestId('confluence-search-datasource-table')).findByText(
				'Confluence Page 1',
			),
		).toBeVisible();

		await userChangeSite('World Site');

		await userPerformSearchWithTerm('search term 2');

		expect(
			await within(await screen.findByTestId('confluence-search-datasource-table')).findByText(
				'Confluence Blog 1',
			),
		).toBeVisible();

		await userClickInsert();

		expect(onInsert).toHaveBeenCalledWith(
			expect.objectContaining({
				attrs: expect.objectContaining({
					url: 'https://hello.atlassian.net/wiki/search?text=search+term+2',
					datasource: expect.objectContaining({
						id: 'confluence-datasource-id',
						parameters: expect.objectContaining({
							cloudId: '1',
							searchString: 'search term 2',
							spaceKeys: ['space-key-1'],
						}),
					}),
				}),
			}),
			expect.anything(),
		);
	});
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<SmartCardProvider client={new SmartLinkClient()}>
					<ConfluenceSearchConfigModal
						datasourceId={DATASOURCE_ID}
						onCancel={() => {}}
						onInsert={() => {}}
					/>
				</SmartCardProvider>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
