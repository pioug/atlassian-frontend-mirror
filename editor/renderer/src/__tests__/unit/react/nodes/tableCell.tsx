import React from 'react';
import { render, screen } from '@testing-library/react';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { TableCell } from '../../../../react/nodes/tableCell';

describe('Renderer - React/Nodes/TableCell', () => {
	const baseProps = {
		colspan: 6,
		rowspan: 3,
		background: '#fab',
		colwidth: [10],
	};

	const renderCell = (cell: React.ReactNode) =>
		render(
			<table>
				<tbody>
					<tr>{cell}</tr>
				</tbody>
			</table>,
		);

	it('should create a <td>-tag', () => {
		renderCell(<TableCell />);

		expect(screen.getByRole('cell').tagName).toBe('TD');
	});

	it('should render the <td> props', () => {
		renderCell(<TableCell {...baseProps} />);

		const tableCell = screen.getByRole('cell');

		expect(tableCell.tagName).toBe('TD');
		expect(tableCell).toHaveAttribute('rowspan', '3');
		expect(tableCell).toHaveAttribute('colspan', '6');
		expect(tableCell).toHaveAttribute('data-colwidth', '10');
		expect(tableCell).toHaveStyle({ backgroundColor: '#fab' });
	});

	it('should render the colwidths', () => {
		renderCell(<TableCell colwidth={[10, 12, 14]} />);

		expect(screen.getByRole('cell')).toHaveAttribute('data-colwidth', '10,12,14');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderCell(<TableCell {...baseProps}>content</TableCell>);

		await expect(container).toBeAccessible();
	});

	eeTest.describe('platform_editor_table_menu_updates', 'vertical alignment').variant(true, () => {
		it('should render data-valign and vertical-align on the cell', () => {
			renderCell(<TableCell valign="middle">content</TableCell>);

			const tableCell = screen.getByRole('cell');

			expect(tableCell).toHaveAttribute('data-valign', 'middle');
			expect(tableCell).toHaveStyle({ verticalAlign: 'middle' });
			expect(tableCell).toHaveTextContent('content');
		});
	});

	eeTest.describe('platform_editor_table_menu_updates', 'vertical alignment').variant(false, () => {
		it('should not render data-valign or vertical-align', () => {
			renderCell(<TableCell valign="middle">content</TableCell>);

			const tableCell = screen.getByRole('cell');

			expect(tableCell).not.toHaveAttribute('data-valign');
			expect(tableCell).not.toHaveStyle({ verticalAlign: 'middle' });
		});
	});
});
