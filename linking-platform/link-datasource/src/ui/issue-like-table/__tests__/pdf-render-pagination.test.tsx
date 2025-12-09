import React from 'react';

import { act, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { SmartCardProvider, useSmartCardContext } from '@atlaskit/link-provider';
import {
	MockIntersectionObserverFactory,
	type MockIntersectionObserverOpts,
} from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import {
	type DatasourceDataResponseItem,
	type DatasourceResponseSchemaProperty,
} from '@atlaskit/linking-types/datasource';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import SmartLinkClient from '../../../../examples-helpers/smartLinkCustomClient';
import { DatasourceExperienceIdProvider } from '../../../contexts/datasource-experience-id';
import { Store } from '../../../state';
import { IssueLikeDataTableView } from '../index';
import { type IssueLikeDataTableViewProps } from '../types';

jest.mock('../../../state/actions', () => {
	return {
		__esModule: true,
		...jest.requireActual('../../../state/actions'),
		useExecuteAtomicAction: () => jest.fn()(),
	};
});

jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartCardContext: jest.fn(),
}));

describe('IssueLikeDataTableView - PDF render pagination', () => {
	let mockGetEntries: jest.Mock;
	let mockIntersectionObserverOpts: MockIntersectionObserverOpts;
	const store = defaultRegistry.getStore(Store);

	const setup = (props: Partial<IssueLikeDataTableViewProps>) => {
		const items = Array(3)
			.fill(null)
			.map<DatasourceDataResponseItem>((_, i) => ({
				id: {
					data: `id${i}`,
				},
			}));
		const itemIds = store.actions.onAddItems(items, 'jira', 'work-item');
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'id',
				title: 'ID',
				type: 'string',
			},
		];

		const onNextPage = jest.fn(() => {});
		const onLoadDatasourceDetails = jest.fn(() => Promise.resolve());

		const smartLinkClient = new SmartLinkClient();

		const renderResult = render(
			<DatasourceExperienceIdProvider>
				<IntlProvider locale="en">
					<SmartCardProvider client={smartLinkClient}>
						<IssueLikeDataTableView
							testId="sometable"
							status={'resolved'}
							onNextPage={onNextPage}
							onLoadDatasourceDetails={onLoadDatasourceDetails}
							hasNextPage={false}
							items={items}
							itemIds={itemIds}
							columns={columns}
							visibleColumnKeys={['id']}
							{...props}
						/>
					</SmartCardProvider>
				</IntlProvider>
			</DatasourceExperienceIdProvider>,
		);

		return {
			...renderResult,
			onNextPage,
		};
	};

	beforeEach(() => {
		jest.useFakeTimers();
		store.storeState.resetState();
		mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: false }]);
		mockIntersectionObserverOpts = {
			disconnect: jest.fn(),
			getMockEntries: mockGetEntries,
		};
		window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);

		// Default: not in PDF render mode
		asMock(useSmartCardContext).mockReturnValue({
			value: {
				shouldControlDataExport: false,
			},
		});
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	ffTest.on('lp_disable_datasource_table_max_height_restriction', '', () => {
		describe('when in PDF render mode', () => {
			beforeEach(() => {
				asMock(useSmartCardContext).mockReturnValue({
					value: {
						shouldControlDataExport: true,
					},
				});
			});

			it('should automatically call onNextPage when hasNextPage is true and status is resolved', async () => {
				const { onNextPage } = setup({
					hasNextPage: true,
					status: 'resolved',
				});

				act(() => {
					jest.advanceTimersByTime(20);
				});

				expect(onNextPage).toHaveBeenCalledTimes(1);
				expect(onNextPage).toHaveBeenCalledWith({
					isSchemaFromData: false,
					shouldRequestFirstPage: false,
				});
			});

			it('should not call onNextPage when hasNextPage is false', async () => {
				const { onNextPage } = setup({
					hasNextPage: false,
					status: 'resolved',
				});

				act(() => {
					jest.advanceTimersByTime(20);
				});

				expect(onNextPage).not.toHaveBeenCalled();
			});

			it('should not call onNextPage when status is loading', async () => {
				const { onNextPage } = setup({
					hasNextPage: true,
					status: 'loading',
				});

				act(() => {
					jest.advanceTimersByTime(20);
				});

				expect(onNextPage).not.toHaveBeenCalled();
			});

			it('should not trigger scroll-based pagination when in PDF render mode', async () => {
				const { onNextPage } = setup({
					hasNextPage: true,
					status: 'resolved',
				});

				// Simulate scroll to bottom
				mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

				// Clear the mock after PDF auto-pagination call
				onNextPage.mockClear();

				act(() => {
					jest.runOnlyPendingTimers();
				});

				// Should NOT have scroll-based calls (shouldForceRequest: true)
				expect(onNextPage).not.toHaveBeenCalledWith(
					expect.objectContaining({ shouldForceRequest: true }),
				);
			});
		});

		describe('when not in PDF render mode', () => {
			beforeEach(() => {
				asMock(useSmartCardContext).mockReturnValue({
					value: {
						shouldControlDataExport: false,
					},
				});
			});

			it('should not automatically call onNextPage from PDF effect', async () => {
				const { onNextPage } = setup({
					hasNextPage: true,
					status: 'resolved',
				});

				act(() => {
					jest.advanceTimersByTime(20);
				});

				// No calls from PDF render effect (shouldRequestFirstPage: false)
				expect(onNextPage).not.toHaveBeenCalledWith(
					expect.objectContaining({ shouldRequestFirstPage: false }),
				);
			});

			it('should call onNextPage when scrolled to bottom (normal pagination)', async () => {
				const { onNextPage } = setup({
					hasNextPage: true,
					status: 'resolved',
				});

				// Simulate scroll to bottom
				mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

				act(() => {
					jest.runOnlyPendingTimers();
				});

				expect(onNextPage).toHaveBeenCalledWith({
					isSchemaFromData: false,
					shouldForceRequest: true,
				});
			});
		});
	});

	ffTest.off('lp_disable_datasource_table_max_height_restriction', '', () => {
		it('should not trigger PDF render pagination when feature flag is off', async () => {
			// Even with shouldControlDataExport true, the flag being off means isInPDFRender is always false
			asMock(useSmartCardContext).mockReturnValue({
				value: {
					shouldControlDataExport: true,
				},
			});

			const { onNextPage } = setup({
				hasNextPage: true,
				status: 'resolved',
			});

			act(() => {
				jest.advanceTimersByTime(20);
			});

			// No PDF render effect calls when feature flag is off
			expect(onNextPage).not.toHaveBeenCalledWith(
				expect.objectContaining({ shouldRequestFirstPage: false }),
			);
		});

		it('should still call onNextPage when scrolled to bottom (normal pagination)', async () => {
			asMock(useSmartCardContext).mockReturnValue({
				value: {
					shouldControlDataExport: true,
				},
			});

			const { onNextPage } = setup({
				hasNextPage: true,
				status: 'resolved',
			});

			// Simulate scroll to bottom
			mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

			act(() => {
				jest.runOnlyPendingTimers();
			});

			expect(onNextPage).toHaveBeenCalledWith({
				isSchemaFromData: false,
				shouldForceRequest: true,
			});
		});
	});
});
