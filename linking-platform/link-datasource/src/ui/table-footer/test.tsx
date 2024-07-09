import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../analytics';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../assets-modal';

import { TableFooter, type TableFooterProps } from './index';

const onAnalyticFireEvent = jest.fn();
const mockOnRefresh = jest.fn();
const mockURL =
	'https://a4t-moro.jira-dev.com/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC';

const renderFooter = (
	isLoading: TableFooterProps['isLoading'],
	itemCount: TableFooterProps['itemCount'],
	onRefresh: TableFooterProps['onRefresh'],
	noUrl?: boolean,
) => {
	return render(
		<IntlProvider locale="en">
			<TableFooter
				datasourceId={'datasourceId'}
				isLoading={isLoading}
				itemCount={itemCount}
				onRefresh={onRefresh}
				url={noUrl ? undefined : mockURL}
			/>
		</IntlProvider>,
	);
};

const renderAssetsFooter = (
	isLoading: TableFooterProps['isLoading'],
	itemCount: TableFooterProps['itemCount'],
	onRefresh: TableFooterProps['onRefresh'],
	noUrl?: boolean,
) => {
	return render(
		<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
			<IntlProvider locale="en">
				<TableFooter
					datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
					isLoading={isLoading}
					itemCount={itemCount}
					onRefresh={onRefresh}
					url={noUrl ? undefined : mockURL}
				/>
			</IntlProvider>
		</AnalyticsListener>,
	);
};

describe('TableFooter', () => {
	it('should have url, show correct last sync time and item count if one is passed in and table is not loading', async () => {
		const { getByTestId } = renderFooter(false, 25, mockOnRefresh);
		const syncText = getByTestId('sync-text');
		const itemCount = getByTestId('item-count');
		expect(syncText).toHaveTextContent('Synced just now');
		expect(itemCount).toHaveTextContent('25 items');
		const issueCountLink = getByTestId('item-count-url');
		expect(issueCountLink).toHaveAttribute('target', '_blank');
		expect(issueCountLink).toHaveAttribute('href', mockURL);
		expect(issueCountLink).not.toHaveStyle('text-decoration: none');
	});

	it('if no url, should show correct last sync time and item count without underline if one is passed in table is not loading', async () => {
		const { getByTestId } = renderFooter(false, 25, mockOnRefresh, true);
		const syncText = getByTestId('sync-text');
		const itemCount = getByTestId('item-count');
		expect(syncText).toHaveTextContent('Synced just now');
		expect(itemCount).toHaveTextContent('25 items');
		const issueCountLink = getByTestId('item-count-url');
		expect(issueCountLink).toHaveStyle('text-decoration: none');
	});

	it('should show correct text if item count is 1', async () => {
		const { getByTestId } = renderFooter(false, 1, mockOnRefresh);
		const syncText = getByTestId('sync-text');
		const itemCount = getByTestId('item-count');
		expect(syncText).toHaveTextContent('Synced just now');
		expect(itemCount).toHaveTextContent('1 item');
	});

	it('should show correct text if item count is a number large enough to contain commas', async () => {
		const { getByTestId } = renderFooter(false, 100123, mockOnRefresh);
		const syncText = getByTestId('sync-text');
		const itemCount = getByTestId('item-count');
		expect(syncText).toHaveTextContent('Synced just now');
		expect(itemCount).toHaveTextContent('100,123 items');
	});

	it('should hide item count if 0 and show Loading text if table is loading', async () => {
		const { getByTestId, queryByTestId } = renderFooter(true, 0, mockOnRefresh);
		const itemCount = queryByTestId('item-count');
		const syncText = getByTestId('sync-text');
		expect(syncText).toHaveTextContent('Loading...');
		expect(itemCount).not.toBeInTheDocument();
	});

	it('should show item count as 0 if item count is 0 and table is not loading', async () => {
		const { getByTestId } = renderFooter(false, 0, mockOnRefresh);
		const itemCount = getByTestId('item-count');
		const syncText = getByTestId('sync-text');
		expect(syncText).toHaveTextContent('Synced just now');
		expect(itemCount).toHaveTextContent('0 items');
	});

	it('should call onRefresh when refresh button is clicked', async () => {
		const { getByTestId } = renderFooter(false, 25, mockOnRefresh);
		const button = getByTestId('refresh-button');
		fireEvent.click(button);
		expect(mockOnRefresh).toBeCalledTimes(1);
	});

	it('should not show item count if not passed in', async () => {
		const { getByTestId, queryByTestId } = renderFooter(false, undefined, mockOnRefresh);
		const itemCount = queryByTestId('item-count');
		expect(itemCount).not.toBeInTheDocument();

		const syncText = getByTestId('sync-text');
		const refreshButton = getByTestId('refresh-button');
		expect(syncText).toHaveTextContent('Synced just now');
		expect(refreshButton).toBeInTheDocument();
	});

	it('should not show refresh button or sync text if onRefresh() not passed in', async () => {
		const { queryByTestId, getByTestId } = renderFooter(false, 25, undefined);
		const itemCount = getByTestId('item-count');
		expect(itemCount).toHaveTextContent('25 items');

		const syncText = queryByTestId('sync-text');
		const refreshButton = queryByTestId('refresh-button');
		expect(syncText).not.toBeInTheDocument();
		expect(refreshButton).not.toBeInTheDocument();
	});

	it('should not show table footer at all if item count and onRefresh() are not passed in', async () => {
		const { queryByTestId } = renderFooter(false, undefined, undefined);
		const footer = queryByTestId('table-footer');
		expect(footer).not.toBeInTheDocument();
	});

	it('should render the footer without the count if the count passed is below 0', async () => {
		const { queryByTestId } = renderFooter(false, -1, mockOnRefresh);
		const footer = queryByTestId('table-footer');
		const itemCount = queryByTestId('item-count');

		expect(itemCount).not.toBeInTheDocument();
		expect(footer).toBeInTheDocument();
	});

	ffTest.on('platform.linking-platform.datasource.limit-total-results_8wqcd', 'flag is on', () => {
		it('should show 1000+ with Assets DatasourceId', async () => {
			const { queryByTestId } = renderAssetsFooter(false, 1250, mockOnRefresh);
			const itemCount = queryByTestId('item-count');

			expect(itemCount).toHaveTextContent('1,000+ items');
		});

		it('should show full count with non-Assets DatasourceId', async () => {
			const { queryByTestId } = renderFooter(false, 1250, mockOnRefresh);
			const itemCount = queryByTestId('item-count');

			expect(itemCount).toHaveTextContent('1,250 items');
		});
	});

	ffTest.off(
		'platform.linking-platform.datasource.limit-total-results_8wqcd',
		'flag is off',
		() => {
			it('should show full count with Assets DatasourceId', async () => {
				const { queryByTestId } = renderAssetsFooter(false, 1250, mockOnRefresh);
				const itemCount = queryByTestId('item-count');

				expect(itemCount).toHaveTextContent('1,250 items');
			});
		},
	);

	it('should render the powered by JSM Assets link with Assets DatasourceId', async () => {
		const { queryByTestId } = renderAssetsFooter(false, 25, mockOnRefresh);
		const assetsLink = queryByTestId('powered-by-jsm-assets-link');

		expect(assetsLink).toBeInTheDocument();
	});

	it('should fire ui.link.clicked.poweredBy when Assets link is clicked', async () => {
		const { findByTestId } = renderAssetsFooter(false, 25, mockOnRefresh);
		const assetsLink = await findByTestId('powered-by-jsm-assets-link');
		expect(assetsLink).toBeInTheDocument();

		await assetsLink.click();
		await waitFor(() => {
			expect(onAnalyticFireEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						action: 'clicked',
						actionSubject: 'link',
						actionSubjectId: 'poweredBy',
						eventType: 'ui',
						attributes: {
							componentHierarchy: 'datasourceTable',
							extensionKey: 'jsm-cmdb-gateway',
						},
					}),
				}),
				EVENT_CHANNEL,
			);
		});
	});

	it('should not render the powered by JSM Assets link on footer if datasource is not Assets with FF on', async () => {
		const { queryByTestId } = renderFooter(false, 25, mockOnRefresh);
		const assetsLink = queryByTestId('powered-by-jsm-assets-link');

		expect(assetsLink).not.toBeInTheDocument();
	});
});
