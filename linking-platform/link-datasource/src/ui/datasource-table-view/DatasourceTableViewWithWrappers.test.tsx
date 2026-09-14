import React, { Suspense } from 'react';

import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { DatasourceTableView } from './datasourceTableView';
import { DatasourceTableViewWithWrappers } from './DatasourceTableViewWithWrappers';
import { type DatasourceTableViewProps } from './types';

jest.mock('./datasourceTableView', () => ({
	DatasourceTableView: jest.fn(),
}));

const experiment = 'platform_datasource_hydration_stability';
const mockTable = jest.mocked(DatasourceTableView);

const createProps = (): DatasourceTableViewProps => ({
	datasourceId: 'jira-datasource',
	parameters: { cloudId: 'test-cloud', jql: 'key = TEST-1' },
	url: 'https://example.atlassian.net/issues/?jql=key%3DTEST-1',
	visibleColumnKeys: ['summary', 'status'],
	columnCustomSizes: { summary: 236 },
	wrappedColumnKeys: ['summary'],
	sortState: { key: 'summary', direction: 'ASC' },
});

const Table = ({ onVisibleColumnKeysChange, ...props }: DatasourceTableViewProps) => (
	<button onClick={() => onVisibleColumnKeysChange?.(['status'])}>{JSON.stringify(props)}</button>
);

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage -- The table UI is mocked; these tests cover hydration and prop forwarding.
describe('DatasourceTableViewWithWrappers', () => {
	beforeEach(() => {
		mockTable.mockImplementation(Table);
	});

	describe('hydration', () => {
		let root: Root | undefined;
		let container: HTMLDivElement;
		let resolveTable: () => void;
		let tableReady: boolean;

		beforeEach(() => {
			container = document.createElement('div');
			document.body.appendChild(container);
			tableReady = false;
			const pendingTable = new Promise<void>((resolve) => {
				resolveTable = resolve;
			});
			mockTable.mockImplementation((props) => {
				if (!tableReady) {
					throw pendingTable;
				}
				return <Table {...props} />;
			});
		});

		afterEach(async () => {
			await act(async () => {
				root?.unmount();
				tableReady = true;
				resolveTable();
			});
			root = undefined;
			container.remove();
		});

		const hydrateAndUpdate = async () => {
			// The server has finished the table; its client implementation is still suspended.
			container.innerHTML = renderToString(
				<Suspense fallback={<div />}>
					<Table {...createProps()} />
				</Suspense>,
			);
			const serverTable = screen.getByRole('button');
			const onRecoverableError = jest.fn();
			await act(async () => {
				root = hydrateRoot(container, <DatasourceTableViewWithWrappers {...createProps()} />, {
					onRecoverableError,
				});
			});
			await act(async () => {
				root?.render(<DatasourceTableViewWithWrappers {...createProps()} />);
			});
			await act(async () => {
				tableReady = true;
				resolveTable();
			});
			return { serverTable, onRecoverableError };
		};

		it('preserves the server table when equivalent props arrive before hydration finishes', async () => {
			mockExpEnabled(experiment);
			const { serverTable, onRecoverableError } = await hydrateAndUpdate();

			expect(onRecoverableError).not.toHaveBeenCalled();
			expect(screen.getByRole('button')).toBe(serverTable);
			expect(serverTable).toHaveTextContent('key = TEST-1');

			const changedProps = {
				...createProps(),
				parameters: { cloudId: 'test-cloud', jql: 'key = TEST-2' },
			};
			await act(async () => {
				root?.render(<DatasourceTableViewWithWrappers {...changedProps} />);
			});
			expect(serverTable).toHaveTextContent('key = TEST-2');
			expect(onRecoverableError).not.toHaveBeenCalled();
		});

		it('retains the existing hydration bailout when the experiment is disabled', async () => {
			mockExpDisabled(experiment);
			const { serverTable, onRecoverableError } = await hydrateAndUpdate();

			expect(onRecoverableError).toHaveBeenCalledWith(
				expect.objectContaining({
					message: expect.stringContaining('received an update before it finished hydrating'),
				}),
				expect.anything(),
			);
			expect(screen.getByRole('button')).not.toBe(serverTable);
		});
	});

	it.each<[string, Partial<DatasourceTableViewProps>]>([
		['datasource ID', { datasourceId: 'other-datasource' }],
		['query', { parameters: { cloudId: 'test-cloud', jql: 'key = TEST-2' } }],
		['cloud', { parameters: { cloudId: 'other-cloud', jql: 'key = TEST-1' } }],
		['URL', { url: 'https://example.atlassian.net/issues/?jql=key%3DTEST-2' }],
		['column order', { visibleColumnKeys: ['status', 'summary'] }],
		['column removal', { visibleColumnKeys: ['summary'] }],
		['column width', { columnCustomSizes: { summary: 381 } }],
		['column width reset', { columnCustomSizes: undefined }],
		['wrapped columns', { wrappedColumnKeys: ['status'] }],
		['wrapped column reset', { wrappedColumnKeys: undefined }],
		['scrollable height', { scrollableContainerHeight: 800 }],
		['sort column', { sortState: { key: 'status', direction: 'ASC' } }],
		['sort direction', { sortState: { key: 'summary', direction: 'DESC' } }],
		['sort reset', { sortState: undefined }],
	])('propagates a changed %s', async (_name, change) => {
		mockExpEnabled(experiment);
		const { rerender } = render(<DatasourceTableViewWithWrappers {...createProps()} />);
		await screen.findByRole('button');

		const nextProps = { ...createProps(), ...change };
		rerender(<DatasourceTableViewWithWrappers {...nextProps} />);

		expect(screen.getByRole('button').textContent).toBe(JSON.stringify(nextProps));
	});

	it('uses the latest callback when equivalent configuration is rerendered', async () => {
		mockExpEnabled(experiment);
		const user = userEvent.setup();
		const previousCallback = jest.fn();
		const nextCallback = jest.fn();
		const { rerender } = render(
			<DatasourceTableViewWithWrappers
				{...createProps()}
				onVisibleColumnKeysChange={previousCallback}
			/>,
		);
		await screen.findByRole('button');
		rerender(
			<DatasourceTableViewWithWrappers
				{...createProps()}
				onVisibleColumnKeysChange={nextCallback}
			/>,
		);
		await user.click(screen.getByRole('button'));

		expect(nextCallback).toHaveBeenCalledWith(['status']);
		expect(previousCallback).not.toHaveBeenCalled();
	});
});
