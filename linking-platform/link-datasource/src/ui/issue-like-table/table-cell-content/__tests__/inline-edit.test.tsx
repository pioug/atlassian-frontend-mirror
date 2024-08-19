let mockUseExecuteAtomicAction = jest.fn();

jest.mock('../../../../state/actions', () => {
	return {
		__esModule: true,
		...jest.requireActual('../../../../state/actions'),
		useExecuteAtomicAction: () => mockUseExecuteAtomicAction(),
	};
});

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { FlagsProvider } from '@atlaskit/flag';

import { Store, StoreContainer } from '../../../../state';
import { type DatasourceTypeWithOnlyValues } from '../../types';
import { InlineEdit } from '../inline-edit';

const store = defaultRegistry.getStore(Store);

const testIds = {
	readView: 'mock-read-view',
	editView: 'inline-edit-text',
};

describe('InlineEdit', () => {
	const setup = (props: React.ComponentProps<typeof InlineEdit>) => {
		render(
			<IntlProvider locale="en">
				<FlagsProvider>
					<InlineEdit {...props} />,
				</FlagsProvider>
			</IntlProvider>,
		);
	};

	beforeEach(() => {
		store.storeState.resetState();
		mockUseExecuteAtomicAction.mockClear();
	});

	const MockReadView = ({ ari }: { ari: string }) => {
		return (
			<StoreContainer>
				<div data-testid={testIds.readView}>
					{store.storeState.getState().items[ari].data.date.data}
				</div>
			</StoreContainer>
		);
	};

	it('should respond to the commit click and update the view and state when `execute` from `useExecuteAtomicAction` exists and its call resolves successfully', () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();

		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('FoobarFoobar');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('FoobarFoobar');
	});

	it('should shows error flag when `execute` fails', async () => {
		const execute = jest.fn().mockRejectedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});
		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		fireEvent.click(screen.getByTestId(testIds.readView));
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		const flag = await screen.findByRole('alert');
		expect(flag).toBeInTheDocument();
	});

	it('should NOT update the view or state with an empty string', () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.change(screen.getByTestId(testIds.editView), { target: { value: '' } });
		fireEvent.submit(screen.getByTestId(testIds.editView));

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});

	it('should NOT update the view or state on Blur', () => {
		const execute = jest.fn().mockResolvedValue({});
		const ari = 'ari/test';
		store.storeState.setState({
			items: {
				[ari]: {
					ari,
					integrationKey: 'jira',
					data: {
						ari: { data: ari },
						date: { data: 'Blahblah' },
					},
				},
			},
		});

		mockUseExecuteAtomicAction.mockReturnValue({ execute });

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };

		setup({
			ari,
			columnKey: 'date',
			execute,
			datasourceTypeWithValues: dataValues,
			readView: <MockReadView ari={ari} />,
		});

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(screen.getByTestId(testIds.readView));

		expect(screen.getByTestId(testIds.editView)).toBeInTheDocument();
		fireEvent.keyDown(screen.getByTestId(testIds.editView), {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});

		expect(execute).not.toHaveBeenCalled();
		expect(screen.queryByTestId(testIds.editView)).not.toBeInTheDocument();
		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(screen.getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});
});
