let mockUseExecuteAtomicAction = jest.fn();

jest.mock('../../../../state/actions', () => {
	return {
		__esModule: true,
		...jest.requireActual('../../../../state/actions'),
		useExecuteAtomicAction: () => mockUseExecuteAtomicAction(),
	};
});

import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { defaultRegistry } from 'react-sweet-state';

import { Store, StoreContainer } from '../../../../state';
import { type DatasourceTypeWithOnlyValues } from '../../types';
import { InlineEdit } from '../inline-edit';

const store = defaultRegistry.getStore(Store);

const testIds = {
	readView: 'mock-read-view',
	editView: 'inline-edit-text',
};

describe('InlineEdit', () => {
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
		const { getByTestId } = render(
			<InlineEdit
				ari={ari}
				columnKey="date"
				readView={<MockReadView ari={ari} />}
				datasourceTypeWithValues={dataValues}
			/>,
		);
		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(getByTestId(testIds.readView));

		expect(getByTestId(testIds.editView)).toBeInTheDocument();

		fireEvent.change(getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(getByTestId(testIds.editView));

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('FoobarFoobar');
		expect(getByTestId(testIds.readView)).toHaveTextContent('FoobarFoobar');
	});

	it('should respond to the commit click but should not trigger update if execute is `undefined` from `useExecuteAtomicAction`', () => {
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
		mockUseExecuteAtomicAction.mockReturnValue({});

		const dataValues: DatasourceTypeWithOnlyValues = { type: 'string', values: ['Blahblah'] };
		const { getByTestId } = render(
			<InlineEdit
				ari={ari}
				columnKey="date"
				readView={<MockReadView ari={ari} />}
				datasourceTypeWithValues={dataValues}
			/>,
		);
		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
		fireEvent.click(getByTestId(testIds.readView));

		expect(getByTestId(testIds.editView)).toBeInTheDocument();

		fireEvent.change(getByTestId(testIds.editView), { target: { value: 'FoobarFoobar' } });
		fireEvent.submit(getByTestId(testIds.editView));

		expect(store.storeState.getState().items[ari].data.date.data).toEqual('Blahblah');
		expect(getByTestId(testIds.readView)).toHaveTextContent('Blahblah');
	});
});
