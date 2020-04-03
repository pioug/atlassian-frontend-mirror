import React from 'react';
import { shallow } from 'enzyme';
import { TableCell } from '../../../../react/nodes/tableCell';

describe('Renderer - React/Nodes/TableCell', () => {
  const baseProps = {
    colspan: 6,
    rowspan: 3,
    background: '#fab',
    colwidth: [10],
  };

  it('should create a <td>-tag', () => {
    const tableCell = shallow(<TableCell />);
    expect(tableCell.name()).toEqual('td');
  });

  it('should render the <td> props', () => {
    const tableRow = shallow(<TableCell {...baseProps} />);
    expect(tableRow.name()).toEqual('td');

    expect(tableRow.prop('rowSpan')).toEqual(3);
    expect(tableRow.prop('colSpan')).toEqual(6);
    expect(tableRow.prop('data-colwidth')).toEqual('10');

    expect(tableRow.prop('style')).toEqual({
      backgroundColor: '#fab',
    });
  });

  it('should render the colwidths', () => {
    const colwidth = [10, 12, 14];
    const tableRow = shallow(<TableCell colwidth={colwidth} />);

    expect(tableRow.prop('data-colwidth')).toEqual('10,12,14');
  });
});
