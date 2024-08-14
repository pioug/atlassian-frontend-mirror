import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import fetchMock from 'fetch-mock/cjs/client';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { EVENT_CHANNEL } from '../../analytics';
import { DatasourceExperienceIdProvider } from '../../contexts/datasource-experience-id';
import {
	type DatasourceTableStateProps,
	useDatasourceTableState,
} from '../useDatasourceTableState';

const mockDatasourceId: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';
const onAnalyticFireEvent = jest.fn();

const wrapper = ({ children }: React.PropsWithChildren<Partial<DatasourceTableStateProps>>) => (
	<DatasourceExperienceIdProvider>
		<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
			<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
		</AnalyticsListener>
	</DatasourceExperienceIdProvider>
);

jest.mock('@atlaskit/linking-common/sentry', () => {
	const originalModule = jest.requireActual('@atlaskit/linking-common/sentry');
	return {
		...originalModule,
		captureException: jest.fn(),
	};
});

describe('useDatasourceTableState', () => {
	describe('concurrency control', () => {
		const setup = (initialProps: Partial<DatasourceTableStateProps> = {}) => {
			return renderHook(
				(props: Partial<DatasourceTableStateProps> = {}) =>
					useDatasourceTableState({
						datasourceId: mockDatasourceId,
						...props,
					}),
				{ wrapper, initialProps },
			);
		};

		beforeEach(() => {
			fetchMock.reset();

			mockDatasourceFetchRequests({
				datasourceId: mockDatasourceId,
			});
		});

		it('should not see results from multiple renders of changed props + calling reset', async () => {
			const { result, rerender, waitForNextUpdate } = setup({
				parameters: {
					// This cloud ID is mocked to return 1 item
					cloudId: '11111',
					jql: 'project=FOO',
				},
				fieldKeys: ['summary'],
			});

			expect(result.current.responseItems).toHaveLength(0);
			expect(result.current.status).toBe('loading');

			rerender({
				parameters: {
					// This cloud ID is mocked to return 1 item
					cloudId: '11111',
					jql: 'project=BAR',
				},
				fieldKeys: ['description'],
			});

			/**
			 * Simulates parent component calling reset in a useEffect when
			 * parameters have changed
			 */
			act(() => {
				result.current.reset();
			});

			expect(result.current.responseItems).toHaveLength(0);
			expect(result.current.status).toBe('loading');

			await waitForNextUpdate();

			expect(result.current.responseItems).toHaveLength(1);
			expect(result.current.responseItems[0].id.data).toBe('DONUT-11721');

			expect(result.current.status).toBe('resolved');
		});
	});
});
