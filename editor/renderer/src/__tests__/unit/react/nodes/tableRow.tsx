import React from 'react';
import { shallow, mount } from 'enzyme';
import { SortOrder } from '@atlaskit/editor-common/types';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act } from '@testing-library/react';
import TableRow from '../../../../react/nodes/tableRow';

describe('Renderer - React/Nodes/TableRow', () => {
	const tableRow = shallow(<TableRow />);

	it('should create a <tr>-tag', () => {
		expect(tableRow.name()).toEqual('tr');
	});

	describe('with allowColumnSorting', () => {
		const FakeCell = () => (
			<th>
				<p>1</p>
			</th>
		);
		const onSorting = jest.fn();
		const tableOrderStatus = {
			columnIndex: 1,
			order: SortOrder.ASC,
		};

		it('should clone childrens and pass down the props', () => {
			const wrapper = mount(
				<TableRow
					onSorting={onSorting}
					tableOrderStatus={tableOrderStatus}
					allowColumnSorting={true}
				>
					<FakeCell />
					<FakeCell />
					<FakeCell />
				</TableRow>,
				{ attachTo: document.createElement('tbody') },
			);

			wrapper.find(FakeCell).forEach((node, index) => {
				expect(node.prop('columnIndex')).toBe(index);
				expect(node.prop('onSorting')).toBe(onSorting);
			});
		});

		describe('#isHeaderRow', () => {
			it('should return true when rowIndex is 0', () => {
				const wrapper = mount(
					<TableRow
						onSorting={onSorting}
						tableOrderStatus={tableOrderStatus}
						allowColumnSorting={true}
						index={0}
					>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				wrapper.find(FakeCell).forEach((node, index) => {
					expect(node.prop('isHeaderRow')).toBeTruthy();
				});
			});

			it('should return true when rowIndex is empty', () => {
				const wrapper = mount(
					<TableRow
						onSorting={onSorting}
						tableOrderStatus={tableOrderStatus}
						allowColumnSorting={true}
					>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				wrapper.find(FakeCell).forEach((node, index) => {
					expect(node.prop('isHeaderRow')).toBeTruthy();
				});
			});

			it('should return false when rowIndex is greater than zero', () => {
				const wrapper = mount(
					<TableRow
						onSorting={onSorting}
						tableOrderStatus={tableOrderStatus}
						allowColumnSorting={true}
						index={1}
					>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				wrapper.find(FakeCell).forEach((node, index) => {
					expect(node.prop('isHeaderRow')).toBeFalsy();
				});
			});
		});

		describe('with tableOrderStatus', () => {
			it('should return the specific order status to the columnIndex set', () => {
				const wrapper = mount(
					<TableRow
						onSorting={onSorting}
						tableOrderStatus={tableOrderStatus}
						allowColumnSorting={true}
					>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				const child = wrapper.find(FakeCell).at(1);
				expect(child.prop('sortOrdered')).toBe(tableOrderStatus.order);
			});

			it('should return NO_ORDER for other columns', () => {
				const wrapper = mount(
					<TableRow
						onSorting={onSorting}
						tableOrderStatus={tableOrderStatus}
						allowColumnSorting={true}
					>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				const firstChild = wrapper.find(FakeCell).at(0);
				expect(firstChild.prop('sortOrdered')).toBe(SortOrder.NO_ORDER);

				const lastChild = wrapper.find(FakeCell).at(2);
				expect(lastChild.prop('sortOrdered')).toBe(SortOrder.NO_ORDER);
			});
		});
	});

	ffTest.on(
		'platform_editor_table_column_group_width_check_3',
		'colGroupWidths optimized tests',
		() => {
			const FakeCell = () => (
				<td>
					<p>1</p>
				</td>
			);

			it('should pass colGroupWidths to children when colGroupWidths has length with fg on', () => {
				const colGroupWidths = ['100px', '200px', '300px'];
				const wrapper = mount(
					<TableRow>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				act(() => {
					wrapper.setState({ colGroupWidths });
				});

				wrapper.find(FakeCell).forEach((node, index) => {
					expect(node.props()).toEqual({ colGroupWidth: colGroupWidths[index] });
				});
			});

			it('should not pass colGroupWidths to children when colGroupWidths is empty with fg on', () => {
				const wrapper = mount(
					<TableRow>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				act(() => {
					wrapper.setState({ colGroupWidths: [] });
				});

				wrapper.find(FakeCell).forEach((node) => {
					expect(node.props()).toEqual({});
				});
			});

			it('should not pass colGroupWidths to children when colGroupWidths is undefined with fg on', () => {
				const wrapper = mount(
					<TableRow>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				act(() => {
					wrapper.setState({ colGroupWidths: undefined });
				});

				wrapper.find(FakeCell).forEach((node) => {
					expect(node.props()).toEqual({});
				});
			});
		},
	);

	ffTest.off(
		'platform_editor_table_column_group_width_check_3',
		'colGroupWidths unoptimized tests',
		() => {
			const FakeCell = () => (
				<td>
					<p>1</p>
				</td>
			);

			it('should pass colGroupWidths to children when colGroupWidths has length with fg off', () => {
				const colGroupWidths = ['100px', '200px', '300px'];
				const wrapper = mount(
					<TableRow>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				act(() => {
					wrapper.setState({ colGroupWidths });
				});

				wrapper.find(FakeCell).forEach((node, index) => {
					expect(node.props()).toEqual({ colGroupWidth: colGroupWidths[index] });
				});
			});

			it('should pass undefined colGroupWidths to children when colGroupWidths is empty with fg off', () => {
				const wrapper = mount(
					<TableRow>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				act(() => {
					wrapper.setState({ colGroupWidths: [] });
				});

				wrapper.find(FakeCell).forEach((node) => {
					expect(node.props()).toEqual({ colGroupWidth: undefined });
				});
			});

			it('should not pass colGroupWidths to children when colGroupWidths is undefined with fg off', () => {
				const wrapper = mount(
					<TableRow>
						<FakeCell />
						<FakeCell />
						<FakeCell />
					</TableRow>,
					{ attachTo: document.createElement('tbody') },
				);

				act(() => {
					wrapper.setState({ colGroupWidths: undefined });
				});

				wrapper.find(FakeCell).forEach((node) => {
					expect(node.props()).toEqual({});
				});
			});
		},
	);
});
